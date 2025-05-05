import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
  ) {}

  async findByCategories(categoryIds: number[]) {
    return this.fileRepo
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .andWhere('file.status = :status', { status: 'uploaded' })
      .getMany();
  }
}
