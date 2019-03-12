import * as fs from 'fs';
import chalk from 'chalk';
import { Model } from './interfaces';
import { generateModel, generateGenericServerFiles, generateApiFile } from './generators';
import { outputCreatedFiles, asyncForEach } from './utils';

const data: { features: any, models: Array<Model> } = JSON.parse(fs.readFileSync('models.json').toString());
const features: any = data.features;
const models: Array<Model> = data.models;

/**
 * This function generates all the customizable files that
 * do not depend on the model entities.
 */
const generateServerFiles = async () => {
    try {
        console.log(chalk.blueBright('Generating server files...\n'));
        const createdFilesNames: Array<string> = await generateGenericServerFiles(features);
        outputCreatedFiles(createdFilesNames);
        const message = `Server files generated!\n`
        console.log(chalk.greenBright(message));
    } catch (error) {
        const message = `Error ocurred generating server files`;
        console.log(chalk.red(message, error));
    }
}

/**
 * This function generates all the files realted to each entity of the model, such as
 * routes, controllers, repository, etc. 
 * @param models Entities.
 */
const generateModelsFiles = async (models: Array<Model>) => {
    console.log(chalk.blueBright('Generating models\n'));
    await asyncForEach(models, async (model: Model) => {
        console.log(`Generating ${model.name} model...`);
        try {
            const createdFilesNames: Array<string> = await generateModel(model);
            outputCreatedFiles(createdFilesNames);
            const message = `${model.name} generated!\n`
            console.log(chalk.greenBright(message));
        } catch (error) {
            const message = `Error generating model`;
            console.log(chalk.red(message, error));
        }
    });
    console.log(chalk.blueBright('Generating API file\n'));
    const names = models.map((model: Model) => {
        return model.name;
    });
    const createdFileName: string = await generateApiFile(names, features);
    outputCreatedFiles([createdFileName]);
    const message = `API generated!\n`
    console.log(chalk.greenBright(message));
}

/**
 * Main function.
 */
const generateBackEnd = async () => {
    await generateServerFiles();
    await generateModelsFiles(models);
}

generateBackEnd();
