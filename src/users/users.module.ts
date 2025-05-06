import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UniqueEmailValidator } from './validators/email.validator';
import { File } from '../files/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, File])],
  controllers: [UsersController],
  providers: [UsersService, UniqueEmailValidator],
  exports: [UsersService],
})
export class UsersModule {}
