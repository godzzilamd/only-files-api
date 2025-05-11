import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto } from '../s3/dto/create-file.dto';
import { UpdateFileCategoriesDto } from '../s3/dto/update-file-categories.dto';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create({ userId, ...createFileDto }: CreateFileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const file: File = new File();

    file.user = user;
    file.name = createFileDto.fileName;
    file.type = createFileDto.fileType;
    file.size = createFileDto.size;
    file.status = createFileDto.status;

    return this.fileRepository.save(file);
  }

  async updateFileStatus(id: number) {
    const file = await this.fileRepository.findOneBy({ id });

    file.status = 'uploaded';

    return this.fileRepository.save(file);
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
      relations: ['categories'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async updateFileCategories(
    fileId: number,
    updateFileCategoriesDto: UpdateFileCategoriesDto,
  ): Promise<File> {
    const { categoryNames } = updateFileCategoriesDto;

    // Find the file
    const file = await this.findOne(fileId);

    // Find or create categories based on provided names
    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        let category = await this.categoryRepository.findOne({
          where: { name },
        });

        if (!category) {
          category = this.categoryRepository.create({ name });
          await this.categoryRepository.save(category);
        }
        return category;
      }),
    );

    // Update the file's categories
    file.categories = categories;

    return this.fileRepository.save(file); // Save the file with updated categories
  }

  async searchFiles(params: {
    name?: string;
    categoryIds?: number[];
    userId?: number;
    page: number;
    perPage: number;
  }) {
    const { name, categoryIds, userId, page = 1, perPage = 15 } = params;

    const skip = (page - 1) * perPage;

    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.categories', 'category')
      .leftJoinAndSelect('file.user', 'user');

    if (name) {
      query.andWhere('file.name ILIKE :name', { name: `%${name}%` });
    }

    if (categoryIds && categoryIds.length > 0) {
      query.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (userId) {
      query.andWhere('user.id = :userId', { userId });
    }

    query.distinct(true);

    const [files, total] = await query.skip(skip).take(perPage).getManyAndCount();

    return {
      data: files,
      total,
      page,
      lastPage: Math.ceil(total / perPage),
    };
  }
}

// async getUniqueCategories(page: number, perPage: number) {
//   const skip = (page - 1) * perPage;
//
//   const [categories, total] = await this.categoriesRepository
//     .createQueryBuilder('category')
//     .distinct(true)
//     .skip(skip)
//     .take(perPage)
//     .getManyAndCount();
//
//   return {
//     data: categories,
//     total,
//     page,
//     lastPage: Math.ceil(total / perPage),
//   };
// }
