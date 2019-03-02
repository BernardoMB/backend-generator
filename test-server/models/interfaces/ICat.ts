import { IPerson } from './IPerson';
import * as mongoose from 'mongoose';

export interface ICat extends mongoose.Document {
	name: string;
	height?: number;
	weight?: number;
	age?: number;
	owners?: Array<IPerson>;
}
