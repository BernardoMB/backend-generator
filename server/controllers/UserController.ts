import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/BaseController';
import { UserBusiness } from '../businesses/UserBusiness';
import { IUser } from '../models/interfaces/IUser';
import { handleError } from './helps/handle-error';
import chalk from 'chalk';

export class UserController extends BaseController<IUser> {

  constructor() {
    super(new UserBusiness());
  }

  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUser = <IUser>request.body;
      const result: { user: IUser, token: string } = await this._business.createUser(user);
      response.status(201).header('x-auth', result.token).json({ item: result.user });
    } catch (error) {
      handleError(error, 'Error creating user', next);
      response.status(500).json({ message: error });
    }
  }

  public async me(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.status(200).json(request['user']);
    } catch (error) {
      handleError(error, 'Error getting user data', next);
      response.status(500).json({ message: error });
    }
  }

  public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: { email: string, passwrod: string } = request.body;
      const result: { user: IUser, token: string } = await this._business.login(credentials);
      response.status(200).header('x-auth', result.token).json({ item: result.user });
    } catch (error) {
      handleError(error, 'Error loging in', next);
      response.status(500).json({ message: error });
    }
  }

  public async logout(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const user: string = request['user'];
      const token: string = request['token'];
      await this._business.logout(user, token);
      response.status(200);
    } catch (error) {
      handleError(error, 'Error deleting user', next);
      response.status(500).json({ message: error });
    }
  }

}
