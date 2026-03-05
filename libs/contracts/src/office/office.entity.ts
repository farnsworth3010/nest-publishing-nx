import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@app/contracts/user/user.entity';
import { Sale } from '@app/contracts/sale/sale.entity';

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => User, (user) => user.office)
  users: User[];

  @OneToMany(() => Sale, (sale) => sale.office)
  sales: Sale[];
}
