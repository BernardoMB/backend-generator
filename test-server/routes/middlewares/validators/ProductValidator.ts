import { checkSchema } from 'express-validator/check';

export const ProductFieldsValidator = checkSchema({
  name: {
    in: ['body'],
    exists: {
      errorMessage: 'Name field must be present'
    },
    isString: {
      errorMessage: 'Name field must be a valid non whitespace string'
    },
    trim: true
  },
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
  kind: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'Product kind must be an int 0, 1 or 2',
      options: {
        min: 0,
        max: 2
      }
    },
    toInt: true
  },
  amounts: {
    in: ['body'],
    errorMessage: 'Must be an array of {amount(number), description(string)}',
    isArray: true
  },
  'amounts.*.amount': {
    in: ['body'],
    errorMessage: 'Amount must be a valid, positive number: e.g. 25,000 or 256.78',
    isCurrency: {
      options: {
        allow_negatives: false
      }
    },
    toFloat: true
  },
  'amounts.*.description': {
    in: ['body'],
    errorMessage: 'Description must be a valid string',
    isString: true,
    trim: true
  },
  commission: {
    in: ['body'],
    optional: true,
    errorMessage: 'Commission must be a valid, positive number: e.g. 25,000 or 256.78',
    isCurrency: {
      options: {
        allow_negatives: false
      }
    },
    toFloat: true
  },
  providerId: {
    in: ['body'],
    exists: {
      errorMessage: 'A provider id must be included'
    },
    isString: {
      errorMessage: 'ProviderId field must be a valid non whitespace string'
    },
    trim: true
  },
  paymentCurrency: {
    in: ['body'],
    errorMessage: 'PaymentCurrency field must be a valid number, e.g "MXN", "USD", "CAD"',
    exists: {
      errorMessage: 'A valid currency must be specified'
    },
    isString: {
      errorMessage: 'A valid currency must be non whitespace string'
    },
    isUppercase: {
      errorMessage: 'PaymentCurrency field must be uppercase'
    },
    isLength: {
      errorMessage: 'PaymentCurrency field must only contain 3 characters',
      options: { min: 3, max: 3 }
    },
    trim: true
  },
  timeout: {
    in: ['body'],
    exists: {
      errorMessage: 'A timeout must be specified'
    },
    isInt: {
      errorMessage: 'Timeout field must be a positive integer',
      options: {
        gt: 0
      }
    },
    toInt: true
  },
  supportsReversal: {
    in: ['body'],
    errorMessage: 'SupportsReversal field must be a valid boolean',
    exists: {
      errorMessage: 'SupportsReversal field must be included'
    },
    isBoolean: true,
    toBoolean: true
  },
  supportsCheckStatus: {
    in: ['body'],
    errorMessage: 'SupportsCheckStatus field must be a valid boolean',
    exists: {
      errorMessage: 'SupportsCheckStatus field must be included'
    },
    isBoolean: true,
    toBoolean: true
  },
  observation: {
    in: ['body'],
    errorMessage: 'Oservation field must be a valid string',
    optional: true,
    isString: true,
    trim: true
  }
});

export const ProductFieldsPatchValidator = checkSchema({
  name: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Name field must be a valid non whitespace string'
    },
    trim: true
  },
  productId: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'Product productId field must be a valid non whitespace string'
    },
    trim: true
  },
  kind: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'Product kind must be an int 0, 1 or 2',
      options: {
        min: 0,
        max: 2
      }
    },
    toInt: true
  },
  amounts: {
    in: ['body'],
    optional: true,
    errorMessage: 'Must be an array of {amount(number), description(string)}',
    isArray: true
  },
  'amounts.*.amount': {
    in: ['body'],
    errorMessage: 'Amount must be a valid, positive number: e.g. 25,000 or 256.78',
    isCurrency: {
      options: {
        allow_negatives: false
      }
    },
    toFloat: true
  },
  'amounts.*.description': {
    in: ['body'],
    errorMessage: 'Description must be a valid string',
    isString: true,
    trim: true
  },
  commission: {
    in: ['body'],
    optional: true,
    errorMessage: 'Commission must be a valid, positive number: e.g. 25,000 or 256.78',
    isCurrency: {
      options: {
        allow_negatives: false
      }
    },
    toFloat: true
  },
  providerId: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'ProviderId field must be a valid non whitespace string'
    },
    trim: true
  },
  paymentCurrency: {
    in: ['body'],
    optional: true,
    errorMessage: 'PaymentCurrency field must be a valid number, e.g "MXN", "USD", "CAD"',
    isString: {
      errorMessage: 'A valid currency must be non whitespace string'
    },
    isUppercase: {
      errorMessage: 'PaymentCurrency field must be uppercase'
    },
    isLength: {
      errorMessage: 'PaymentCurrency field must only contain 3 characters',
      options: { min: 3, max: 3 }
    },
    trim: true
  },
  timeout: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'Timeout field must be a positive integer',
      options: {
        gt: 0
      }
    },
    toInt: true
  },
  supportsReversal: {
    in: ['body'],
    errorMessage: 'SupportsReversal field must be a valid boolean',
    optional: true,
    isBoolean: true,
    toBoolean: true
  },
  supportsCheckStatus: {
    in: ['body'],
    errorMessage: 'SupportsCheckStatus field must be a valid boolean',
    optional: true,
    isBoolean: true,
    toBoolean: true
  },
  observation: {
    in: ['body'],
    errorMessage: 'Oservation field must be a valid string',
    optional: true,
    isString: true,
    trim: true
  }
});
