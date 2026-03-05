import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookMaterial } from '@app/contracts/book-material/book-material.entity';

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  amount: number;

  @OneToMany(() => BookMaterial, (bookMaterial) => bookMaterial.material, {
    eager: false,
  })
  bookMaterials: BookMaterial[];
}
