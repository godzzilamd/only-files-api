import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePresignedUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'Filename can not be empty' })
  fileName: string;

  @IsString()
  @IsNotEmpty({ message: 'Filetype can not be empty' })
  fileType: string;

  @IsInt()
  size: number;

  @IsString()
  @IsEnum(['uploading', 'uploaded', 'error'])
  @IsNotEmpty({ message: 'Status can not be empty' })
  status: string;
}
