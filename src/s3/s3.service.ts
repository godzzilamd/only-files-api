import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { CreatePresignedUrlDto } from './dto/s3.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './s3.entity';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { UpdateFileCategoriesDto } from './dto/update-file-categories.dto';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async generatePresignedUrls(userId: number, files: CreatePresignedUrlDto[]) {
    const promises = files.map(async (file) => {
      const newFile = await this.create({ ...file, userId });

      const url = this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: file.fileName,
        Expires: 60 * 5,
        ContentType: file.fileType,
      });

      return {
        file: {
          id: newFile.id,
          name: newFile.name,
        },
        url,
      };
    });

    return await Promise.all(promises);
  }

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
}
