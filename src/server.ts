import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';
import { DataSourceOptions } from 'typeorm';

import errorHandler from '@/common/middleware/error.handler';
import rateLimiter from '@/common/middleware/rate.limiter';
import requestLogger from '@/common/middleware/request.logger';
import { env } from '@/common/utils/env.config';
import { healthCheckRouter } from '@/healthCheck/health.check.router';

import DatabaseManager from './datasource';
import { postsRouter } from './posts/posts.router';

const datasourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: './src/database/database.sqlite',
  synchronize: true,
  logging: true,
};

// Initialize databaseManager object and initialize data source
const dbManager: DatabaseManager = new DatabaseManager(datasourceOptions);
dbManager
  .initializeDataSource()
  .then(() => {
    logger.info('Datasource initialized!');
  })
  .catch(() => {
    logger.error('Problem to start our datasource!');
  });

const logger = pino({ name: 'server start' });
const app: Express = express();

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/posts', postsRouter);

// Error handlers
app.use(errorHandler());

export { app, dbManager, logger };
