
import { Model, model } from 'mongoose';
import { personSchema } from '../schemas/PersonSchema';
import { IPerson } from '../../models/interfaces/IPerson';

export const PersonModel: Model<IPerson> = model<IPerson>('Person', personSchema);
