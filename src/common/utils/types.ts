import { z } from 'zod';

export enum ResponseStatus {
  Success = 'success',
  Failed = 'failed',
}

export class ServiceResponse<T = null> {
  status: string;
  message: string;
  responseObject: T;
  statusCode: number;

  constructor(status: ResponseStatus, message: string, responseObject: T, statusCode: number) {
    this.status = status.toString();
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.nativeEnum(ResponseStatus),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
