import express, { Router } from 'express';

import { validateRequest } from '@/common/middleware/validate.request';

import { createPost, deletePost, returnAllPosts, returnSpecificPosts, updateTitleOrContent } from './posts.controller';
import { CreatePostsSchema, GetPostsSchema, UpdatePostsSchema } from './posts.model';

export const postsRouter: Router = (() => {
  const router = express.Router();

  router.get('/', returnAllPosts);

  router.post('/', validateRequest(CreatePostsSchema), createPost);

  router.get('/:id', validateRequest(GetPostsSchema), returnSpecificPosts);

  router.patch('/:id', validateRequest(UpdatePostsSchema), updateTitleOrContent);

  router.delete('/:id', validateRequest(GetPostsSchema), deletePost);

  return router;
})();
