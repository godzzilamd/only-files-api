import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomValidationPipe } from '../helpers/validation';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new CustomValidationPipe())
  async login(@Body() body: any) {
    const user = await this.authService.validateUserCredentials(
      body.email,
      body.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.authService.login(user);
  }

  @Post('sign-up')
  @UsePipes(new CustomValidationPipe())
  async signUp(@Body() body: any) {
    return this.authService.signUp(body);
  }
}
