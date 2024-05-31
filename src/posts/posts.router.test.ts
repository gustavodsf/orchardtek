import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { In } from 'typeorm';

import { ServiceResponse } from '@/common/utils/types';
import { app, dbManager } from '@/server';
import { TestHelper } from '@/test.helper.db';

import { Post } from './posts.model';

describe('Post Routers', () => {
  const fakePost = {
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = dbManager.getDataSource().getRepository(Post);
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = dbManager.getDataSource().getRepository(Post);
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

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

    const response = await request(app).get('/posts');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.status).toEqual('success');
  });
});
