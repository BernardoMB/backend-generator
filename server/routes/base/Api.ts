import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import * as applicationInsights from 'applicationinsights';
import { join } from 'path';

import { ErrorHandler } from '../middlewares/handlers/ErrorHandler';
import { loggerFactory } from './../../config/winston'; 

// TODO: Generate code here
import { CatRoutes } from '../CatRoutes';

const DOC_PATH = join(__dirname, '../../../documentation');

export class Api {
  //Global route handling for when matching the desired address
  public static initialize(app: express.Application) {
    //Alter headers for security
    app.use(helmet());
    //Parse json requests
    app.use(bodyParser.json());
    //Documentation routes
    app.use(express.static(DOC_PATH));
    //Ligger
    app.use(morgan('correlationId=:req[correlationId] remote-addr=:remote-addr url=:url method=:method', { immediate: true, stream: { write: message => loggerFactory().info(message)}}));
    app.use(morgan('correlationId=:req[correlationId] remote-addr=:remote-addr url=:url method=:method status=:status responseTime=:response-time[digits]', { stream: { write: message => loggerFactory().info(message)}}));
    app.get('/docs', (req, res) => res.sendFile(`${DOC_PATH}/index.html`));
    //Log incomming requests
    //if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
    //Validator middleware   
    if(process.env.NODE_ENV === 'staging') {
      applicationInsights.setup().setAutoDependencyCorrelation(false).start();
    }
    app.use(expressValidator());
    //Application routes
		app.use('/api/cat', new CatRoutes().routes());
		//Middleware to handle all error messages
    app.use(ErrorHandler);
  }
}
