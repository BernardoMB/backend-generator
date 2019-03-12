import * as mongoose from 'mongoose';

export interface IDog extends mongoose.Document {
	name: string;
	height?: number;
	weight?: number;
	age?: number;
}
