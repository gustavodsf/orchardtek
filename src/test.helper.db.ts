import { DataSource } from 'typeorm';

import { Post } from './posts/posts.model';

export class TestHelper {
  private static _instance: TestHelper;

  private constructor() {}

  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  private dbConnect!: DataSource;

  getRepo(entity: string) {
    return this.dbConnect.getRepository(entity);
  }

  async setupTestDB() {
    const entitiesList = [Post];

    this.dbConnect = new DataSource({
      type: 'sqlite',
      database: './src/database/database.sqlite',
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: entitiesList,
    });

    await this.dbConnect.initialize();
  }

  teardownTestDB() {
    if (this.dbConnect.isInitialized) this.dbConnect.destroy();
  }
}
