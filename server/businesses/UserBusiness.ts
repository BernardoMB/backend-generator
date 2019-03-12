import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/interfaces/IUser';
import { BaseBusiness } from './base/BaseBusiness';
import chalk from 'chalk';

export class UserBusiness extends BaseBusiness<IUser> {

  constructor() {
    super(new UserRepository());
  }

  public async createUser(user: IUser): Promise<{ user: IUser, token: string }> {
    const result = await this._repository.createUser(user);
    return result;
  }

  public async login(credentials: { email: string, password: string }): Promise<{ user: IUser, token: string }> {
    const result = await this._repository.login(credentials);
    return result;
  }

  public async logout(user: IUser, token: string): Promise<void> {
    return await this._repository.logout(user, token);
  }

  public getUser(): Promise<IUser> {
    throw new Error('Function not implemented');
    return null;
  }

}
