import * as fs from 'fs/promises';
import path from 'path';
import Logger from './logger';

/**
 * Load the template contents from a file.
 * @param {string} templatePath - The path to the template file.
 * @returns {Promise<string>} The template content.
 * @throws {Error} If the template file does not exist or is not a .tmpl file.
 */
export const loadTemplate = async (templatePath: string): Promise<string> => {
    try {
        const resolvedPath = path.resolve(templatePath);
        await validateTemplatePath(resolvedPath);
        return await fs.readFile(resolvedPath, 'utf-8');
    } catch (error) {
        Logger.errorAndExit(error, `Failed to load template ${templatePath}`);
        throw new Error('Unreachable code');
    }
};

/**
 * Validate that the template file exists and has the correct extension.
 * @param {string} templatePath - The path to the template file.
 * @throws {Error} If the template file does not exist or is not a .tmpl file.
 */
const validateTemplatePath = async (templatePath: string): Promise<void> => {
    if (!(await fileExists(templatePath))) {
        Logger.error(`Template file does not exist: ${templatePath}`);
        process.exit(1);
    }
    if (path.extname(templatePath) !== '.tmpl') {
        Logger.error(`Template file must be a .tmpl file: ${templatePath}`);
        process.exit(1);
    }
};

/**
 * Check if a file exists.
 * @param {string} filePath - The path to the file.
 * @returns {Promise<boolean>} True if the file exists, false otherwise.
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

/**
 * Check if a path is a directory.
 * @param {string} dirPath - The path to check.
 * @returns {Promise<boolean>} True if the path is a directory, false otherwise.
 */
export const isDirectory = async (dirPath: string): Promise<boolean> => {
    try {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}

/**
 * Create a new file with content.
 * @param {string} filePath - The path where the file should be created.
 * @param {string} content - The content to write to the file.
 * @throws {Error} If the file cannot be created.
 */
export const createFile = async (filePath: string, content: string): Promise<void> => {
    try {
        await fs.writeFile(filePath, content);
    } catch (error) {
        Logger.errorAndExit(error, `Failed to create file ${filePath}`);
    }
};

/**
 * Read a file's content.
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise<string>} The content of the file.
 * @throws {Error} If the file cannot be read.
 */
export const readFile = async (filePath: string): Promise<string> => {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        Logger.errorAndExit(error, `Failed to read file ${filePath}`);
        throw new Error('Unreachable code');
    }
};

/**
 * Append content to a file.
 * @param {string} filePath - The path of the file to append to.
 * @param {string} content - The content to append.
 * @throws {Error} If the content cannot be appended to the file.
 */
export const appendToFile = async (filePath: string, content: string): Promise<void> => {
    try {
        await fs.appendFile(filePath, content, 'utf-8');
    } catch (error) {
        Logger.errorAndExit(error, `Failed to append to file ${filePath}`);
    }
};

/**
 * Write content to a file.
 * @param {string} filePath - The path of the file to write to.
 * @param {string} content - The content to write.
 * @throws {Error} If the content cannot be written to the file.
 */
export const writeFile = async (filePath: string, content: string): Promise<void> => {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
        Logger.errorAndExit(error, `Failed to write to file ${filePath}`);
    }
};

/**
 * Remove a file.
 * @param {string} filePath - The path of the file to remove.
 * @throws {Error} If the file cannot be removed.
 */
export const removeFile = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
        Logger.info(`Successfully removed file ${filePath}`);
    } catch (error) {
        Logger.errorAndExit(error, `Failed to remove file ${filePath}`);
    }
};

/**
 * Validate that a path is a directory.
 * @param {string} dir - The path to validate.
 * @throws {Error} If the path is not a valid directory.
 */
export const validateDirectory = async (dir: string) => {
    try {
        const isDir = await isDirectory(dir);
        if (!isDir) {
            Logger.error(`${dir} is not a valid directory`);
            process.exit(1);
        }
    } catch (error) {
        Logger.errorAndExit(error, `Failed to access directory ${dir}`);
    }
}


