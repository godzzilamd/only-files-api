import { Controller, Get, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { File } from './file.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('search')
  async searchFiles(
    @Query('name') name?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('userId') userId?: string,
  ): Promise<File[]> {
    const categoryIdsArray = categoryIds
      ? categoryIds
          .split(',')
          .map((id) => parseInt(id, 10))
          .filter(Boolean)
      : undefined;

    return this.filesService.searchFiles({
      name,
      categoryIds: categoryIdsArray,
      userId: userId ? parseInt(userId, 10) : undefined,
    });
  }
}
