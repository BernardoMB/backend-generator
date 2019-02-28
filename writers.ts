import * as fs from 'fs';
import chalk from 'chalk';
import { Interface, Class, Controller, Business, Repository } from "./interfaces";
import { generateInterfaceContent, generateClassContent, generateControllerContent, generateBusinessInterfaceContent, generateBusinessContent, generateRepositoryContent } from "./content-generators";

export const makeDirectory = async (directory: string) => {
    try {
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        return 'Directory created!';
    } catch (error) {
        throw error;
    }
}

export const writeFile = (filePath: string, content: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath, content, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(filePath);
            }
        });
    });
}

export const writeInterface = async (_interface: Interface, flat: boolean) => {
    const fileName: string = `I${_interface.name}.ts`
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
}

export const writeClass = async (_class: Class, flat: boolean) => {
    const fileName: string = `${_class.name}.ts`;
    let filePath: string;
    if (!flat) {
        await makeDirectory('./server');
        await makeDirectory('./server/models');
        filePath = `./server/models/${fileName}`
    } else {
        filePath = fileName;
    }
    const content: string = await generateClassContent(_class);
    const createdFilePath: string = await writeFile(filePath, content);
    return createdFilePath;
}

export const writeController = async (controller: Controller, flat: Boolean) => {
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
}

export const writeBusiness = async (business: Business, flat: Boolean) => {
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
    const businessInterfaceContent: string = await generateBusinessInterfaceContent(business);
    const businessContent: string = await generateBusinessContent(business);
    const createdBusinessInterfaceFilePath: string = await writeFile(businessInterfaceFilePath, businessInterfaceContent);
    const createdBusinessFilePath: string = await writeFile(businessFilePath, businessContent);
    return [createdBusinessInterfaceFilePath, createdBusinessFilePath];
}

export const writeRepository = async (respository: Repository, flat: Boolean) => {
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
}
