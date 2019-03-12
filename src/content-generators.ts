import {
  Interface,
  Property,
  Class,
  Method,
  Argument,
  Controller,
  ClassProperty,
  Business,
  Repository,
  Model
} from './interfaces';
import { toCamelCase, capitalize } from './utils';

export const generateMainContent = async (): Promise<string> => {
  return `
  import * as express from 'express';
  import { Db } from './data-access/config';
  import { Api } from './routes/base/Api';
  import chalk from 'chalk';
  
  require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'development'
  });
  
  export const app = express();
  
  function listen(): Promise<express.Express> {
    // Initialize all API routes.
    Api.initialize(app);
    // Get environment variables.
    const port = process.env.PORT;
    return new Promise((resolve, reject) => {
      app.listen(port, err => {
        if (err) {
          reject(err);
        }
        console.log(\`Server running on port \${chalk.magentaBright(\`\${port}\`)}\`);
        resolve(app);
      });
    });
  }
  
  /**
   * Function to initialize application.
   *
   * @export
   * @returns
   */
  export async function init() {
    // Create database connection object.
    const db = new Db();
    // Connect to the mongodb database.
    const dbConnection = await db.connect();
    // Wait for the server to start listening
    const app = await listen();
    return [dbConnection, app];
  }
`;
}

export const generateServerContent = async (): Promise<string> => {
  return `
import { init } from './main';
(async function main() {
  await init();
})();
`;
}

export const generateAdminAuthenticatorContent = async (): Promise<string> => {
  return `
import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { UserRepository } from '../../../repository/UserRepository';

export async function AuthenticateAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userRepository = new UserRepository();
    let token = req.header('Authorization');
    const decoded = verify(token, process.env.JWT_HASH);
    const user = await userRepository.findOne({ _id: decoded.id, token });
    if (!user) {
      return next({
        message: \`Invalid request: User is not authenticated\`,
        code: 401
      });
    }
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next({
        message: \`Authentication failed: the token has expired, try logging in again.\`,
        code: 401
      });
    }
    return next({
      message: \`Authentication failed: \${err.message}\`,
      code: 401
    });
  }
}

export function AuthenticateSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  if (token === process.env.ADMIN_MIDDLEWARE_KEY) {
    return next();
  }
  return res.status(401).send('https://www.youtube.com/watch?v=3xYXUeSmb-Y');
}  
  `;
}

export const generateErrorHandlerContent = async (): Promise<string> => {
  return `  
  import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
  import { loggerFactory } from '../../../config/winston';
  
export const ErrorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const logger = loggerFactory();
  const message = \`(\${req.method}) \${req.originalUrl} | \${error.message}\`;
  logger.error(\`correlationId=\${req.header(\"correlationId\")} remote-addr=\${req.ip} url=\${req.originalUrl} method=\${req.method} status=\${error.status || 500} error=\"\${error.message}\"\`);
  if (!!error.errors) console.table(error.errors);
  res.status(error.code).json({
    ...error,
    message
  });
};
`;
}

export const generateHeaderValidatorContent = async (): Promise<string> => {
  return `
import { header } from 'express-validator/check';

export const AuthenticationHeaderValidator = header('Authorization', '[Authorization] header is not present or invalid')
  .exists()
  .matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
`;
}

export const generateIdValidatorContent = async (): Promise<string> => {
  return `
import { param } from 'express-validator/check';

export const ObjectIdValidator = param('id', 'Specified param Id is invalid, must be an ObjectId')
  .exists()
  .isMongoId();

export const IntIdValidator = param('id', 'Specified Id is invalid, must be an integer')
  .isEmpty()
  .isInt();
  `;
}

export const generateRequestValidatorContent = async (): Promise<string> => {
  return `
import { validationResult, ValidationChain } from 'express-validator/check';
import { RequestHandler } from 'express';

export default class RequestValidator {
  public static validateWith(arr: ValidationChain[]): RequestHandler[] {
    return [...arr, validateRequest];
  }
}

export function validateRequest(req, res, next): void {
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req)
      .array({ onlyFirstError: true })
      .map(
        (err: any) =>
          \`\${err.location}[\${err.param}] = \${err.value} | \${err.msg}\`
      );
    next({
      message: \`Invalid request: \${errors.length} error\${
        errors.length > 1 ? 's' : ''
        } occured\`,
      errors,
      code: 422
    });
  } else {
    next();
  }
}
  `;
}

