import { BaseRepository } from './base/BaseRepository';
import { UserModel } from '../data-access/models/UserModel';
import { IUser } from '../models/interfaces/IUser';
import chalk from 'chalk';

export class UserRepository extends BaseRepository<IUser> {

  constructor() {
    super(UserModel);
  }

  public async createUser(user: IUser): Promise<{ user: IUser, token: string }> {
    const createdUser: IUser = <IUser>await this._model.create(user);
    const token: string = <string>await createdUser.generateAuthToken();
    return { user: createdUser, token };
  }

  public async login(credentials: { email: string, password: string }): Promise<{ user: IUser, token: string }> {
    const user: IUser = await (<any>this._model).findByCredentials(credentials.email, credentials.password);
    const token: string = <string>await user.generateAuthToken();
    return { user, token };
  }

  public async logout(user: IUser, token: string): Promise<void> {
    await user.removeToken(token);
  }

}
