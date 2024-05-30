import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';

import { handleServiceResponse } from '../utils/http.handlers';
import { ResponseStatus, ServiceResponse } from '../utils/types';

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        errorMessages.join(','),
        null,
        StatusCodes.BAD_REQUEST
      );
      handleServiceResponse(serviceResponse, res);
    } else {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Internal Server Error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      handleServiceResponse(serviceResponse, res);
    }
  }
};