export const generateUserValidatorContent = async (): Promise<string> => {
  return `
import { checkSchema } from 'express-validator/check';

export const userFieldsValidator = checkSchema({
  username: {
    in: ['body'],
    exists: {
      errorMessage: 'username field must be present'
    },
    isString: {
      errorMessage: 'username field must be a valid non whitespace string'
    },
    trim: true
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'password field must be present'
    },
    isString: {
      errorMessage: 'password field must be a valid non whitespace string'
    },
    trim: true
  }
});
  `;
}

export const generateInterfaceContent = async (_interface: Interface): Promise<string> => {
  let content: string = `import * as mongoose from 'mongoose';\n`;
  if (_interface.externalRefs.length > 0) {
    for (let externalRef of _interface.externalRefs) {
      content += `import { I${externalRef} } from './I${externalRef}';\n`;
    }
  }
  content += `\nexport interface I${_interface.name} extends mongoose.Document {\n`;
  _interface.properties.forEach((property: Property) => {
    content += `\t${property.name}${property.required ? '' : '?'}: ${
      property.type
      };\n`;
  });
  content += '}\n';
  return content;
};

export const generateClassContent = async (_class: Class): Promise<string> => {
  let content: string = '';
  const name = _class.name;
  const camelCaseName = toCamelCase(name);
  if (_class.externalRefs.length > 0) {
    for (let extRef of _class.externalRefs) {
      content += `import { I${extRef} } from './interfaces/I${extRef}';\n`;
    }
    content += '\n';
  }
  content += `import { I${name} } from './interfaces/I${name}';\n\n`;
  content += `export class ${name} extends Document {\n\n\tprivate _${camelCaseName}: I${name};\n\n`;
  content += `\tconstructor(${camelCaseName}: I${name}) {\n\t\tsuper();\n\t\tthis._${camelCaseName} = ${camelCaseName};\n\t}\n\n`;
  _class.properties.forEach((property: Property) => {
    content += `\tget ${property.name}(): ${
      property.type
      } {\n\t\treturn this._${camelCaseName}.${property.name};\n\t}\n\n`;
  });
  _class.methods.forEach((method: Method) => {
    content += `
    ${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
        }`;
    });
    content += `): ${method.type} {
        throw new Error('${method.name} not implemented in class ${name}Controller');
        return null;
    }
    `;
  });
  content += `
}`;
  return content;
};

export const generateHandleErrorContent = async (): Promise<string> => {
  return `
import { NextFunction } from 'express';

export function handleError(error: any, message: string, next: NextFunction) {
  next({
    message: \`\${message}: \${error.message}\`,
    code: !!error.code ? error.code : 500
  });
}
  `;
}

export const generateBaseControllerContent = async (): Promise<string> => {
  return `
import { Request, Response, NextFunction } from 'express';
import { handleError } from './../helps/handle-error';
import { IReadController } from '../interfaces/ReadController';
import { IWriteController } from '../interfaces/WriteController';

export class BaseController<T> implements IReadController<T>, IWriteController<T> {
  
  public _business;
  
  constructor(business) {
    this._business = business;
  }

  public async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const item: T = <T>request.body;
      const createdItem: T = await this._business.create(item);
      response.status(201).json({ item: createdItem });
    } catch (error) {
      handleError(error, 'Error creating item', next);
    }
  }
  
  public async read(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const items: Array<T> = await this._business.read();
      response.status(200).json({ items });
    } catch (error) {
      handleError(error, 'Error retrieving cats', next);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const newItem: T = <T>request.body;
      const {
        params: { id }
      } = request;
      const updatedItem: T = await this._business.update(id, newItem);
      response.status(202).json({ item: updatedItem });
    } catch (error) {
      handleError(error, ' Error updating cat', next);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      await this._business.delete(id);
      response.status(200).json({ id });
    } catch (error) {
      handleError(error, ' Error deleting cat', next);
    }
  }

  public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {
        params: { id }
      } = request;
      const item: T = await this._business.findById(id);
      response.status(200).json({ item });
    } catch (error) {
      handleError(error, 'Error finding cat', next);
    }
  }

}
  `;
}

