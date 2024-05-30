import { dbManager } from '@/server';

import { Post } from './posts.model';

export const findAll = () => {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  return postRepository.find();
};
