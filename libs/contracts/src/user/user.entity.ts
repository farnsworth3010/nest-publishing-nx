import { Office } from '@app/contracts/office/office.entity';
import { Role } from '@app/contracts/role/role.entity';
import { Sale } from '@app/contracts/sale/sale.entity';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';
import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @ManyToOne(() => Office, (office) => office.users, {
    eager: true,
    nullable: true,
  })
  office: Office;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];
}

export class UserData {
  id?: number;
  name: string;
  email: string;
  role: Role;
  token?: string;
  tempPassword?: string;
  office: Office;
}

export class UserRO {
  user: UserData;
}
