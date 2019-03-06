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

export const makeDirectory = async (directory: string): Promise<string> => {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    return 'Directory created!';
  } catch (error) {
    const message = 'Error creating directory';
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const writeFile = async (
  filePath: string,
  content: string
): Promise<any> => {
  try {
		fs.appendFileSync(filePath, content);
		return filePath;
  } catch (error) {
		const message = 'Error writing file';
		const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const writeMainFiles = async (): Promise<Array<string>> => {
  let filePaths: Array<string> = [];
  let fileName: string = `main.ts`;
  await makeDirectory('./server');
  let filePath = `./server/${fileName}`;
  let content: string = await generateMainContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths = [
    createdFilePath
  ];
  fileName = `server.ts`;
  filePath = `./server/${fileName}`;
  content = await generateServerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  return filePaths;
}

export const writeMiddleWares = async (): Promise<Array<string>> => {
  let filePaths: Array<string> = [];
  let fileName: string = 'AdminAuthenticator.ts';
  await makeDirectory('./server');
  await makeDirectory('./server/routes');
  await makeDirectory('./server/routes/middlewares');
  let filePath = `./server/routes/middlewares/${fileName}`;
  let content: string = await generateAdminAuthenticatorContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths = [
    createdFilePath
  ];
  fileName = 'ErrorHandler.ts'
  makeDirectory('./server/routes/middlewares/handlers');
  filePath = `./server/routes/middlewares/handlers/${fileName}`;
  content = await generateErrorHandlerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  fileName = 'HeaderValidator.ts'
  makeDirectory('./server/routes/middlewares/validators');
  filePath = `./server/routes/middlewares/validators/${fileName}`;
  content = await generateHeaderValidatorContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  fileName = 'IdValidator.ts'
  makeDirectory('./server/routes/middlewares/validators');
  filePath = `./server/routes/middlewares/validators/${fileName}`;
  content = await generateIdValidatorContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  fileName = 'RequestValidator.ts'
  makeDirectory('./server/routes/middlewares/validators');
  filePath = `./server/routes/middlewares/validators/${fileName}`;
  content = await generateRequestValidatorContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  fileName = 'UserValidator.ts'
  makeDirectory('./server/routes/middlewares/validators');
  filePath = `./server/routes/middlewares/validators/${fileName}`;
  content = await generateUserValidatorContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [
    ...filePaths,
    createdFilePath
  ];
  return filePaths;
}

export const writeModelInterface = async (
  _interface: Interface,
  flat: boolean 
): Promise<string> => {
  const fileName: string = `I${_interface.name}.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/models');
    await makeDirectory('./server/models/interfaces/');
    filePath = `./server/models/interfaces/${fileName}`;
  } else {
    filePath = fileName;
  }
  const content: string = await generateInterfaceContent(_interface);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeModelClass = async (_class: Class, flat: boolean): Promise<string> => {
  try {
    const fileName: string = `${_class.name}.ts`;
    let filePath: string;
    if (!flat) {
      await makeDirectory('./server');
      await makeDirectory('./server/models');
      filePath = `./server/models/${fileName}`;
    } else {
      filePath = fileName;
    }
    const content: string = await generateClassContent(_class);
    const createdFilePath: string = await writeFile(filePath, content);
    return createdFilePath;
  } catch (error) {
		const message = 'Error writing model class';
		const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
	}
};

export const writeControllerFiles = async (): Promise<Array<string>> => {
  await makeDirectory('./server');
  await makeDirectory('./server/controllers');
  await makeDirectory('./server/controllers/helps');
  await makeDirectory('./server/controllers/base');
  await makeDirectory('./server/controllers/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'handle-error.ts';
  let filePath: string = `./server/controllers/helps/${fileName}`;
  let content: string = await generateHandleErrorContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'BaseController.ts';
  filePath = `./server/controllers/base/${fileName}`;
  content = await generateBaseControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadController.ts';
  filePath = `./server/controllers/interfaces/${fileName}`;
  content = await generateIReadControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteController.ts';
  filePath = `./server/controllers/interfaces/${fileName}`;
  content = await generateIWriteControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelController = async (
  controller: Controller,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${controller.name}Controller.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/controllers');
    filePath = `./server/controllers/${fileName}`;
  } else {
    filePath = fileName;
  }
  const content: string = await generateControllerContent(controller);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeBusinessFiles = async (): Promise<Array<string>> => {
  await makeDirectory('./server');
  await makeDirectory('./server/businesses');
  await makeDirectory('./server/businesses/base');
  await makeDirectory('./server/businesses/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'BaseBusiness.ts';
  let filePath: string = `./server/businesses/base/${fileName}`;
  let content: string = await generateBaseBusinessContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadBusiness.ts';
  filePath = `./server/businesses/interfaces/${fileName}`;
  content = await generateIReadBusinessContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteBusiness.ts';
  filePath = `./server/businesses/interfaces/${fileName}`;
  content = await generateIWriteBusinessContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelBusiness = async (business: Business, flat: Boolean): Promise<Array<string>> => {
  const fileName: string = `${business.name}Business.ts`;
  let businessFilePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/businesses');
    businessFilePath = `./server/businesses/${fileName}`;
  } else {
    businessFilePath = `${fileName}`;
  }
  const businessContent: string = await generateBusinessContent(business);
  const createdBusinessFilePath: string = await writeFile(
    businessFilePath,
    businessContent
  );
  return [createdBusinessFilePath];
};

export const writeRepositoryFiles = async (): Promise<Array<string>> => {
  await makeDirectory('./server');
  await makeDirectory('./server/repositories');
  await makeDirectory('./server/repositories/base');
  await makeDirectory('./server/repositories/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'BaseRepository.ts';
  let filePath: string = `./server/repositories/base/${fileName}`;
  let content: string = await generateBaseRepositoryContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadRepository.ts';
  filePath = `./server/repositories/interfaces/${fileName}`;
  content = await generateIReadRepositoryContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteRepository.ts';
  filePath = `./server/repositories/interfaces/${fileName}`;
  content = await generateIWriteRepositoryContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelRepository = async (
  respository: Repository,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${respository.name}Repository.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/repositories');
    filePath = `./server/repositories/${fileName}`;
  } else {
    filePath = fileName;
  }
  const content: string = await generateRepositoryContent(respository);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeDataAccessFiles = async (): Promise<Array<string>> => {
  const fileName = 'config.ts';
  await makeDirectory('./server');
  await makeDirectory('./server/data-access');
  const filePath = `./server/data-access/${fileName}`;
  const content = await generateDBConfigFile();
  const createdFilePath = await writeFile(filePath, content);
  return [createdFilePath];
}

export const writeModelSchema = async (
  model: Model,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${model.name}Schema.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/data-access');
    await makeDirectory('./server/data-access/schemas');
    filePath = `./server/data-access/schemas/${fileName}`;
  } else {
    filePath = fileName;
  }
  const content: string = await generateSchemaContent(model);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeModelRoutes = async (model: Model): Promise<string> => {
  const fileName: string = `${model.name}Routes.ts`;
  await makeDirectory('./server');
  await makeDirectory('./server/routes');
  let filePath = `./server/routes/${fileName}`;
  const content = await generateModelRoutesContent(model);
  const createdFilePath = await writeFile(filePath, content);
  return createdFilePath;
}

export const writeLoggerFactory = async (): Promise<Array<string>> => {
  const fileName: string = 'winston.ts';
  let filePath: string;
  await makeDirectory('./server');
  await makeDirectory('./server/config');
  filePath = `./server/config/${fileName}`;
  const content: string = await generateLoggerFactoryContent();
  const createdFilePath: string = await writeFile(filePath, content);
  return [createdFilePath];
}

export const writeMongooseModel = async (
  respository: Repository,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${respository.name}Model.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/data-access');
    await makeDirectory('./server/data-access/models');
    filePath = `./server/data-access/models/${fileName}`;
  } else {
    filePath = fileName;
  }
  const content: string = await generateMongooseModelContent(respository);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeApiFile = async (names: Array<string>): Promise<string> => {
  const fileName: string = `Api.ts`;
  let filePath: string;
  await makeDirectory('./server');
  await makeDirectory('./server/routes');
  await makeDirectory('./server/routes/base');
  filePath = `./server/routes/base/${fileName}`;
  const content: string = await generateApiContent(names);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
}