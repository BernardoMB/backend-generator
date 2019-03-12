
import { RequestHandler } from 'express';

export interface IReadController<T> {
    read: RequestHandler,
    findById: RequestHandler
}
