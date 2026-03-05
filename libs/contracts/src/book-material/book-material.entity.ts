import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '@app/contracts/book/book.entity';
import { Material } from '@app/contracts/material/material.entity';

@Entity()
export class BookMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Book, (book) => book.bookMaterials, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Material, (material) => material.bookMaterials, {
    eager: false,
  })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column()
  book_id: number;

  @Column()
  material_id: number;
}
