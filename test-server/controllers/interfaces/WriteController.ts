
import { RequestHandler } from 'express';

export interface IWriteController {
    create: RequestHandler;
    update: RequestHandler;
    delete: RequestHandler;
}
