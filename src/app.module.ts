import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./users/user.entity";
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>("POSTGRES_HOST"),
          port: configService.get<number>("POSTGRES_PORT"),
          password: configService.get<string>("POSTGRES_PASSWORD"),
          username: configService.get<string>("POSTGRES_USER"),
          entities: [User],
          database: configService.get<string>("POSTGRES_DATABASE"),
          autoLoadEntities: true,
          synchronize: configService.get<boolean>("SYNCHRONIZE"),
        })
      }),
    UsersModule,
    CategoriesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
