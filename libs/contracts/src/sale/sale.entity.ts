import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Office } from '@app/contracts/office/office.entity';
import { Book } from '@app/contracts/book/book.entity';
import { User } from '@app/contracts/user/user.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Office, (office) => office.sales, { nullable: true })
  office: Office;

  @ManyToOne(() => Book, (book) => book.sales)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  date: Date;

  @Column()
  amount: number;

  @Column({ type: 'money' })
  price: number;

  @Column()
  isExternal: boolean;

  @Column()
  bookId: number;

  @Column()
  userId: number;
}
