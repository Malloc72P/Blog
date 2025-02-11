import { AppDataSource } from '@src/database/database.provider';
import ShowSeeder from '@src/show/show.seed';
import UserSeeder from '@src/user/user.seed';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const dataSourceOption = {
  ...AppDataSource.options,
  seeds: [UserSeeder, ShowSeeder],
};

export default new DataSource(dataSourceOption as DataSourceOptions & SeederOptions);
