import chalk from 'chalk';
import {
  Model,
  Interface,
  Class,
  Controller,
  Business,
  Repository
} from './interfaces';
import {
  writeModelInterface,
  writeModelClass,
  writeModelController,
  writeModelBusiness,
  writeModelRepository,
  writeControllerFiles,
  writeBusinessFiles,
  writeRepositoryFiles
} from './writers';

// TODO: generate server.ts, middelwares.ts, api.ts, db files, schemas, data access files and the following files
// Route files are also very important
// Config folder in server root
// Generate Schemas and new stuff.
/**
 * import { ErrorHandler } from '../middlewares/handlers/ErrorHandler';
import { ProductRoutes } from '../ProductRoutes';
import { PurchaseRoutes } from '../PurchaseRoutes';
import { BalanceRoutes } from '../BalanceRoutes';
import { UserRoutes } from '../UserRoutes';
import { loggerFactory } from './../../config/winston'; 
 */
export const generateGenericServerFiles = async () => {
  let files: Array<string> = [];
  try {
    files = [
      ...(await writeControllerFiles()),
      ...(await writeBusinessFiles()),
      ...(await writeRepositoryFiles())
    ];
    return files;
  } catch (error) {
    const message = 'Error generating generic server files';
    throw new Error(chalk.redBright(message, error));
  }
};

export const generateModel = async (model: Model) => {
  let files: Array<string> = [];
  let filePath: string;
  let filePaths: Array<string>;
  if (model.interface) {
    const _interface: Interface = {
      name: model.name,
      properties: model.properties,
      externalRefs: model.externalRefs
    };
    try {
      filePath = await writeModelInterface(_interface, model.flat);
      files.push(filePath);
      console.log(chalk.magentaBright('Generated interface!'));
    } catch (error) {
      const message = 'Error generating model interface';
      throw new Error(chalk.redBright(message, error));
    }
  }
  if (model.class) {
    const _class: Class = {
      name: model.name,
      properties: model.properties,
      methods: model.methods,
      externalRefs: model.externalRefs
		};
    try {
      filePath = await writeModelClass(_class, model.flat);
      files.push(filePath);
      console.log(chalk.magentaBright('Generated model class!'));
    } catch (error) {
      const message = 'Error generating model class';
      throw new Error(chalk.redBright(message, error));
    }
  }
  if (model.controller.include) {
    const controller: Controller = {
      name: model.name,
      properties: model.controller.properties,
      methods: model.controller.methods,
      externalRefs: model.controller.externalRefs
    };
    try {
      filePath = await writeModelController(controller, model.flat);
      files.push(filePath);
      console.log(chalk.magentaBright('Generated model controller files!'));
    } catch (error) {
      const message = 'Error generating model controller files';
      throw new Error(chalk.redBright(message, error));
    }
  }
  if (model.business.include) {
    const business: Business = {
      name: model.name,
      properties: model.business.properties,
      methods: model.business.methods,
      externalRefs: model.business.externalRefs
    };
    try {
      files = [...files, ...(await writeModelBusiness(business, model.flat))];
      console.log(chalk.magentaBright('Generated model business files!'));
    } catch (error) {
			const message = 'Error generating model business files';
			throw new Error(chalk.redBright(message, error));
    }
  }
  if (model.repository.include) {
    const repository: Repository = {
      name: model.name,
      properties: model.repository.properties,
      methods: model.repository.methods,
      externalRefs: model.repository.externalRefs
		};
		try {
			filePath = await writeModelRepository(repository, model.flat);
    	files.push(filePath);
    	console.log(chalk.magentaBright('Generated model repository files!'));	
		} catch (error) {
			const message = 'Error generating model repository files files';
			throw new Error(chalk.redBright(message, error));
		}
  }
  return files;
};
