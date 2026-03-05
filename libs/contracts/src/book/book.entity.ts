import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from '@app/contracts/sale/sale.entity';
import { Category } from '@app/contracts/category/category.entity';
import { Author } from '@app/contracts/author/author.entity';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pages: number;

  @Column({ type: 'money' })
  value: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  publishingStart: Date;

  @Column({ nullable: true })
  publishingEnd: Date;

  @OneToMany(() => Sale, (sale) => sale.book)
  sales: Sale[];

  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Author, { eager: true })
  @JoinTable()
  authors: Author[];

  @OneToMany(() => BookMaterial, (bookMaterial) => bookMaterial.book, {
    eager: true,
  })
  bookMaterials: BookMaterial[];
}
