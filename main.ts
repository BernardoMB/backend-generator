import * as fs from 'fs';
import chalk from 'chalk';
import { Model } from './interfaces';
import { generateModel, generateGenericServerFiles } from './generators';
import { outputCreatedFiles, asyncForEach } from './utils';

const data: {models:Array<Model>} = JSON.parse(fs.readFileSync('models.json').toString());

const models: Array<Model> = data.models;

const generateServerFiles = async () => {
    try {
        console.log(chalk.blueBright('Generating server files...\n'));
        const createdFilesNames: Array<string> = await generateGenericServerFiles();
        outputCreatedFiles(createdFilesNames);
        const message = `Server files generated!\n`
        console.log(chalk.greenBright(message));
    } catch (error) {
        const message = `Error ocurred`;
        console.log(chalk.redBright(message, error));
    }
}

const generateModels = async (models: Array<Model>) => {
    console.log(chalk.blueBright('Generating models\n'));
    await asyncForEach(models, async (model: Model) => {
        console.log(`Generating ${model.name} model...`);
        try {
            const createdFilesNames: Array<string> = await generateModel(model);
            outputCreatedFiles(createdFilesNames);
            const message = `${model.name} generated!\n`
            console.log(chalk.greenBright(message));
        } catch (error) {
            const message = `Error ocurred`;
            console.log(chalk.redBright(message, error));
        }
    });
}

generateServerFiles();
generateModels(models);
