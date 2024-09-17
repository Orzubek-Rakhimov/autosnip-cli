import path from "path";
import { createFile, removeFile } from "./file";
import { SupportedStyles, SupportedStylesExtensions } from "../types";
import Logger from "./logger";
import { knownFiles } from "../main";
import { ProjectType, SupportedStyles as SupportedStylesConstants } from "../constants";
import { checkProjectType } from "./helpers";


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
 * Add the style import to the content
 * @param {string} content - The content to add the style import to
 * @param {string} styleFilePath - The file path to the style file
 * @param {SupportedStylesExtensions} ext - The extension of the style file
 * @returns {Promise<string>} - The content with the style import added
 */
export const addStyleImportToContent = async (content: string, styleFilePath: string, ext: SupportedStylesExtensions): Promise<string> => {
    const lines = content.split('\n');
    const isReactNative = (await checkProjectType()) === ProjectType.REACT_NATIVE;

    if (isReactNative) {
        const reactNativeImport = lines.find(line => /^\s*import\s+{[^}]*}\s+from\s+['"]react-native['"];?\s*$/.test(line));

        if (reactNativeImport) {
            if (!reactNativeImport.includes('StyleSheet')) {
                lines[lines.indexOf(reactNativeImport)] = reactNativeImport.replace(/}\s*from/, ', StyleSheet } from');
            }
        } else {
            lines.unshift('import { StyleSheet } from \'react-native\';');
        }

        if (!lines.some(line => line.includes('StyleSheet.create'))) {
            lines.push('\nconst styles = StyleSheet.create({ /* Add your styles here */ });');
        }
    } else {
        const importStatement = ext.startsWith('.module.')
            ? `import styles from './${path.basename(styleFilePath)}';`
            : `import './${path.basename(styleFilePath)}';`;

        const lastImportIndex = lines.findLastIndex(line => line.trim().startsWith('import '));
        lastImportIndex !== -1 ? lines.splice(lastImportIndex + 1, 0, importStatement) : lines.unshift(importStatement);
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
        if ((await checkProjectType()) === ProjectType.REACT_NATIVE) {
            return await addStyleImportToContent(content, filePath, ext);
        }
        const styleFilePath = await createStyleFile(filePath, ext);
        knownFiles.add(styleFilePath);
        Logger.info(`Created style file for ${filePath}`);
        return await addStyleImportToContent(content, styleFilePath, ext);
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
export const proccessRemoveStyleFile = async (filePath: string): Promise<void> => {
    try {
        await removeFile(filePath);
        knownFiles.delete(filePath);
        Logger.info(`Removed style file for ${filePath}`);
    } catch (error) {
        Logger.errorAndExit(error, `Error processing style file for ${filePath}`);
    }
}