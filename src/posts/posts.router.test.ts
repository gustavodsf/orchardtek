import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@/common/utils/types';
import { app } from '@/server';

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
});
