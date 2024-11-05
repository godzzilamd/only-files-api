import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { File } from '../s3/s3.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();

    user.username = createUserDto.username;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.password = await bcrypt.hash(createUserDto.password, 5);
    user.gender = createUserDto.gender;

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({ relations: ['categories'] });
  }

  async findOne(id: number) {
    const user = this.userRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(userId: number) {
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.age) user.age = updateUserDto.age;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.gender) user.gender = updateUserDto.gender;

    return this.userRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async getUserFiles(userId: number, page: number, limit: number) {
    const [files, total] = await this.fileRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['categories'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data: files,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getPublicUsersList(): Promise<any[]> {
    // Load all users with their files and categories
    const users = await this.userRepository.find({
      relations: ['files', 'files.categories'],
    });

    // Map each user to include unique categories
    return users.map((user) => {
      const uniqueCategories = new Map<number, Category>();

      // Extract categories from each file and ensure they are unique
      user.files.forEach((file) => {
        file.categories.forEach((category) => {
          uniqueCategories.set(category.id, category); // Use Map to keep only unique categories
        });
      });

      return {
        id: user.id,
        username: user.username,
        categories: Array.from(uniqueCategories.values()),
      };
    });
  }
}
