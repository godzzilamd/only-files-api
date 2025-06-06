import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserCredentials(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      role: user.role,
    };
  }

  async signUp(user: any) {
    const createdUser = await this.usersService.createUser(user);

    return {
      access_token: this.jwtService.sign({
        email: createdUser.email,
        sub: createdUser.id,
        role: createdUser.role,
      }),
      role: createdUser.role,
    };
  }

  async verifyGoogleToken(token: string) {
    try {
      return await axios.get<any, AxiosResponse<any>>(
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: err.response.data.error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
