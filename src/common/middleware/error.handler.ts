import { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleServiceResponse } from '@/common/utils/http.handlers';

import { ResponseStatus, ServiceResponse } from '../utils/types';

const unexpectedRequest: RequestHandler = (_req, res) => {
  const serviceResponse = new ServiceResponse(ResponseStatus.Failed, 'Not Found', null, StatusCodes.NOT_FOUND);
  handleServiceResponse(serviceResponse, res);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
