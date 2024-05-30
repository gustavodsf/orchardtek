import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleServiceResponse } from '@/common/utils/http.handlers';
import { ResponseStatus, ServiceResponse } from '@/common/utils/types';
import { Post } from '@/posts/posts.model';
import { logger } from '@/server';

import * as postService from './posts.service';

export const returnSpecificPosts = (request: Request, response: Response) => {
  logger.info(`Going to get the post with id `);
};

export const returnAllPosts = async (request: Request, response: Response) => {
  logger.info(`Going to return all posts`);
  const posts = await postService.findAll();
  const serviceResponse = new ServiceResponse<Post[]>(ResponseStatus.Success, 'Posts found', posts, StatusCodes.OK);
  handleServiceResponse(serviceResponse, response);
};

export const updateTitleOrContent = (request: Request, response: Response): void => {
  logger.info(`Going to update the title or content of the post with id `);
};

export const createPost = (request: Request, response: Response): void => {
  logger.info(`Going to create a post`);
};

export const deletePost = (request: Request, response: Response): void => {
  logger.info(`Going to return delete a post with id`);
};
