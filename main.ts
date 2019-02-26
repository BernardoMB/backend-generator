import * as fs from 'fs';
import { Model } from './interfaces';

const data: string = fs.readFileSync('models.json').toString();

const models: Array<Model> = JSON.parse(data);


