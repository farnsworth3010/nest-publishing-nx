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
import { Role } from '@app/contracts/role/role.entity';
import { Office } from '@app/contracts/office/office.entity';
import { Sale } from '@app/contracts/sale/sale.entity';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
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
