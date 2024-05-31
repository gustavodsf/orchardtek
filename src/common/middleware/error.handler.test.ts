import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@/common/utils/types';
import { app } from '@/server';

describe('Check error handler for not found endpoint', () => {
  it('GET /abc - success', async () => {
    const response = await request(app).get('/abc');
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.status).toEqual('failed');
    expect(result.data).toBeNull();
    expect(result.message).toEqual('Not Found');
  });
});
