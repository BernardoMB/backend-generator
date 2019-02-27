import * as fs from 'fs';
import { Interface, Class, Controller } from "./interfaces";
import { generateInterfaceContent, generateClassContent, generateControllerContent } from "./content-generators";

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
        await makeDirectory('./models');
        await makeDirectory('./models/interfaces/');
        filePath = `./models/interfaces/${fileName}`;
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
        await makeDirectory('./models');
        filePath = `./models/${fileName}`
    } else {
        filePath = fileName;
    }
    const content: string = await generateClassContent(_class);
    const createdFilePath: string = await writeFile(filePath, content);
    return createdFilePath;
}

export const writeController = async (controller: Controller, flat: Boolean) => {
    const fileName: string = `${controller.name}Controller.ts`;
    let filePath: string ;
    if (!flat) {
        await makeDirectory('./controllers');
        filePath = `./controllers/${fileName}`;
    } else {
        filePath = fileName;
    }
    const content: string = await generateControllerContent(controller);
    const createdFilePath: string = await writeFile(filePath, content);
    return createdFilePath;
}