export const generateIReadControllerContent = async (): Promise<string> => {
  return `
import { RequestHandler } from 'express';

export interface IReadController<T> {
    read: RequestHandler,
    findById: RequestHandler
}
`;
}

export const generateIWriteControllerContent = async (): Promise<string> => {
  return `
import { RequestHandler } from 'express';

export interface IWriteController<T> {
    create: RequestHandler,
    update: RequestHandler,
    delete: RequestHandler
}
`;
}

export const generateControllerContent = async (controller: Controller): Promise<string> => {
  const name: string = controller.name;
  let content: string = `
import { BaseController } from './base/BaseController';
import { ${name}Business } from '../businesses/${name}Business';
import { I${name} } from '../models/interfaces/I${name}';\n`;
  controller.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Controller extends BaseController<I${name}> {
  `;
  controller.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(new ${name}Business());
  }
  `;
  controller.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
      } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateBaseBusinessContent = async (): Promise<string> => {
  return `
import { IReadBusiness } from "../interfaces/ReadBusiness";
import { IWriteBusiness } from "../interfaces/WriteBusiness";

export class BaseBusiness<T> implements IReadBusiness<T>, IWriteBusiness<T> {
  
  public _repository;
  
  constructor(repository) {
    this._repository = repository;
  }
  
  async create(item: T): Promise<T> {
    const createdItem: T = await this._repository.create(item);
    return createdItem;
  }
  
  async read(): Promise<Array<T>> {
    const items: Array<T> = await this._repository.read();
    return items;
  }
  
  async update(_id: string, item: T): Promise<T> {
    const itemToBeUpdated: T = await this._repository.findById(_id);
    this.throwIfNotExists(itemToBeUpdated);
    const updatedItem: T = await this._repository.update((<any>itemToBeUpdated)._id, item);
    return updatedItem;
  }

  async delete(_id: string): Promise<boolean> {
    this.throwIfNotExists(await this._repository.delete(_id));
    return true;
  }
  
  async findById(_id: string): Promise<T> {
    const item: T = await this._repository.findById(_id);
    this.throwIfNotExists(item);
    return item;
  }
  
  public throwIfNotExists(item: T) {
    if (!item) {
      throw { message: 'Item not found', code: 404 };
    }
  }
  
}
`;
}

export const generateIReadBusinessContent = async (): Promise<string> => {
  return `
export interface IReadBusiness<T> {
  create(item: T): Promise<T>,
  update(_id: string, item: T): Promise<T>,
  delete(_id: string): Promise<boolean>
}
`;
}

export const generateIWriteBusinessContent = async (): Promise<string> => {
  return `
export interface IWriteBusiness<T> {
  read(): Promise<Array<T>>,
  findById(_id: string): Promise<T>
}
`;
}

export const generateBusinessContent = async (business: Business): Promise<string> => {
  const name: string = business.name;
  let content: string = `
import { ${name}Repository } from '../repositories/${name}Repository';
import { I${name} } from '../models/interfaces/I${name}';
import { BaseBusiness } from './base/BaseBusiness';\n`;
  business.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
export class ${name}Business extends BaseBusiness<I${name}> {
  `;
  business.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(new ${name}Repository());
  }\n
  `;
  business.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
      } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateBaseRepositoryContent = async (): Promise<string> => {
  return `
import { Document, Model } from 'mongoose';
import { IReadRepository } from '../interfaces/ReadRepository';
import { IWriteRepository } from '../interfaces/WriteRepository';

export class BaseRepository<T extends Document> implements IReadRepository<T>, IWriteRepository<T> {

  public _model: Model<Document>;

  constructor(schemaModel: Model<Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return <T>await this._model.create(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return <T[]>await this._model.insertMany(items);
  }

  async read(): Promise<T[]> {
    return <T[]>await this._model.find({}).exec();
  }

  async retrieveBy(conditions: any, projection?: any | null, options?: any | null): Promise<T[]> {
    return <T[]>await this._model.find(conditions, projection, options).exec();
  }

  async update(_id: string, item: T): Promise<T> {
    return <T>await this._model.findByIdAndUpdate(_id, item, { new: true }).exec();
  }

  async updateMany(conditions: any, item: T, options?: any | null): Promise<T[]> {
    return <T[]>await this._model.updateMany(conditions, item, options).exec();
  }

  async delete(_id: string): Promise<T> {
    return <T>await this._model.findByIdAndDelete(_id).exec();
  }

  async deleteMany(condition: any): Promise<any> {
    return await this._model.deleteMany(condition).exec();
  }

  async findById(_id: string): Promise<T> {
    return <T>await this._model.findById(_id).exec();
  }

  async find(conditions: any, projections?: string, options?: any): Promise<T[]> {
    if (!!projections && !options) {
      return <T[]>await this._model.find(conditions, projections).exec();
    }
    if (!!projections && !!options) {
      return <T[]>await this._model.find(conditions, projections, options).exec();
    }
    return <T[]>await this._model.find(conditions).exec();
  }

  async findOne(conditions: any, projections?: string, options?: any): Promise<T> {
    if (!!projections && !options) {
      return <T>await this._model.findOne(conditions, projections).exec();
    }
    if (!!projections && !!options) {
      return <T>await this._model.findOne(conditions, projections, options).exec();
    }
    return <T>await this._model.findOne(conditions).exec();
  }

  async drop() {
    return this._model.deleteMany({}).exec();
  }

}  
`;
}

export const generateIReadRepositoryContent = async (): Promise<string> => {
  return `
export interface IReadRepository<T> {
  read(): Promise<T[]>,
  retrieveBy(conditions: any, projection?: any | null, options?: any | null): Promise<T[]>,
  findById(_id: string): Promise<T>,
  find(conditions: any, projections?: string, options?: any): Promise<T[]>,
  findOne(conditions: any, projections?: string, options?: any): Promise<T>
}
`;
}

export const generateIWriteRepositoryContent = async (): Promise<string> => {
  return `
export interface IWriteRepository<T> {
  create(item: T): Promise<T>,
  createMany(items: T[]): Promise<T[]>,
  update(_id: string, item: T): Promise<T>,
  updateMany(conditions: any, item: T, options?: any | null): Promise<T[]>,
  delete(_id: string): Promise<T>,
  deleteMany(condition: any): Promise<any>,
  drop(): Promise<any>
}
`;
}

export const generateRepositoryContent = async (repository: Repository): Promise<string> => {
  const name: string = repository.name;
  let content: string = `
import { BaseRepository } from './base/BaseRepository';
import { ${name}Model } from '../data-access/models/${name}Model';
import { I${name} } from '../models/interfaces/I${name}';`;
  repository.externalRefs.forEach((externalRef: string) => {
    content += `import { I${externalRef} } from './../models/interfaces/I${externalRef}';
    `;
  });
  content += `
\nexport class ${name}Repository extends BaseRepository<I${name}> {
  `;
  repository.properties.forEach((property: ClassProperty) => {
    content += `
  ${property.accesor} ${property.name}: ${property.type};
    `;
  });
  content += `
  constructor() {
    super(${name}Model);
  }
  `;
  repository.methods.forEach((method: Method) => {
    content += `${method.accesor} ${method.name}(`;
    method.arguments.forEach((argument: Argument, index: number) => {
      content += `${index == 0 ? '' : ' '}${argument.name}: ${argument.type}${
        index === method.arguments.length - 1 ? '' : ','
        }`;
    });
    content += `): ${method.type} {
    throw new Error('${
      method.name
      } not implemented in class ${name}Controller');
    return null;
  }
    `;
  });
  content += `
}\n`;
  return content;
};

export const generateSchemaContent = async (model: Model): Promise<string> => {
  const name: string = model.name;
  let content: string = `import { Schema } from 'mongoose';

export const ${toCamelCase(name)}Schema = new Schema ({`;
  model.properties.forEach((property: Property) => {
    content += `
  ${property.name}: ${property.schema},`;
  });
  content += `
});`;
  return content;
};

export const generateMongooseModelContent = async (repository: Repository): Promise<string> => {
  const name: string = repository.name;
  let content: string = `
import { Model, model } from 'mongoose';
import { ${toCamelCase(name)}Schema } from '../schemas/${name}Schema';
import { I${name} } from '../../models/interfaces/I${name}';

export const ${name}Model: Model<I${name}> = model<I${name}>('${name}', ${toCamelCase(name)}Schema);
`;
  return content;
}

export const generateDBConfigFile = async (): Promise<string> => {
  return `
import * as Mongoose from 'mongoose';
import chalk from 'chalk';

export class Db {
  
  constructor() {
    (<any>Mongoose).Promise = global.Promise;
  }

  /**
   * Create mongodb databse connection.
   *
   * @returns {Promise<typeof Mongoose>}
   * @memberof Db
   */
  async connect(): Promise<typeof Mongoose> {
    try {
      let connection: typeof Mongoose;
      const db = process.env.DB;
      const connectionOptions = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      if (process.env.DB_AUTH) {
        connection = await Mongoose.connect(
          db,
          // WARNING: Database authentication not implemented
          { ...connectionOptions,/* user: 'newt', pass: 'mimaamakim' */ }
        );
      } else {
        connection = await Mongoose.connect(
          db,
          { ...connectionOptions }
        );
      }
      console.log(\`Running on environment: \${chalk.magentaBright(process.env.NODE_ENV)}\`);
      console.log(\`Connected to db: \${chalk.magentaBright(db)}\`);
      return connection;
    } catch (error) {
      console.error(\`Error connecting to db: \${chalk.redBright(error)}\`);
    }
  }

  /**
   * Disconnect from the mongodb database.
   *
   * @memberof Db
   */
  async disconnect() {
    try {
      const db = process.env.DB;
      console.log(\`Disconnected from db: \${chalk.magentaBright(db)}\`);
    } catch (error) {
      console.error(\`Error disconnecting from db: \${chalk.redBright(error)}\`);
    }
  }
}  
  `;
}

export const generateModelRoutesContent = async (model: Model): Promise<string> => {
  const name = model.name;
  return `
import { Router } from 'express';
import { ${name}Controller } from '../controllers/${name}Controller';

const router: Router = Router();

export class ${name}Routes {

  public _${toCamelCase(name)}Controller: ${name}Controller;

  constructor() {
    this._${toCamelCase(name)}Controller = new ${name}Controller();	
  }

  routes(): Router {
    const controller = this._${toCamelCase(name)}Controller;
    router.post('', controller.create.bind(controller));
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    return router;
  }
}  
`;
}

export const generateLoggerFactoryContent = async (): Promise<string> => {
  return `
import * as winston from 'winston';

export function loggerFactory(): winston.Logger {
    const options = {
        file: {
            level: process.env.LOGGING_LEVEL,
            filename: process.env.LOG_FOLDER,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: true
        },
        console: {
            level: process.env.LOGGING_LEVEL,
            handleExceptions: true,
            json: false,
            colorize: true
        }
    };
    const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(i => \`timestamp=\${i.timestamp} level=\${i.level} application=\${process.env.APPLICATION_NAME} \${i.message}\`)
        ),
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
        ],
        exitOnError: false, // handled exceptions will not cause process.exit
    });
    return logger;
};
`;
}

export const generateApiContent = async (names: Array<string>, includeUserRoutes: boolean): Promise<string> => {
  let content: string = `import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import { join } from 'path';

import { ErrorHandler } from '../middlewares/handlers/ErrorHandler';
import { loggerFactory } from '../../config/winston';`;
  if (includeUserRoutes) {
    content += `
import { UserRoutes } from \'../UserRoutes\';`;
  }
  names.forEach((name: string) => {
    content += `
import { ${name}Routes } from '../${name}Routes';`;
  });
  content += `\n
const DOC_PATH = join(__dirname, \'../../../documentation\');`;
  content += `\n
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
    app.get('/docs', (request, response) => response.sendFile(\`\${DOC_PATH}/index.html\`));
    // Validator middleware   
    app.use(expressValidator());
    // Aplication routes`;
  if (includeUserRoutes) {
    content += `
    app.use(\'/api/user\', new UserRoutes().routes());
    `;
  }
  names.forEach((name: string) => {
    content += `app.use('/api/${toCamelCase(name)}', new ${name}Routes().routes());
    `;
  });
  content += `
    // Middleware to handle all error messages
    app.use(ErrorHandler);
  }
}
`;
  return content;
}

// User files

export const generateUserInterface = async (): Promise<string> => {
  return `
import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  tokens: Array<{
    access: string,
    token: string
  }>;
  toJSON(): any;
  generateAuthToken(): Promise<string>;
  removeToken(token: string): Promise<any>; 
}
`;
}

export const generateUserClass = async (): Promise<string> => {
  return `

 `;
}

export const generateUserModel = async (): Promise<string> => {
  return `
import { Model, model } from 'mongoose';
import { userSchema } from '../schemas/UserSchema';
import { IUser } from '../../models/interfaces/IUser';
  
export const UserModel: Model<IUser> = model<IUser>('User', userSchema);
`;
}

export const generateUserSchema = async (): Promise<string> => {
  return `import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

const _userSchema = new Schema ({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },  
    token: {
      type: String,
      required: true
    }
  }]
});

// Define the INSTANCE METHODS.

// Tell what mongoose should send back when the user model is converted to a json object.
_userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

_userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(), 
    access
  }, process.env.JWT_SECRET).toString();
  user.tokens.push({
    access,
    token
  });
  // Update and save the user object.
  // Return a promise: If there is no error saving, then pass the token to the next .then() call.
  return user.save().then(() => {
    return token;
  });
};

_userSchema.methods.removeToken = function (token) {
  var user = this;
  // Remember that update returns a promise if no then() callback provided.
  return user.update({
    // MongoDB operator '$pull' let us remove items from an array that match certain criterea. 
    $pull: {
      // Define what we want to pull.
      tokens: {token}
    }
  });
};

// Define the MODEL METHODS.

// Hash the password before storeing it.
// Visit the documentation to see how 'pre' operates.
_userSchema.pre('save', function (next) {
  // Get acces to the individual document.
  var user = this;
  // To do not rehash the value every time we update the doc we should use 'isModified()'.
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash((<any>user).password, salt, (error, hash) => {
        (<any>user).password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

_userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject();
    });
    // Alternatively.
    //return Promise.reject();
  }
  // Return a promise so we can add a .then() call to the findByToken() call. 
  return User.findOne({
    '_id': decoded._id,
    // alternatively.
    //_id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

_userSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

export const userSchema = _userSchema;
`;
}

export const generateUserRoutes = async (): Promise<string> => {
  return `
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router: Router = Router();

export class UserRoutes {

  public userController: UserController;

  constructor() {
    this.userController = new UserController();	
  }

  routes(): Router {
    const controller = this.userController;
    router.post('', controller.create.bind(controller));
    router.get('', controller.read.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    // Custom user routes
    router.get('/me', controller.getUser.bind(controller));
    router.post('/login', controller.login.bind(controller));
    return router;
  }
}  
`;
}

export const generateUserController = async (): Promise<string> => {
  return `import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base/BaseController';
import { UserBusiness } from '../businesses/UserBusiness';
import { IUser } from '../models/interfaces/IUser';
    
export class UserController extends BaseController<IUser> {
  
  constructor() {
    super(new UserBusiness());
  }
  
  public async getUser(request: Request, response: Response, next: NextFunction): Promise<void> {
    
  }

  public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    
  }
    
}
`;
}

export const generateUserBusiness = async (): Promise<string> => {
  return `import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/interfaces/IUser';
import { BaseBusiness } from './base/BaseBusiness';
    
export class UserBusiness extends BaseBusiness<IUser> {
  
  constructor() {
    super(new UserRepository());
  }

  public getUser(): Promise<IUser> {
    throw new Error('Function not implemented');
    return null;
  }

  public login(): Promise<IUser> {
    throw new Error('Function not implemented');
    return null;
  }
    
}
`;
}

export const generateUserRepository = async (): Promise<string> => {
  return `import { BaseRepository } from './base/BaseRepository';
import { UserModel } from '../data-access/models/UserModel';
import { IUser } from '../models/interfaces/IUser';

export class UserRepository extends BaseRepository<IUser> {
  
  constructor() {
    super(UserModel);
  }
  
}
`;
}

export const generateAthenticateMiddleware = async (): Promise<string> => {
  return `
import { UserModel } from './../../data-access/models/UserModel';

export const authenticate = (request, response, next) => {
  const token: string = request.header('x-auth');

  // findByToken returns a promise so we call .then() to
  UserModel.findByToken(token).then((user) => {
    // If there is no user whose token is the one provided, then return a rejected promise so the catch below get executed.
    if (!user) {
      return Promise.reject();
    }
    // If the user is found, then manipulate the resquest object and continue with the chain of promises.
    request.user = user;
    request.token = token;
    next();
  }).catch((e) => {
    response.status(401).send();
  });
};
`;
}