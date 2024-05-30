import { faker } from '@faker-js/faker';
import { email } from 'envalid';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { In } from 'typeorm';

import { ServiceResponse } from '@/common/utils/types';
import { app, dbManager } from '@/server';

import { Post } from './posts.model';

describe('Post Routers', () => {
  it('GET /posts/abscd - fail', async () => {
    const response = await request(app).get('/posts/abcd');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a numeric value,params.id is id must be a positive number');
  });

  it('GET /posts/-10 - fail', async () => {
    const response = await request(app).get('/posts/-10');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a positive number');
  });

  it('GET /posts - success', async () => {
    await dbManager.initializeDataSource();

    const fakePost = {
      author: faker.person.fullName(),
      title: faker.word.words(3),
      content: faker.word.words(10),
      email: faker.internet.email(),
    };

    const postRepository = dbManager.getDataSource().getRepository(Post);
    await postRepository.insert({ ...fakePost });

    const response = await request(app).get('/posts');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.status).toEqual('success');

    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    postRepository.delete({
      id: In(allPostsIds),
    });

    await dbManager.getDataSource().destroy();
  });
});
