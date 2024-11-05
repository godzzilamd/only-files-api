import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty({ message: 'FileName can not be empty' })
  fileName: string;

  @IsString()
  @IsNotEmpty({ message: 'FileType can not be empty' })
  fileType: string;

  @IsInt()
  size: number;

  @IsString()
  @IsEnum(['uploading', 'uploaded', 'error'])
  status: string;

  @IsInt()
  userId: number;
}
