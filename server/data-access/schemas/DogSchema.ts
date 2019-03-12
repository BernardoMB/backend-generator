import { Schema } from 'mongoose';

export const dogSchema = new Schema ({
  name: { type: String, required: true },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  age: { type: Number, required: false },
});