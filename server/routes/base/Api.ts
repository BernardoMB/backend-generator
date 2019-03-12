import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import { join } from 'path';

import { ErrorHandler } from '../middlewares/handlers/ErrorHandler';
import { loggerFactory } from '../../config/winston';
import { UserRoutes } from '../UserRoutes';
import { CatRoutes } from '../CatRoutes';
import { DogRoutes } from '../DogRoutes';
import { PersonRoutes } from '../PersonRoutes';

const DOC_PATH = join(__dirname, '../../../documentation');

export class Api {
  // Global route handling when matching the desired address.
  public static initialize(app: express.Application) {
    // Use Helmet to secure the express application by setting various HTTP headers.
    app.use(helmet());
    // Parse incoming request.body object before the route handlers functions.
    app.use(bodyParser.json());
    // Documentation routes.
    app.use(express.static(DOC_PATH));
    // Logger. User morgan to log incomming and outgoing traffic. 
    let formatString = 'correlationId=:req[correlationId] remote-addr=:remote-addr url=:url method=:method';
    const morganOptions = { 
      immediate: true, 
      stream: { write: message => loggerFactory().info(message)}
    };
    app.use(morgan(formatString, morganOptions));
    formatString = 'correlationId=:req[correlationId] remote-addr=:remote-addr url=:url method=:method status=:status responseTime=:response-time[digits]';
    const morganOptions2 = { 
      stream: { write: message => loggerFactory().info(message)}
    };
    app.use(morgan(formatString, morganOptions2));
    // Handle app routes.
    app.get('/docs', (request, response) => response.sendFile(`${DOC_PATH}/index.html`));
    // Validator middleware   
    app.use(expressValidator());
    // Aplication routes
    app.use('/api/user', new UserRoutes().routes());
    app.use('/api/cat', new CatRoutes().routes());
    app.use('/api/dog', new DogRoutes().routes());
    app.use('/api/person', new PersonRoutes().routes());
    
    // Middleware to handle all error messages
    app.use(ErrorHandler);
  }
}
