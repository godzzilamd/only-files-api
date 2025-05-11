import { Controller, Get, Query } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('search')
  async searchFiles(
    @Query('name') name?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
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
      page,
      perPage,
    });
  }
}
