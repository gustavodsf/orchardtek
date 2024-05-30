import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@/common/utils/types';
import { app } from '@/server';

describe('Health Check API endpoint', () => {
  it('GET / - success', async () => {
    const response = await request(app).get('/health-check');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.status).toEqual('success');
    expect(result.responseObject).toBeNull();
    expect(result.message).toEqual('Up and running');
  });
});
