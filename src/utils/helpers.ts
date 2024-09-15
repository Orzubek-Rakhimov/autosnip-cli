import chalk from "chalk";
import { loadTemplate, readFile } from "./file";
import { DefaultSnippets, ProjectType } from "../constants/index";
import path from "path";
import Logger from "./logger";
import { ParsedTemplates } from "../parsedTemplates";

/**
 * Reads and parses the package.json file.
 * @returns {Promise<any>} The parsed contents of package.json.
 * @throws {Error} If the file cannot be read or parsed.
 */
const readPackageJson = async (): Promise<any> => {
    try {
        return JSON.parse(await readFile('package.json'));
    } catch (error) {
        Logger.error(`Failed to read package.json: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
};

/**
 * Retrieves the version from package.json.
 * @returns {Promise<string>} The version string.
 */
export const getVersion = async (): Promise<string> => {
    const packageData = await readPackageJson();
    return packageData.version;
};

/**
 * Determines the project type based on dependencies.
 * @returns {Promise<string>} The project type (REACT_NATIVE, NEXT, or REACT).
 */
export const checkProjectType = async (): Promise<string> => {
    try {
        const { dependencies, devDependencies } = await readPackageJson();
        const allDependencies = { ...dependencies, ...devDependencies };

        if (allDependencies['react-native']) return ProjectType.REACT_NATIVE;
        if (allDependencies['next']) return ProjectType.NEXT;
        return ProjectType.REACT;
    } catch {
        return ProjectType.REACT;
    }
};

/**
 * Checks if TypeScript is used in the project.
 * @returns {Promise<boolean>} True if TypeScript is used, false otherwise.
 */
export const isTypescriptUsed = async (): Promise<boolean> => {
    const { devDependencies, dependencies } = await readPackageJson();
    return !!(devDependencies?.typescript || dependencies?.typescript);
};

/**
 * Gets the default snippet based on the component and project type.
 * @param {string} component - The component name.
 * @returns {Promise<string>} The default snippet.
 */
export const getDefaultSnippet = async (component: string): Promise<string> => {
    const ext = path.extname(component);
    const name = path.basename(component, ext);
    const projectType = await checkProjectType();
    const isTypescript = ext === '.tsx';

    if (projectType === ProjectType.NEXT && name === 'layout') {
        return isTypescript ? ParsedTemplates.TXL : ParsedTemplates.JXL;
    }

    const snippetMap = {
        [ProjectType.REACT]: isTypescript ? ParsedTemplates.TRAFC : ParsedTemplates.JRAFC,
        [ProjectType.REACT_NATIVE]: isTypescript ? ParsedTemplates.TNAFC : ParsedTemplates.JNAFC,
        [ProjectType.NEXT]: isTypescript ? ParsedTemplates.TRAFC : ParsedTemplates.JRAFC,
    };

    return snippetMap[projectType as keyof typeof snippetMap] || (isTypescript ? ParsedTemplates.TRAFC : ParsedTemplates.JRAFC);
};

/**
 * Converts a string to camelCase.
 * @param {string} input - The input string.
 * @returns {string} The camelCased string.
 */
export const toCamelCase = (input: string): string =>
    input.split(/[^a-zA-Z0-9]/)
        .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

/**
 * Determines the index file name based on the project setup.
 * @param {string} indexFileName - The proposed index file name.
 * @returns {Promise<string>} The determined index file name.
 */
export const getIndexFileName = async (indexFileName: string): Promise<string> => {
    const isTypescript = await isTypescriptUsed();
    const defaultExt = isTypescript ? '.ts' : '.js';
    const defaultFileName = `index${defaultExt}`;

    if (!indexFileName) return defaultFileName;

    const ext = path.extname(indexFileName);
    if (!ext) return `${indexFileName}${defaultExt}`;
    if (ext !== '.ts' && ext !== '.js') {
        Logger.warn(`Invalid index file extension. Using default.`);
        return defaultFileName;
    }

    return indexFileName;
};

/**
 * Parses the depth value from a string input.
 * @param {string} value - The depth value as a string.
 * @param {number[]} prev - Previous depth values.
 * @param {boolean} lessThanZero - Whether to allow values less than zero.
 * @returns {number[]} An array of parsed depth values.
 * @throws {Error} If the depth value is invalid.
 */
export const parseDepth = (value: string, prev: number[] = [], lessThanZero: boolean, optionName: string = '--snippet-index'): number[] => {
    const depth = parseInt(value, 10);
    if (isNaN(depth) || (lessThanZero ? depth < 0 : depth <= 0)) {
        Logger.error(`${optionName} value "${value}" must be a positive integer${lessThanZero ? '' : ' and cannot be zero'}`);
        process.exit(1);
    }
    return [...prev, depth];
};

/**
 * Compiles a template string by replacing placeholders with provided data.
 * @param {string} template - The template string.
 * @param {{ name: string }} data - The data object containing values to replace in the template.
 * @returns {string} The compiled string.
 */
export const compile = (template: string, data: { name: string }): string =>
    template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => key === 'name' ? data.name : _);



/**
 * Get the template content from the template file
 * @param {string | undefined} template - The template name or path to the template file.
 * @returns {Promise<string | ((component: string) => Promise<string>)>} - The template content or a function to get the template content.
 */
export const getTemplateContent = async (template: string | undefined): Promise<string | ((component: string) => Promise<string>)> => {
    try {
        if (!template) return async (component: string) => await getDefaultSnippet(component);
        if (ParsedTemplates[template.toUpperCase() as keyof typeof ParsedTemplates]) return ParsedTemplates[template.toUpperCase() as keyof typeof ParsedTemplates];
        return await loadTemplate(template);
    } catch (error) {
        Logger.errorAndExit(error, `Error loading template ${template}`);
        throw new Error('Unreachable code');
    }
};
