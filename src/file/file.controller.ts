import { Controller, Get, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('by-categories')
  getByCategories(@Query('ids') ids: string) {
    const categoryIds = ids.split(',').map(id => +id);
    return this.fileService.findByCategories(categoryIds);
  }
}
