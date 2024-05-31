import { dbManager } from '@/server';

import { Post } from './posts.model';

export const findAll = async () => {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  const allPosts = await postRepository.find();
  return allPosts;
};
