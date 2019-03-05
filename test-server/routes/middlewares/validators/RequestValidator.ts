import { validationResult, ValidationChain } from 'express-validator/check';
import { RequestHandler } from 'express';

export default class RequestValidator {
  public static validateWith(arr: ValidationChain[]): RequestHandler[] {
    return [...arr, validateRequest];
  }
}

export function validateRequest(req, res, next): void {
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req)
      .array({ onlyFirstError: true })
      .map(
        (err: any) =>
          `${err.location}[${err.param}] = ${err.value} | ${err.msg}`
      );
    next({
      message: `Invalid request: ${errors.length} error${
        errors.length > 1 ? 's' : ''
        } occured`,
      errors,
      code: 422
    });
  } else {
    next();
  }
}
