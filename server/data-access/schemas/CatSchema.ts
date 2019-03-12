import { Schema } from 'mongoose';

export const catSchema = new Schema ({
  name: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  age: { type: Number, required: true },
  owners: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  someProperty: { key1: { type: Schema.Types.ObjectId, ref: 'Person', required: false }, key2: { type: Number, required: false }, key3: { type: [{ type: Schema.Types.ObjectId, ref: 'Dog', required: false }], required: false } },
});