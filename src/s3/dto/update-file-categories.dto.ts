import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateFileCategoriesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryNames: string[];
}
