import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const ormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('POSTGRES_HOST'),
    port: config.get<number>('POSTGRES_PORT'),
    username: config.get<string>('POSTGRES_USER'),
    password: config.get<string>('POSTGRES_PASSWORD'),
    database: config.get<string>('POSTGRES_DATABASE'),
    entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
    migrations: [join(__dirname, '..', 'migrations', '*.{js,ts}')],

    logging: true,
    migrationsRun: false,
    synchronize: config.get<string>('NODE_ENV') !== 'production',
  }),
};
