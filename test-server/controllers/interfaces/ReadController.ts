
import { RequestHandler } from 'express';

export interface IReadController {
    retrieve: RequestHandler;
    findById: RequestHandler;
}
