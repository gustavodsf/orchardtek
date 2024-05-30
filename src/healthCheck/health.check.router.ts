import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleServiceResponse } from '@/common/utils/http.handlers';
import { ResponseStatus, ServiceResponse } from '@/common/utils/types';

export const healthCheckRouter: Router = (() => {
  const router = express.Router();

  router.get('/', (_req: Request, res: Response) => {
    const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Up and running', null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
