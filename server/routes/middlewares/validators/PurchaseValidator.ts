import { checkSchema, param } from 'express-validator/check';

export const newPurchaseFieldsValidator = checkSchema({
  productId: {
    in: ['body'],
    exists: {
      errorMessage: 'Product productId field must be present'
    },
    isString: {
      errorMessage: 'Product productId field must be a valid non whitespace string'
    },
    trim: true
  },
  user: {
    in: ['body'],
    exists: {
      errorMessage: 'User id must be present'
    },
    isMongoId: {
      errorMessage: 'User id must be a valid mongoId'
    }
  },
  destination: {
    in: ['body'],
    errorMessage: 'Must be a valid string identifier',
    isString: true,
    trim: true
  },
  amount: {
    in: ['body'],
    errorMessage: 'Amount must be a valid positive number',
    isCurrency: {
      options: {
        allow_negatives: false
      }
    },
    toFloat: true
  },
  comment: {
    in: ['body'],
    errorMessage: 'Comment must be a valid string',
    optional: true,
    isString: true,
    trim: true
  }
});

export const externalIdValidator = param(
  'externalId',
  'Specified param extenralId is invalid, must be a 12 digit number as a string'
)
  .isString()
  .isLength({ min: 12, max: 12 });
