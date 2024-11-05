import {
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The email $value is already in use. Please choose another email.';
  }
}
