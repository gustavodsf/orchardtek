import { Response } from 'express';

import { ServiceResponse } from '@/common/utils/types';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};
