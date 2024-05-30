import 'reflect-metadata';

import { DataSource, DataSourceOptions } from 'typeorm';

import { logger } from '@/server';

import { Post } from './posts/posts.model';

class DatabaseManager {
  private datasourceOptions!: DataSourceOptions;
  private dataSource!: DataSource;

  constructor(private config: DataSourceOptions) {
    this.datasourceOptions = config;
  }

  getDataSource() {
    return this.dataSource;
  }

  async initializeDataSource() {
    this.dataSource = new DataSource({
      ...this.datasourceOptions,
      entities: [Post],
    });

    await this.dataSource
      .initialize()
      .then(async () => {
        logger.info('Data source initialized');
      })
      .catch((error) => console.log(error));
  }
}

export default DatabaseManager;
