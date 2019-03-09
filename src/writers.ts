import * as fs from "fs";
import chalk from "chalk";
import {
  Interface,
  Class,
  Controller,
  Business,
  Repository,
  Model
} from "./interfaces";
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
} from "./content-generators";
import * as path from "path";
import { fileURLToPath } from "url";
var mkdirp = require("mkdirp");

const projectDirectory = process.cwd();

export const makeDirectory = async (directory: string): Promise<string> => {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    return "Directory created!";
  } catch (error) {
    const message = "Error creating directory";
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const makeDirectorySync = async (
  directory: string
): Promise<boolean> => {
  try {
    const dir = path.join(projectDirectory, directory);
    mkdirp.sync(dir);
    return true;
  } catch (error) {
    throw error;
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
    const message = "Error writing file";
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const writeFileSync = async (
  directory: string,
  filName: string,
  content: string
): Promise<string> => {
  try {
    await makeDirectorySync(directory);
    const filePath = path.join(directory, filName);
    await writeFile(filePath, content);
    return filePath;
  } catch (error) {
    const message = "Error writing file";
    const errorMessage = chalk.bgRedBright(chalk.white(message, error));
    throw new Error(errorMessage);
  }
};

export const writeMainFiles = async (): Promise<Array<string>> => {
  let filePaths: Array<string> = [];
  let fileName: string = `main.ts`;
  await makeDirectorySync("server");
  let filePath = `./server/${fileName}`;
  let content: string = await generateMainContent();
  let createdFilePath: string = await writeFile(filePath, content);
  filePaths = [createdFilePath];
  fileName = `server.ts`;
  filePath = `./server/${fileName}`;
  content = await generateServerContent();
  createdFilePath = await writeFile(filePath, content);
  filePaths = [...filePaths, createdFilePath];
  return filePaths;
};

export const writeMiddleWares = async (): Promise<Array<string>> => {
  return [
    await writeFileSync(
      "server/routes/middlewares",
      "AdminAuthenticator.ts",
      await generateAdminAuthenticatorContent()
    ),
    await writeFileSync(
      "server/routes/middlewares/handlers",
      "ErrorHandler.ts",
      await generateErrorHandlerContent()
    ),
    await writeFileSync(
      "server/routes/middlewares/validators",
      "HeaderValidator.ts",
      await generateHeaderValidatorContent()
    ),
    await writeFileSync(
      "server/routes/middlewares/validators",
      "IdValidator.ts",
      await generateIdValidatorContent()
    ),
    await writeFileSync(
      "server/routes/middlewares/validators",
      "RequestValidator.ts",
      await generateRequestValidatorContent()
    ),
    await writeFileSync(
      "server/routes/middlewares/validators",
      "UserValidator.ts",
      await generateUserValidatorContent()
    )
  ];
};

export const writeModelInterface = async (
  _interface: Interface,
  flat: boolean
): Promise<string> => {
  const createdFilePath: string = await writeFileSync(
    "server/models/interfaces",
    `I${_interface.name}.ts`,
    await generateInterfaceContent(_interface)
  );
  return createdFilePath;
};

export const writeModelClass = async (
  _class: Class,
  flat: boolean
): Promise<string> => {
  const createdFilePath: string = await writeFileSync(
    "server/models",
    `${_class.name}.ts`,
    await generateClassContent(_class)
  );
  return createdFilePath;
};

export const writeControllerFiles = async (): Promise<Array<string>> => {
  return [
    await writeFileSync(
      "server/controllers/helps",
      "handle-error.ts",
      await generateHandleErrorContent()
    ),
    await writeFileSync(
      "server/controllers/base",
      "BaseController.ts",
      await generateBaseControllerContent()
    ),
    await writeFileSync(
      "server/controllers/interfaces",
      "ReadController.ts",
      await generateIReadControllerContent()
    ),
    await writeFileSync(
      "server/controllers/interfaces",
      "WriteController.ts",
      await generateIWriteControllerContent()
    )
  ];
};

export const writeModelController = async (
  controller: Controller,
  flat: Boolean
): Promise<string> => {
  const createdFilePath: string = await writeFileSync(
    "server/controllers",
    `${controller.name}Controller.ts`,
    await generateControllerContent(controller)
  );
  return createdFilePath;
};

export const writeBusinessFiles = async (): Promise<Array<string>> => {
  return [
    await writeFileSync(
      "server/businesses/base",
      "BaseBusiness.ts",
      await generateBaseBusinessContent()
    ),
    await writeFileSync(
      "server/businesses/interfaces",
      "ReadBusiness.ts",
      await generateIReadBusinessContent()
    ),
    await writeFileSync(
      "server/businesses/interfaces",
      "WriteBusiness.ts",
      await generateIWriteBusinessContent()
    )
  ];
};

export const writeModelBusiness = async (
  business: Business,
  flat: Boolean
): Promise<Array<string>> => {
  return [
    await writeFileSync(
      "server/businesses",
      `${business.name}Business.ts`,
      await generateBusinessContent(business)
    )
  ];
};

export const writeRepositoryFiles = async (): Promise<Array<string>> => {
  return [
    await writeFileSync(
      "server/repositories/base",
      "BaseRepository.ts",
      await generateBaseRepositoryContent()
    ),
    await writeFileSync(
      "server/repositories/interfaces",
      "ReadRepository.ts",
      await generateIReadRepositoryContent()
    ),
    await writeFileSync(
      "server/repositories/interfaces",
      "WriteRepository.ts",
      await generateIWriteRepositoryContent()
    )
  ];
};

export const writeModelRepository = async (
  respository: Repository,
  flat: Boolean
): Promise<string> => {
  return await writeFileSync(
    "server/repositories",
    `${respository.name}Repository.ts`,
    await generateRepositoryContent(respository)
  );
};

export const writeDataAccessFiles = async (): Promise<Array<string>> => {
  const fileName = "config.ts";
  await makeDirectory("./server");
  await makeDirectory("./server/data-access");
  const filePath = `./server/data-access/${fileName}`;
  const content = await generateDBConfigFile();
  const createdFilePath = await writeFile(filePath, content);
  return [createdFilePath];
};

export const writeModelSchema = async (
  model: Model,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${model.name}Schema.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory("./server");
    await makeDirectory("./server/data-access");
    await makeDirectory("./server/data-access/schemas");
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
  await makeDirectory("./server");
  await makeDirectory("./server/routes");
  let filePath = `./server/routes/${fileName}`;
  const content = await generateModelRoutesContent(model);
  const createdFilePath = await writeFile(filePath, content);
  return createdFilePath;
};

export const writeLoggerFactory = async (): Promise<Array<string>> => {
  const fileName: string = "winston.ts";
  let filePath: string;
  await makeDirectory("./server");
  await makeDirectory("./server/config");
  filePath = `./server/config/${fileName}`;
  const content: string = await generateLoggerFactoryContent();
  const createdFilePath: string = await writeFile(filePath, content);
  return [createdFilePath];
};

export const writeMongooseModel = async (
  respository: Repository,
  flat: Boolean
): Promise<string> => {
  const fileName: string = `${respository.name}Model.ts`;
  let filePath: string;
  if (!flat) {
    await makeDirectory("./server");
    await makeDirectory("./server/data-access");
    await makeDirectory("./server/data-access/models");
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
  await makeDirectory("./server");
  await makeDirectory("./server/routes");
  await makeDirectory("./server/routes/base");
  filePath = `./server/routes/base/${fileName}`;
  const content: string = await generateApiContent(names);
  const createdFilePath: string = await writeFile(filePath, content);
  return createdFilePath;
};
