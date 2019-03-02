import * as fs from 'fs';
import chalk from 'chalk';
import {
  Interface,
  Class,
  Controller,
  Business,
  Repository
} from './interfaces';
import {
  generateInterfaceContent,
  generateClassContent,
  generateControllerContent,
  generateBusinessInterfaceContent,
  generateBusinessContent,
  generateRepositoryContent,
  generateHandleErrorContent,
  generateBaseControllerContent,
  generateReadControllerContent,
  generateWriteControllerContent,
  generateBaseBusinessContent,
  generateReadBusinessContent,
  generateWriteBusinessContent,
  generateBaseRepositoryContent,
  generateReadRepositoryContent,
  generateWriteRepositoryContent
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

export const writeModelInterface = async (
  _interface: Interface,
  flat: boolean
) => {
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

export const writeModelClass = async (_class: Class, flat: boolean) => {
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

export const writeControllerFiles = async () => {
  await makeDirectory('./server');
  await makeDirectory('./server/controllers');
  await makeDirectory('./server/controllers/helps');
  await makeDirectory('./server/controllers/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'handle-error.ts';
  let filePath: string = `./server/controllers/helps/${fileName}`;
  let content: string = await generateHandleErrorContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'BaseController.ts';
  filePath = `./server/controllers/interfaces/${fileName}`;
  content = await generateBaseControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadController.ts';
  filePath = `./server/controllers/interfaces/${fileName}`;
  content = await generateReadControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteController.ts';
  filePath = `./server/controllers/interfaces/${fileName}`;
  content = await generateWriteControllerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelController = async (
  controller: Controller,
  flat: Boolean
) => {
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

export const writeBusinessFiles = async () => {
  await makeDirectory('./server');
  await makeDirectory('./server/businesses');
  await makeDirectory('./server/businesses/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'BaseBusiness.ts';
  let filePath: string = `./server/businesses/interfaces/${fileName}`;
  let content: string = await generateBaseBusinessContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadBusiness.ts';
  filePath = `./server/businesses/interfaces/${fileName}`;
  content = await generateReadBusinessContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteBusiness.ts';
  filePath = `./server/businesses/interfaces/${fileName}`;
  content = await generateWriteBusinessContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelBusiness = async (business: Business, flat: Boolean) => {
  const fileName: string = `${business.name}Business.ts`;
  let businessInterfaceFilePath: string;
  let businessFilePath: string;
  if (!flat) {
    await makeDirectory('./server');
    await makeDirectory('./server/businesses');
    await makeDirectory('./server/businesses/interfaces');
    businessInterfaceFilePath = `./server/businesses/interfaces/I${fileName}`;
    businessFilePath = `./server/businesses/${fileName}`;
  } else {
    businessInterfaceFilePath = `I${fileName}`;
    businessFilePath = `${fileName}`;
  }
  const businessInterfaceContent: string = await generateBusinessInterfaceContent(
    business
  );
  const businessContent: string = await generateBusinessContent(business);
  const createdBusinessInterfaceFilePath: string = await writeFile(
    businessInterfaceFilePath,
    businessInterfaceContent
  );
  const createdBusinessFilePath: string = await writeFile(
    businessFilePath,
    businessContent
  );
  return [createdBusinessInterfaceFilePath, createdBusinessFilePath];
};

export const writeRepositoryFiles = async () => {
  await makeDirectory('./server');
  await makeDirectory('./server/repositories');
  await makeDirectory('./server/repositories/interfaces');
  const filePaths: Array<string> = [];

  let fileName: string = 'BaseRepository.ts';
  let filePath: string = `./server/repositories/interfaces/${fileName}`;
  let content: string = await generateBaseRepositoryContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'ReadRepository.ts';
  filePath = `./server/repositories/interfaces/${fileName}`;
  content = await generateReadRepositoryContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  fileName = 'WriteRepository.ts';
  filePath = `./server/repositories/interfaces/${fileName}`;
  content = await generateWriteRepositoryContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths.push(createdFilePath);

  return filePaths;
};

export const writeModelRepository = async (
  respository: Repository,
  flat: Boolean
) => {
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
