import { dbManager } from '@/server';

import { Post } from './posts.model';

export async function updateTitleContent(param: { id: string; title: string; content: string }) {
  const { id, title, content } = param;
  const postRepository = dbManager.getDataSource().getRepository(Post);
  return await postRepository.update( id, {
    title: title,
    content: content
  })
}


export const deletePost = async (id: number) => {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  await postRepository.delete({id: id})
};


export async function savePost(post: Post) {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  const dbPost = await postRepository.insert(post)
  return dbPost
}


export const findAll = async () => {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  const allPosts = await postRepository.find();
  return allPosts;
};

export const findSpecificPost = async (id: number) => {
  const postRepository = dbManager.getDataSource().getRepository(Post);
  const post = await postRepository.findOne({
    where: {
      id: id,
    },
  });
  return post;
};
