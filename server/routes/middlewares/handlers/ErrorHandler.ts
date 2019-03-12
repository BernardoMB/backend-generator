  
  import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
  import { loggerFactory } from '../../../config/winston';
  
export const ErrorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const logger = loggerFactory();
  const message = `(${req.method}) ${req.originalUrl} | ${error.message}`;
  logger.error(`correlationId=${req.header("correlationId")} remote-addr=${req.ip} url=${req.originalUrl} method=${req.method} status=${error.status || 500} error="${error.message}"`);
  if (!!error.errors) console.table(error.errors);
  res.status(error.code).json({
    ...error,
    message
  });
};
