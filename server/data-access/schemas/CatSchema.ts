import { Model, model, Schema } from 'mongoose';
import { ICat } from '../../models/interfaces/ICat';

const schema: Schema = new Schema({
  name: { type: String }
});

export const catSchema: Model<ICat> = model<ICat>('Cat', schema);
