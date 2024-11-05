import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomValidationPipe } from '../helpers/validation';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('regular', 'admin')
  @Get('me')
  me(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-files')
  getUserFiles(
    @Query('page', ParseIntPipe) page = 1,
    @Query('perPage', ParseIntPipe) limit = 10,
    @Request() req,
  ) {
    return this.userService.getUserFiles(req.user.id, page, limit);
  }

  @Get('public')
  getPublicUsersList() {
    return this.userService.getPublicUsersList();
  }

  @Post()
  @UsePipes(new CustomValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
