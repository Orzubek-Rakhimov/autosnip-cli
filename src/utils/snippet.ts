import path from 'path';
import { createFile, isFileEmpty } from './file';
import { ProjectType } from '../constants/index';
import { checkProjectType, compile, toCamelCase } from './helpers';
import Logger from './logger';
import { knownFiles } from '../main';


/**
 * Create a snippet for the given file path and template content
 * @param {string} filePath - The file path to create the snippet for
 * @param {string} templateContent - The template content to create the snippet with
 * @returns {Promise<void>}
 */
export const createSnippet = async (filePath: string, templateContent: string): Promise<void> => {
    try {
        const componentName = await getComponentName(filePath);
        const snippet = compile(templateContent, { name: componentName });
        await writeSnippetToFile(filePath, snippet);
        knownFiles.add(filePath);
    } catch (error) {
        Logger.errorAndExit(error, `Error creating snippet for ${filePath}`);
    }
};

/**
 * Generate the component name from the file path
 * @param {string} filePath - The file path to generate the component name from
 * @returns {Promise<string>} - The component name
 */
const getComponentName = async (filePath: string): Promise<string> => {
    const component = path.basename(filePath);
    let componentName = toCamelCase(path.basename(component, path.extname(component)));

    if (await checkProjectType() === ProjectType.NEXT && componentName.toLowerCase() === 'page') {
        const parentDirName = path.basename(path.dirname(filePath));
        componentName = `${toCamelCase(parentDirName)}Page`;
    }

    return componentName;
};


/**
 * Writes the snippet to the file if the file is empty.
 * @param {string} filePath - The path of the file to write to.
 * @param {string} snippet - The snippet content to write.
 * @returns {Promise<void>}
 */
const writeSnippetToFile = async (filePath: string, snippet: string): Promise<void> => {
    if (await isFileEmpty(filePath)) {
        await createFile(filePath, snippet);
        Logger.info(`Snippet created for ${path.basename(filePath)}`);
    } else {
        Logger.warn(`File ${filePath} is not empty`);
    }
};

