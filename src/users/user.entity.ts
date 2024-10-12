import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../categories/category.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  job_title: string;



  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'unknown'] })
  gender: string;

  @Column({ type: 'enum', enum: ['admin', 'regular'], default: 'regular' })
  role: 'admin' | 'regular';

  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable()
  categories: Category[];
}
