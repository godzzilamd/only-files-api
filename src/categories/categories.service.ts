import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOneBy({ id });
  }

  create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  async getUniqueCategories(page: number, perPage: number) {
    const skip = (page - 1) * perPage;

    const [categories, total] = await this.categoriesRepository
      .createQueryBuilder('category')
      .distinct(true)
      .skip(skip)
      .take(perPage)
      .getManyAndCount();

    return {
      data: categories,
      total,
      page,
      lastPage: Math.ceil(total / perPage),
    };
  }
}
