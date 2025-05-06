import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './file.entity';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, User, Category])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
