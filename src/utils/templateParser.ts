import fs from 'fs/promises';
import path from 'path';
import { DefaultSnippets } from '../constants';
import Logger from './logger';

interface ParsedTemplates {
    [key: string]: string;
}

export async function parseTemplates(): Promise<void> {
    const parsedTemplates: Record<string, string> = {};

    for (const [key, value] of Object.entries(DefaultSnippets)) {
        try {
            const templatePath = path.resolve('src', 'snippets', value);
            const content = await fs.readFile(templatePath, 'utf-8');
            parsedTemplates[key] = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
        } catch (error) {
            Logger.warn(`Failed to read template file for ${key}: ${error}`);
        }
    }

    const outputPath = path.resolve('src', 'parsedTemplates.ts');
    const enumEntries = Object.entries(parsedTemplates)
        .map(([key, value]) => `  "${key}" = \`${value}\``)
        .join(',\n');
    const output = `export enum ParsedTemplates {\n${enumEntries}\n}`;

    await fs.writeFile(outputPath, output, 'utf-8');
    Logger.info(`Parsed templates written to ${outputPath}`);
}

if (require.main === module) {
    parseTemplates().catch(console.error);
}