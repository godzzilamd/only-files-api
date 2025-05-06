import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from '../files/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  job_title: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'unknown'], nullable: true })
  gender: string;

  @Column({ type: 'enum', enum: ['admin', 'regular'], default: 'regular' })
  role: 'admin' | 'regular';

  @OneToMany(() => File, (file) => file.user)
  files: File[];
}
