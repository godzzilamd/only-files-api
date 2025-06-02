import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpException, Get, UseGuards, Req
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { CustomValidationPipe } from '../helpers/validation';
import { GoogleAuthGuard } from './google-auth.guard';

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

  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Initiates the Google OAuth2 login flow
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    // Handles the Google OAuth2 callback and returns user info or tokens
    return req.user;
  }
}
