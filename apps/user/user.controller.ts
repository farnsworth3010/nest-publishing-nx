import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts/user/user.pattern';
import { CreateUserDto } from '@app/contracts/user/create-user.dto';
import { User, UserRO } from '@app/contracts/user/user.entity';
import { UserItem } from '@app/contracts/user/user.interface';
import { UpdateUserDto } from '@app/contracts/user/update-user.dto';
import { DeleteResult } from 'typeorm';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.FIND_BY_EMAIL)
  async findByEmail(@Payload() email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  async findAll(): Promise<UserItem[]> {
    return await this.userService.findAll();
  }

  @MessagePattern(USER_PATTERNS.FIND_BY_ID)
  async findById(@Payload() userId: string): Promise<UserRO> {
    return await this.userService.findById(+userId);
  }

  @MessagePattern(USER_PATTERNS.UPDATE)
  async update(
    @Payload() { id, dto }: { id: number; dto: UpdateUserDto },
  ): Promise<User> {
    return await this.userService.update(id, dto);
  }

  @MessagePattern(USER_PATTERNS.CREATE)
  async create(@Payload() userData: CreateUserDto): Promise<UserRO> {
    return this.userService.create(userData);
  }

  @MessagePattern(USER_PATTERNS.FIND_ONE)
  async findOne(
    @Payload() { email, password }: { email: string; password: string },
  ): Promise<User> {
    return this.userService.findOne({ email, password });
  }

  @MessagePattern(USER_PATTERNS.REMOVE)
  async delete(@Payload() userId: string): Promise<DeleteResult> {
    return await this.userService.delete(+userId);
  }
}
