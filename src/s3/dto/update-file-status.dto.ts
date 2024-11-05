import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateFileStatusDto {
  @IsString()
  @IsEnum(['uploading', 'uploaded', 'error'])
  @IsNotEmpty({ message: 'Status can not be empty' })
  status: string;
}
