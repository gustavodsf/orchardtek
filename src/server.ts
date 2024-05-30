import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import errorHandler from '@/common/middleware/error.handler';
import rateLimiter from '@/common/middleware/rate.limiter';
import requestLogger from '@/common/middleware/request.logger';
import { env } from '@/common/utils/env.config';
import { healthCheckRouter } from '@/healthCheck/health.check.router';

import { postsRouter } from './posts/posts.router';

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

export { app, logger };
