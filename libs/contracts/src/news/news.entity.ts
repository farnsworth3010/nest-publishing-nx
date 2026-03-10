import { Author } from '@app/contracts/author/author.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column( 'text' )
  content: string;

  @Column( { nullable: true } )
  publishedAt?: Date;

  @ManyToOne( () => Author, { nullable: true, eager: true } )
  writer?: Author;
}
