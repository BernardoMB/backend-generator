import { RequestHandler } from 'express';

export interface IWriteController<T> {
    create: RequestHandler,
    update: RequestHandler,
    delete: RequestHandler
}