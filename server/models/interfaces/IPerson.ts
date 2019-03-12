import * as mongoose from 'mongoose';

export interface IPerson extends mongoose.Document {
	name: string;
	height?: number;
	weight?: number;
	age?: number;
}
