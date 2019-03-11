import * as fs from 'fs';
import chalk from 'chalk';
import {
  Interface,
  Class,
  Controller,
  Business,
  Repository,
  Model
} from './interfaces';
import {
  generateInterfaceContent,
  generateClassContent,
  generateControllerContent,
  generateIReadControllerContent,
  generateIWriteControllerContent,
  generateBusinessContent,
  generateIReadBusinessContent,
  generateIWriteBusinessContent,
  generateRepositoryContent,
  generateIReadRepositoryContent,
  generateIWriteRepositoryContent,
  generateHandleErrorContent,
  generateBaseControllerContent,
  generateBaseBusinessContent,
  generateBaseRepositoryContent,
  generateSchemaContent,
  generateMongooseModelContent,
  generateLoggerFactoryContent,
  generateMainContent,
  generateServerContent,
  generateAdminAuthenticatorContent,
  generateErrorHandlerContent,
  generateHeaderValidatorContent,
  generateIdValidatorContent,
  generateRequestValidatorContent,
  generateUserValidatorContent,
  generateDBConfigFile,
  generateModelRoutesContent,
  generateApiContent
} from './content-generators';
import * as path from 'path';
var mkdirp = require('mkdirp');

const projectDirectory = process.cwd();

/**
 * Creates a directory.
 * @param directory 
 */
export const makeDirectory = async (directory: string): Promise<void> => {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  } catch (error) {
    const message = 'Error creating directory';
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

/**
 * Creates a directory in the file system recursively. 
 * Parent directories will be created if they do not exist.
 * @param directory 
 */
export const makeDirectorySync = async (directory: string): Promise<boolean> => {
  try {
    const dir = path.join(projectDirectory, directory);
    // Create directory recursively.
    mkdirp.sync(dir);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Writes a fiel to the file system.
 * @param filePath The path where the file will be written to.
 * @param content The contents of the file.
 */
export const writeFile = async (filePath: string, content: string): Promise<void> => {
  try {
    fs.appendFileSync(filePath, content);
  } catch (error) {
    const message = 'Error writing file';
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

/**
 * Creates a fiele.
 * @param directory 
 * @param filName 
 * @param content
 * @returns The path of the file created. 
 */
export const createFileSync = async (directory: string, filName: string, content: string): Promise<string> => {
  try {
    await makeDirectorySync(directory);
    const filePath = path.join(directory, filName);
    await writeFile(filePath, content);
    return filePath;
  } catch (error) {
    const message = 'Error writing file';
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const writeMainFiles = async (): Promise<Array<string>> => {
  return [
    await createFileSync('server', 'main.ts', await generateMainContent()),
    await createFileSync('server', 'server.ts', await generateServerContent())
  ];
};

export const writeMiddleWares = async (): Promise<Array<string>> => {
  return [
    await createFileSync(
      'server/routes/middlewares',
      'AdminAuthenticator.ts',
      await generateAdminAuthenticatorContent()
    ),
    await createFileSync(
      'server/routes/middlewares/handlers',
      'ErrorHandler.ts',
      await generateErrorHandlerContent()
    ),
    await createFileSync(
      'server/routes/middlewares/validators',
      'HeaderValidator.ts',
      await generateHeaderValidatorContent()
    ),
    await createFileSync(
      'server/routes/middlewares/validators',
      'IdValidator.ts',
      await generateIdValidatorContent()
    ),
    await createFileSync(
      'server/routes/middlewares/validators',
      'RequestValidator.ts',
      await generateRequestValidatorContent()
    ),
    await createFileSync(
      'server/routes/middlewares/validators',
      'UserValidator.ts',
      await generateUserValidatorContent()
    )
  ];
};

export const writeModelInterface = async (_interface: Interface): Promise<string> => {
  const createdFilePath: string = await createFileSync(
    'server/models/interfaces',
    `I${_interface.name}.ts`,
    await generateInterfaceContent(_interface)
  );
  return createdFilePath;
};

export const writeModelClass = async (_class: Class): Promise<string> => {
  const createdFilePath: string = await createFileSync(
    'server/models',
    `${_class.name}.ts`,
    await generateClassContent(_class)
  );
  return createdFilePath;
};

export const writeControllerFiles = async (): Promise<Array<string>> => {
  return [
    await createFileSync(
      'server/controllers/helps',
      'handle-error.ts',
      await generateHandleErrorContent()
    ),
    await createFileSync(
      'server/controllers/base',
      'BaseController.ts',
      await generateBaseControllerContent()
    ),
    await createFileSync(
      'server/controllers/interfaces',
      'ReadController.ts',
      await generateIReadControllerContent()
    ),
    await createFileSync(
      'server/controllers/interfaces',
      'WriteController.ts',
      await generateIWriteControllerContent()
    )
  ];
};

export const writeModelController = async (controller: Controller): Promise<string> => {
  const createdFilePath: string = await createFileSync(
    'server/controllers',
    `${controller.name}Controller.ts`,
    await generateControllerContent(controller)
  );
  return createdFilePath;
};

export const writeBusinessFiles = async (): Promise<Array<string>> => {
  return [
    await createFileSync(
      'server/businesses/base',
      'BaseBusiness.ts',
      await generateBaseBusinessContent()
    ),
    await createFileSync(
      'server/businesses/interfaces',
      'ReadBusiness.ts',
      await generateIReadBusinessContent()
    ),
    await createFileSync(
      'server/businesses/interfaces',
      'WriteBusiness.ts',
      await generateIWriteBusinessContent()
    )
  ];
};

export const writeModelBusiness = async (business: Business): Promise<Array<string>> => {
  return [
    await createFileSync(
      'server/businesses',
      `${business.name}Business.ts`,
      await generateBusinessContent(business)
    )
  ];
};

export const writeRepositoryFiles = async (): Promise<Array<string>> => {
  return [
    await createFileSync(
      'server/repositories/base',
      'BaseRepository.ts',
      await generateBaseRepositoryContent()
    ),
    await createFileSync(
      'server/repositories/interfaces',
      'ReadRepository.ts',
      await generateIReadRepositoryContent()
    ),
    await createFileSync(
      'server/repositories/interfaces',
      'WriteRepository.ts',
      await generateIWriteRepositoryContent()
    )
  ];
};

export const writeModelRepository = async (respository: Repository): Promise<string> => {
  return await createFileSync('server/repositories', `${respository.name}Repository.ts`, await generateRepositoryContent(respository));
};

export const writeDataAccessFiles = async (): Promise<Array<string>> => {
  return [await createFileSync('server/data-access', 'config.ts', await generateDBConfigFile())];
};

export const writeModelSchema = async (model: Model): Promise<string> => {
  return await createFileSync('server/data-access/schemas', `${model.name}Schema.ts`, await generateSchemaContent(model));
};

export const writeModelRoutes = async (model: Model): Promise<string> => {
  return await createFileSync('server/routes', `${model.name}Routes.ts`, await generateModelRoutesContent(model));
};

export const writeLoggerFactory = async (): Promise<Array<string>> => {
  return [await createFileSync('server/config', 'winston.ts', await generateLoggerFactoryContent())];
};

export const writeMongooseModel = async (respository: Repository): Promise<string> => {
  return await createFileSync('server/data-access/models', `${respository.name}Model.ts`, await generateMongooseModelContent(respository));
};

export const writeApiFile = async (names: Array<string>): Promise<string> => {
  return await createFileSync('server/routes/base', 'Api.ts', await generateApiContent(names));
};
