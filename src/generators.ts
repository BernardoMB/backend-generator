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
  writeRepositoryFiles,
  writeModelSchema,
  writeMongooseModel,
  writeLoggerFactory,
  writeMainFiles,
  writeMiddleWares,
  writeDataAccessFiles,
  writeModelRoutes,
  writeApiFile,
  writeUserFiles
} from './writers';

/**
 * This funciton generates all the files that are entity independent.
 */
export const generateGenericServerFiles = async (features: any): Promise<Array<string>> => {
  let files: Array<string> = [];
  try {
    files = [
      ...(await writeMainFiles()), // server, main
      ...(await writeMiddleWares()), // everything inside the middlewares directory
      ...(await writeControllerFiles()),
      ...(await writeBusinessFiles()),
      ...(await writeRepositoryFiles()),
      ...(await writeDataAccessFiles()), // config file for database
      ...(await writeLoggerFactory()) // winston configuration file. LoggerFactory class.
    ];
    if (features.users) {
      files = [
        ...files,
        ...(await writeUserFiles())
      ]
    }
    return files;
  } catch (error) {
    const message = 'Error generating generic server files';
    throw new Error(chalk.redBright(message, error));
  }
};

/**
 * This function generates all the files to incorporate 
 * an entity to the API.
 * @param model 
 */
export const generateModel = async (model: Model): Promise<Array<string>> => {
  let files: Array<string> = [];
  let filePath: string;
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
			const message = 'Error generating model repository files';
			throw new Error(chalk.redBright(message, error));
		}
		try {
			filePath = await writeModelSchema(model, model.flat);
    	files.push(filePath);
    	console.log(chalk.magentaBright('Generated model schema files!'));	
		} catch (error) {
			const message = 'Error generating model schema files';
			throw new Error(chalk.redBright(message, error));
		}
		try {
			filePath = await writeMongooseModel(repository, model.flat);
    	files.push(filePath);
    	console.log(chalk.magentaBright('Generated Mongoose model files!'));	
		} catch (error) {
			const message = 'Error generating Mongoose model files';
			throw new Error(chalk.redBright(message, error));
    }
  }
  try {
    filePath = await writeModelRoutes(model);
    files.push(filePath);
    console.log(chalk.magentaBright('Generated model routes file!'));	
  } catch (error) {
    const message = 'Error generating model routes files';
    throw new Error(chalk.redBright(message, error));
  }
  return files;
};

/**
 * This function creates the Api file where all routes are declared.
 * @param names 
 */
export const generateApiFile = async (names: Array<string>): Promise<string> => {
  try {
    const filePath = await writeApiFile(names);
    console.log(chalk.magentaBright('Generated API file!'));	
    return filePath;
  } catch (error) {
    const message = 'Error generating API file';
    throw new Error(chalk.redBright(message, error));
  }
}
