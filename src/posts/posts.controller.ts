import { Request, Response } from 'express';

import { logger } from '@/server';

const getSpecificPosts = (request: Request, response: Response) => {
  logger.info(`${request}, ${response}`);
};

export { getSpecificPosts };
