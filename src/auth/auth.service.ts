import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
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
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
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
}
