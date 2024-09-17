import path from "path";
import { createFile, removeFile } from "./file";
import { SupportedStyles, SupportedStylesExtensions } from "../types";
import Logger from "./logger";
import { knownFiles } from "../main";
import { SupportedStyles as SupportedStylesConstants } from "../constants";


/**
 * Get the style extension for the given style type
 * @param {SupportedStyles | true} styleType - The style type to get the extension for
 * @returns {SupportedStylesExtensions} - The extension for the given style type
 */
export const getSytyleExt = (styleType: SupportedStyles | true): SupportedStylesExtensions => {
    if (styleType === true) {
        return '.css';
    }

    if (typeof styleType !== 'string' || !Object.values(SupportedStylesConstants).includes(styleType)) {
        Logger.errorAndExit(`Invalid style type: ${styleType}`, 'Valid style types: ' + Object.values(SupportedStylesConstants).join(', '));
        throw new Error('Unreachable');
    }

    return `.${styleType.replace('-', '.')}` as SupportedStylesExtensions;
}


/**
 * Get the style path for the given file path and style type
 * @param {string} filePath - The file path to get the style path for
 * @param {SupportedStylesExtensions} styleExt - The style extension to get the style path for
 * @returns {string} - The style path for the given file path and style type
 */
export const getStylePath = (filePath: string, styleExt: SupportedStylesExtensions): string => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    return path.join(dir, `${fileName}${styleExt}`);
}


/**
 * Create a style file for the given file path and style type
 * @param {string} filePath - The file path to create the style file for
 * @param {SupportedStyles} styleType - The style type to create the style file for
 * @returns {Promise<string>} - The path to the created style file
 */

export const createStyleFile = async (filePath: string, ext: SupportedStylesExtensions): Promise<string> => {
    try {
        const styleFilePath = getStylePath(filePath, ext);
        await createFile(styleFilePath, '');
        return styleFilePath;
    } catch (error) {
        Logger.errorAndExit(error, `Error creating style file for ${filePath}`);
        throw new Error('Unreachable');
    }
}


/**
 * Add a style import to the content of a file
 * @param {string} content - The content of the file
 * @param {string} styleFilePath - The path to the style file
 * @returns {string} - The content with the style import added
 */
export const addStyleImportToContent = (content: string, styleFilePath: string): string => {
    const importStatement = `import './${path.basename(styleFilePath)}';`;
    const lines = content.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i]?.trim().startsWith('import ')) {
            lastImportIndex = i;
        }
    }

    if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
        lines.unshift(importStatement);
    }

    return lines.join('\n');
}

/**
 * Process the creation of a style file
 * @param {string} filePath - The file path to create the style file for
 * @param {SupportedStyles | true} styleType - The style type to create the style file for
 * @param {string} content - The content of the file
 * @returns {Promise<string>} - The content with the style import added
 */

export const proccessCreateStyleFile = async (filePath: string, ext: SupportedStylesExtensions, content: string): Promise<string> => {
    try {
        const styleFilePath = await createStyleFile(filePath, ext);
        knownFiles.add(styleFilePath);
        Logger.info(`Created style file for ${filePath}`);
        return addStyleImportToContent(content, styleFilePath);
    } catch (error) {
        Logger.errorAndExit(error, `Error processing style file for ${filePath}`);
        throw new Error('Unreachable');
    }
}

/**
 * Process the removal of a style file
 * @param {string} filePath - The file path to remove the style file for
 * @returns {Promise<void>}
 */
export const proccessRemoveStyleFile = async (filePath: string) => {
    try {
        await removeFile(filePath);
        knownFiles.delete(filePath);
        Logger.info(`Removed style file for ${filePath}`);
    } catch (error) {
        Logger.errorAndExit(error, `Error processing style file for ${filePath}`);
    }
}