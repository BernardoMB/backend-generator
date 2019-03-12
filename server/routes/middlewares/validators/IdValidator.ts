
import { param } from 'express-validator/check';

export const ObjectIdValidator = param('id', 'Specified param Id is invalid, must be an ObjectId')
  .exists()
  .isMongoId();

export const IntIdValidator = param('id', 'Specified Id is invalid, must be an integer')
  .isEmpty()
  .isInt();
  