import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { FilesService } from '../files/files.service';
import { File } from '../files/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "../users/user.entity";
import { Category } from "../categories/category.entity";

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User, File, Category])],
  providers: [S3Service, FilesService],
  controllers: [S3Controller],
})
export class S3Module {}
