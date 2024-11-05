import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Category } from "../categories/category.entity";

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
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

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable()
  categories: Category[];
}
