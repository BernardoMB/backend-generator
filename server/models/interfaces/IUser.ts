
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  tokens: Array<{
    access: string,
    token: string
  }>;
  toJSON(): any;
  generateAuthToken(): Promise<string>;
  removeToken(token: string): Promise<any>;
}
