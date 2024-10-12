import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() createCategoryDto: { name: string }): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
