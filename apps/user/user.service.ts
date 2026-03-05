import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserData, UserRO } from '@app/contracts/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Role } from '@app/contracts/role/role.entity';
import { Office } from '@app/contracts/office/office.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '@app/contracts/user/login-user.dto';
import { addMinutes } from 'date-fns';
import { UserItem } from '@app/contracts/user/user.interface';
import * as generator from 'generate-password';
import * as argon2 from 'argon2';
import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { validate } from 'class-validator';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Office) private officeRepository: Repository<Office>,
    private jwtService: JwtService,
  ) {}

  async findOne({ email, password }: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException({ message: 'not found' }, HttpStatus.NOT_FOUND);
    }

    Logger.log('pass');
    Logger.log(password);

    // generates temp password for new users
    if (!password && !user?.password) {
      const tempPassword = generator.generate({
        length: 10,
        numbers: true,
      });

      user.password = await argon2.hash(tempPassword);

      await this.userRepository.save(user);

      user['tempPassword'] = tempPassword;

      return user;
    } else {
      if (await argon2.verify(user.password, password)) return user;
    }

    throw new HttpException(
      { message: 'Password is incorrect' },
      HttpStatus.UNAUTHORIZED,
    );
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const { name, email, password, roleId } = dto;
    const user = await this.userRepository.findOneBy({ email: email });

    if (user) {
      const errors = { email: "You can't use this email." };

      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.officeId) {
      const office: Office | null = await this.officeRepository.findOneBy({
        id: dto.officeId,
      });

      if (!office) {
        throw new HttpException(
          { message: 'Office does not exist' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });

    if (!role) {
      throw new HttpException(
        { message: 'Role not found' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;
    newUser.role = role;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      const _errors = { username: 'User input is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.#buildUserRO(savedUser);
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const toUpdate = await this.userRepository.findOneBy({ id });

    if (toUpdate) {
      const updated = Object.assign(toUpdate, dto);

      return await this.userRepository.save(updated);
    }

    const errors = { User: 'not found' };
    throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      const errors = { User: 'not found' };
      throw new HttpException({ errors }, 404);
    }

    return this.#buildUserRO(user);
  }

  async findAll(): Promise<UserItem[]> {
    return (await this.userRepository.find()).map((user: User) => ({
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
    }));
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user: User | null = await this.userRepository.findOneBy({
      email: email,
    });

    if (user) {
      return this.#buildUserRO(user);
    }

    const errors = { User: 'not found' };
    throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
  }

  public generateJWT(user: User) {
    const today = new Date();
    const exp = addMinutes(today, 60).getTime();

    return this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp,
    });
  }

  #buildUserRO(user: User, withToken: boolean = false) {
    const data: UserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      office: user.office,
    };

    if (withToken) {
      data.token = this.generateJWT(user);
    }

    return { user: data };
  }
}
