import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/src/**/*.entity.{js,ts}'],
  migrations: [__dirname + '/src/migrations/*.{js,ts}'],
  synchronize: false, // Always false in production
  logging: true,
});
