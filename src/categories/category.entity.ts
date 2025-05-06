import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { File } from '../files/file.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => File, (file) => file.categories)
  users: File[];
}
