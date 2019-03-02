import { checkSchema } from 'express-validator/check';

export const userFieldsValidator = checkSchema({
  username: {
    in: ['body'],
    exists: {
      errorMessage: 'username field must be present'
    },
    isString: {
      errorMessage: 'username field must be a valid non whitespace string'
    },
    trim: true
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'password field must be present'
    },
    isString: {
      errorMessage: 'password field must be a valid non whitespace string'
    },
    trim: true
  }
});