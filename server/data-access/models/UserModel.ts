
import { Model, model } from 'mongoose';
import { userSchema } from '../schemas/UserSchema';
import { IUser } from '../../models/interfaces/IUser';
  
export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
