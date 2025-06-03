import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomValidationPipe } from '../helpers/validation';
import { UsersService } from '../users/users.service';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  @Post('google-login')
  async googleLogin(@Body('accessToken') token: string) {
    const userData = await this.authService.verifyGoogleToken(token);

    console.log(userData, 'userData');

    const createdUserData = this.usersService.importUser(userData);

    return this.authService.login(createdUserData);
  }
}
