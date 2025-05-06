import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 100, default: 0 })
  size: number;

  @Column({
    type: 'enum',
    enum: ['uploading', 'uploaded', 'error'],
    default: 'uploading',
  })
  status: string;

  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.files)
  user: User;
}
