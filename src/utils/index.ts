import path from 'path';
import chalk from 'chalk';
import { appendToFile, readFile, createFile, fileExists, writeFile, removeFile } from './file';
import { toCamelCase } from './helpers';
import { knownFiles } from '../main';
import Logger from './logger';


/**
 * Remove duplicates from an index file
 * @param {string} indexFilePath - The path to the index file
 * @returns {Promise<void>}
 */

export const removeDuplicatesFromIndexFile = async (indexFilePath: string): Promise<void> => {
    try {
        const content = await readFile(indexFilePath);
        const lines = content.split('\n');
        const uniqueLines = Array.from(new Set(lines));
        const cleanedContent = uniqueLines.join('\n');

        if (lines.length !== uniqueLines.length) {
            Logger.info(`Found and removed ${lines.length - uniqueLines.length} duplicate(s) from ${indexFilePath}`);
            await createFile(indexFilePath, cleanedContent);
        }
    } catch (error) {
        Logger.errorAndExit(error, `Error removing duplicates from index file ${indexFilePath}`);
    }
};


/**
 * Update an index file
 * @param {string} filePath - The path to the file
 * @param {string} indexFileName - The name of the index file
 * @param {number} depth - The depth of the file
 * @param {string} watchingPath - The path to the watching directory
 * @returns {Promise<void>} 
 */
export const updateIndexFile = async (filePath: string, indexFileName: string, depth: number, watchingPath: string): Promise<void> => {
    const dir = path.dirname(filePath);
    const lvlDiff = path.relative(path.dirname(watchingPath), dir).split(path.sep).length;

    if (lvlDiff - 1 >= depth) return;

    const indexFilePath = path.join(dir, indexFileName);
    if (filePath === indexFilePath) return;

    const componentName = path.basename(filePath, path.extname(filePath));
    const indexContent = `export { default as ${toCamelCase(componentName)} } from './${componentName}';\n`;

    try {
        const existingContent = await fileExists(indexFilePath) ? await readFile(indexFilePath) : '';
        if (!existingContent.includes(indexContent)) {
            await appendToFile(indexFilePath, indexContent);
            knownFiles.add(indexFilePath);
            Logger.info(`${toCamelCase(componentName)} added to index file: ${indexFilePath}`);
        }
        await removeDuplicatesFromIndexFile(indexFilePath);
    } catch (error) {
        Logger.errorAndExit(error, `Error updating index file ${indexFilePath}`);
    }
};


/**
 * Remove a component from an index file
 * @param {string} filePath - The path to the file
 * @param {string} indexFileName - The name of the index file
 * @returns {Promise<void>}
 */
export const removeFromIndexFile = async (filePath: string, indexFileName: string): Promise<void> => {
    const dir = path.dirname(filePath);
    const indexFilePath = path.join(dir, indexFileName);

    if (path.resolve(filePath) === path.resolve(indexFilePath) || !(await fileExists(indexFilePath))) {
        return;
    }

    const componentName = toCamelCase(path.basename(filePath, path.extname(filePath)));

    try {
        const indexContent = await readFile(indexFilePath);
        const exportRegex = new RegExp(`export\\s*{[^}]*?\\b${componentName}\\b[^}]*?}\\s*from\\s*['"]\\.\/[^'"]+['"];?\\s*\n?`, 'gi');
        const newContent = indexContent.replace(exportRegex, '').trim();

        if (newContent === indexContent.trim()) return;

        if (newContent === '') {
            await removeFile(indexFilePath);
            knownFiles.delete(indexFilePath);
            Logger.info(`Deleted empty index file: ${indexFilePath}`);
        } else {
            await writeFile(indexFilePath, newContent);
            Logger.info(`Removed ${componentName} from ${indexFilePath}`);
        }

        knownFiles.delete(filePath);
    } catch (error) {
        Logger.errorAndExit(error, `Error removing ${componentName} from ${indexFilePath}`);
    }
}