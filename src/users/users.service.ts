import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./user.entity";
import { Category } from "../categories/category.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;

    if (createUserDto.categories) {
      const categories = await this.categoryRepository.findBy({ id: In(createUserDto.categories) });
      user.categories = categories;
    }

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: ['categories'] });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age) user.age = updateUserDto.age;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.gender) user.gender = updateUserDto.gender;

    if (updateUserDto.categories) {
      const categories = await this.categoryRepository.findByIds(updateUserDto.categories);
      user.categories = categories;
    }

    return this.userRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
