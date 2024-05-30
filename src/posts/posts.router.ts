import express, { Router } from 'express';

import { validateRequest } from '@/common/middleware/validate.request';

import { getSpecificPosts } from './posts.controller';
import { GetPostsSchema } from './posts.model';

export const postsRouter: Router = (() => {
  const router = express.Router();

  router.get('/:id', validateRequest(GetPostsSchema), getSpecificPosts);

  return router;
})();
