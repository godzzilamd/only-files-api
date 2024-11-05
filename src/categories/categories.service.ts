import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

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
    // Calculate offset for pagination
    const skip = (page - 1) * perPage;

    // Fetch unique categories with pagination
    const [categories, total] = await this.categoriesRepository
      .createQueryBuilder('category')
      .distinct(true) // Select unique categories
      .skip(skip)
      .take(perPage)
      .getManyAndCount(); // Returns both data and total count for pagination

    return {
      data: categories,
      total,
      page,
      lastPage: Math.ceil(total / perPage),
    };
  }
}
