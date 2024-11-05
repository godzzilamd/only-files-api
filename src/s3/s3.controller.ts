import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { CreatePresignedUrlDto } from './dto/s3.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateFileCategoriesDto } from './dto/update-file-categories.dto';

@Controller('api/s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-presigned-urls')
  async generatePresignedUrls(
    @Request() req,
    @Body() files: CreatePresignedUrlDto[],
  ) {
    return await this.s3Service.generatePresignedUrls(+req.user.id, files);
  }

  @Get(':id/status-update')
  async updateFileStatus(@Param('id') id: string) {
    return await this.s3Service.updateFileStatus(+id);
  }

  @Post(':id/update-categories')
  async updateFileCategories(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileCategoriesDto: UpdateFileCategoriesDto,
  ) {
    return this.s3Service.updateFileCategories(id, updateFileCategoriesDto);
  }
}
