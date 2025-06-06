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
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('api/auth')
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

  @Post('google')
  async googleLogin(@Body('accessToken') token: string) {
    const { data } = await this.authService.verifyGoogleToken(token);

    const foundedUser = await this.usersService.findByEmail(data.email);

    if (foundedUser) {
      return this.authService.login(foundedUser);
    }

    const createdUserData = this.usersService.importUser({
      username: data.name,
      email: data.email,
      cover_photo: data.picture,
      verified_email: true,
    } as UpdateUserDto);

    return this.authService.login(createdUserData);
  }
}
