import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = this.formatErrors(errors);

        return new BadRequestException({
          statusCode: 400,
          messages: formattedErrors,
          error: 'Bad Request',
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]) {
    const result = {};

    errors.forEach((error) => {
      const { property, constraints } = error;

      if (constraints) {
        result[property] = Object.values(constraints);
      }
    });

    return result;
  }
}
