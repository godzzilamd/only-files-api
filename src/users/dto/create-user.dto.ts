import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { UniqueEmailValidator } from '../validators/email.validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  full_name: string;

  @IsString()
  cover_photo: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  @Validate(UniqueEmailValidator)
  email: string;

  @IsInt()
  age: number;

  @IsString()
  job_title: string;

  @IsString()
  @IsEnum(['female', 'male', 'unknown'])
  gender: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  categories: number[];

  @IsString()
  @IsEnum(['platform', 'google'])
  provider: string;
}
