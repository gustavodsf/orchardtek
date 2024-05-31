import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { In } from 'typeorm';

import { ServiceResponse } from '@/common/utils/types';
import { app } from '@/server';
import { TestHelper } from '@/test.helper.db';
import TestAgent from 'supertest/lib/agent';


describe('Create a Post', () => {
  let server!: TestAgent;
  const fakePost = {
    id: 10,
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    server = request(app)
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

  it('POST /posts - fail missing all inputs', async () => {
    const response = await server
      .post('/posts')
      .type('json')
      .send({})
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.data).toEqual(null);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual(
      'body.title is Title is required,body.email is Email is required,body.content is Content is required,body.author is Author is required'
    );
  });

  it('POST /posts - fail all inputs undefined', async () => {
    const response = await server
      .post('/posts')
      .type('json')
      .send({
        author: undefined,
        email: undefined,
        title: undefined,
        content: undefined,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.data).toEqual(null);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual(
      'body.title is Title is required,body.email is Email is required,body.content is Content is required,body.author is Author is required'
    );
  });

  it('POST /posts - fail not valid email', async () => {
    const response = await server
      .post('/posts')
      .type('json')
      .send({
        author: 'abc',
        email: 'abc',
        title: 'abc',
        content: 'abc',
      })
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.data).toEqual(null);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('body.email is Invalid email');
  });

  it('POST /posts - success', async () => {
    const newFakePost = {
      author: faker.person.fullName(),
      title: faker.word.words(3),
      content: faker.word.words(10),
      email: faker.internet.email(),
    };

    const response = await server
      .post('/posts')
      .type('json')
      .send(
        newFakePost
      )
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.CREATED);
    expect(result.data!.identifiers).toBeDefined()
    expect(result.message).toEqual('Post saved');
  });
});

describe('Retreive a specific Post', () => {
  let server!: TestAgent;
  const fakePost = {
    id: 10,
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    server = request(app)
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

  it('GET /posts/abscd - fail', async () => {
    const response = await server.get('/posts/abcd');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a numeric value,params.id is id must be a positive number');
  });

  it('GET /posts/-10 - fail', async () => {
    const response = await server.get('/posts/-10');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a positive number');
  });

  it('GET /posts/10 - success', async () => {
    const response = await server.get('/posts/10');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    const post = result.data ?? { author: '', title: '', content: '', email: '' }
    expect(post.author).toEqual(fakePost.author);
    expect(post.title).toEqual(fakePost.title);
    expect(post.content).toEqual(fakePost.content);
    expect(post.email).toEqual(fakePost.email);
    expect(result.status).toEqual('success');
  });
});

describe('Retrieve All Post', () => {
  let server!: TestAgent;
  const fakePost = {
    id: 10,
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    server = request(app)
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

  it('GET /posts - success', async () => {
    const response = await server.get('/posts');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    const [post] = result.data
    expect(post.author).toEqual(fakePost.author);
    expect(post.title).toEqual(fakePost.title);
    expect(post.content).toEqual(fakePost.content);
    expect(post.email).toEqual(fakePost.email);
    expect(result.status).toEqual('success');
  });

});

describe('Delete a Post', () => {
  let server!: TestAgent;
  const fakePost = {
    id: 10,
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    server = request(app)
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

  it('DELETE /posts/abscd - fail', async () => {
    const response = await server.delete('/posts/abcd');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a numeric value,params.id is id must be a positive number');
  });

  it('DELETE /posts/-10 - fail', async () => {
    const response = await server.delete('/posts/-10');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a positive number');
  });

  it('DELETE /posts/1 - success', async () => {
    const response = await server.delete('/posts/1');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.data).toEqual({ id: 1 });
    expect(result.status).toEqual('success');
  });

});

describe('Update a Post', () => {
  let server!: TestAgent;
  const fakePost = {
    id: 10,
    author: faker.person.fullName(),
    title: faker.word.words(3),
    content: faker.word.words(10),
    email: faker.internet.email(),
  };

  beforeAll(async () => {
    server = request(app)
    await TestHelper.instance.setupTestDB();
  });

  afterAll(() => {
    TestHelper.instance.teardownTestDB();
  });

  beforeEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    await postRepository.insert({ ...fakePost });
  });

  afterEach(async () => {
    const postRepository = TestHelper.instance.getRepo('Post');
    const allPosts = await postRepository.find();
    const allPostsIds = allPosts.map((p) => p.id);
    await postRepository.delete({
      id: In(allPostsIds),
    });
  });

  it('PATCH /posts/-1 - fail invalid id and body', async () => {
    const response = await server
      .patch('/posts/-q')
      .type('json')
      .send({
        author: '',
        email: '',
      })
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.data).toEqual(null);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('params.id is id must be a numeric value,params.id is id must be a positive number,body.title is Title is required,body.content is Content is required');
  });

  it('PATCH /posts/1 - fail empty string', async () => {
    const response = await server
      .patch('/posts/1')
      .type('json')
      .send({
        title: '',
        content: '',
      })
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.data).toEqual(null);
    expect(result.status).toEqual('failed');
    expect(result.message).toEqual('body.title is Name cannot be empty,body.content is Content cannot be empty');
  });


  it('PATCH /posts/10 -  success', async () => {
    const newTitle = faker.word.words(3);
    const newContent = faker.word.words(10);
    const response = await server
      .patch('/posts/10')
      .type('json')
      .send({
        title: newTitle,
        content: newContent,
      })
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.data?.affected).toEqual(1);
    expect(result.status).toEqual('success');
    expect(result.message).toEqual('Post updated');
  });

  it('PATCH /posts/1 -  post dont exist', async () => {
    const newTitle = faker.word.words(3);
    const newContent = faker.word.words(10);
    const response = await server
      .patch('/posts/1')
      .type('json')
      .send({
        title: newTitle,
        content: newContent,
      })
      .set('Accept', 'application/json');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.data?.affected).toEqual(0);
    expect(result.status).toEqual('success');
    expect(result.message).toEqual('Post updated');
  });

});