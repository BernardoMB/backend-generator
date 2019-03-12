
import { Model, model } from 'mongoose';
import { dogSchema } from '../schemas/DogSchema';
import { IDog } from '../../models/interfaces/IDog';

export const DogModel: Model<IDog> = model<IDog>('Dog', dogSchema);
