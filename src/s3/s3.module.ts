import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './s3.entity';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([File, User, Category]),
  ],
  providers: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
