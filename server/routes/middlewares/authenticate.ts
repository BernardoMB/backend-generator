
import { Request, Response, NextFunction } from 'express';
import { UserModel } from './../../data-access/models/UserModel';

export const authenticate = (request: Request, response: Response, next: NextFunction) => {
  const token: string = request.header('x-auth');
  if (token === undefined) {
    console.log('x-auth request header is undefined');
    response.status(401).send();
  }
  // findByToken returns a promise so we call .then() to
  (<any>UserModel).findByToken(token).then((user) => {
    // If there is no user whose token is the one provided, then return a rejected promise so the catch below get executed.
    if (!user) {
      return Promise.reject();
    }
    // If the user is found, then manipulate the resquest object and continue with the chain of promises.
    request['user'] = user;
    request['token'] = token;
    next();
  }).catch((e) => {
    console.log('Error finding user by token', e);
    response.status(401).send();
  });
};
