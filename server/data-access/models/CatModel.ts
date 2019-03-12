
import { Model, model } from 'mongoose';
import { catSchema } from '../schemas/CatSchema';
import { ICat } from '../../models/interfaces/ICat';

export const CatModel: Model<ICat> = model<ICat>('Cat', catSchema);
