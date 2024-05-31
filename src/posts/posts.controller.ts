import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleServiceResponse } from '@/common/utils/http.handlers';
import { ResponseStatus, ServiceResponse } from '@/common/utils/types';
import { Post } from '@/posts/posts.model';
import { logger } from '@/server';

import * as postService from './posts.service';

export const returnSpecificPosts = async (request: Request, response: Response) => {
  logger.info(`Going to get the post with id `);
  const { id } = request.params;

  const post = await postService.findSpecificPost(parseInt(id, 10));
  const serviceResponse = new ServiceResponse<Post| null>(ResponseStatus.Success, 'Post found', post, StatusCodes.OK);
  handleServiceResponse(serviceResponse, response);
};

export const returnAllPosts = async (request: Request, response: Response) => {
  logger.info(`Going to return all posts`);
  const posts = await postService.findAll();
  const serviceResponse = new ServiceResponse<Post[]>(ResponseStatus.Success, 'Posts found', posts, StatusCodes.OK);
  handleServiceResponse(serviceResponse, response);
};

export const updateTitleOrContent = async (request: Request, response: Response): void => {
  logger.info(`Going to update the title or content of the post with id `);
  const { id } = request.params;
  const { title, content } = request.body;
  const posts = await postService.updateTitleContent({ id, title, content});
  const serviceResponse = new ServiceResponse<Post[]>(ResponseStatus.Success, 'Post updated', posts, StatusCodes.OK);
  handleServiceResponse(serviceResponse, response);
};

export const createPost = async (request: Request, response: Response) => {
  logger.info(`Going to create a post`);
  let post = request.body
  post = await postService.savePost(post);
  const serviceResponse = new ServiceResponse<Post>(ResponseStatus.Success, 'Post saved', post, StatusCodes.CREATED);
  handleServiceResponse(serviceResponse, response);
};

export const deletePost = async (request: Request, response: Response) => {
  logger.info(`Going to return delete a post with id`);
  const id = parseInt(request.params.id, 10);
  await postService.deletePost(id);
  const serviceResponse = new ServiceResponse<{ id: number }>(
    ResponseStatus.Success,
    'post was deleted',
    { id: id },
    StatusCodes.OK
  );
  handleServiceResponse(serviceResponse, response);
};
