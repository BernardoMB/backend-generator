import { header } from 'express-validator/check';

export const AuthenticationHeaderValidator = header('Authorization', '[Authorization] header is not present or invalid')
  .exists()
  .matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
