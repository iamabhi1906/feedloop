import 'dotenv/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  entities: [join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'database/migrations/*.{ts,js}')],

  seeds: [join(__dirname, 'database/seeds/*.{ts,js}')],
  factories: [],

  synchronize: false,
  logging: true,
} as DataSourceOptions & SeederOptions);
