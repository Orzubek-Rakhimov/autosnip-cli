import path from "path";
import { program } from "./command";
import { watch } from "chokidar";
import { getIndexFileName, getTemplateContent } from "./utils/helpers";
import { createSnippet } from "./utils/snippet";
import { removeFromIndexFile, updateIndexFile } from "./utils";
import { validateDirectory } from "./utils/file";
import Logger from "./utils/logger";
import { DEFAULT_INDEX_DEPTH, DEFAULT_SNIPPET_DEPTH } from "./constants/index";
import { DirDepthPair } from "./types";

export const knownFiles = new Set<string>();

export const main = async () => {
    const options = program.opts();
    const indexFileName = await getIndexFileName(options.index);
    const templateContent = await getTemplateContent(options.template);

    const watchDirectory = (dirs: { dir: string; snippetDepth: number; indexDepth: number }[], once = false) => {
        dirs.forEach(({ dir, snippetDepth, indexDepth }, index) => {
            const excludeDirs = dirs.slice(index + 1).map(d => path.normalize(d.dir));
            const watchRef = watch(dir, {
                ignoreInitial: false,
                depth: snippetDepth - 1,
                ignored: (filePath) => {
                    const normalizedFilePath = path.normalize(filePath);
                    return excludeDirs.some(excludeDir => normalizedFilePath.startsWith(excludeDir));
                }
            });

            const handleFile = async (filePath: string, isAdd: boolean) => {
                if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
                    if (isAdd) {
                        const component = path.basename(filePath);
                        const content = typeof templateContent === 'function' ? await templateContent(component) : templateContent;
                        await createSnippet(filePath, content);
                        knownFiles.add(filePath);
                        if (indexDepth > 0) {
                            await updateIndexFile(filePath, indexFileName, indexDepth, dir);
                        }
                    } else {
                        if (knownFiles.has(filePath)) {
                            await removeFromIndexFile(filePath, indexFileName);
                            knownFiles.delete(filePath);
                        }
                    }
                }
            };

            watchRef
                .on('add', (filePath) => handleFile(filePath, true))
                .on('unlink', (filePath) => handleFile(filePath, false));

            if (once) {
                watchRef.on('ready', () => watchRef.close());
            }
        });
    };


    const dirDepthPairs = options.directory
        .map((dir: string, index: number) => ({
            dir: path.resolve(dir),
            snippetDepth: options.snippetDepth?.[index] ?? DEFAULT_SNIPPET_DEPTH,
            indexDepth: options.indexDepth?.[index] ?? DEFAULT_INDEX_DEPTH,
        }))
        .sort((a: DirDepthPair, b: DirDepthPair) => a.dir.length - b.dir.length);


    await Promise.all(dirDepthPairs.map(({ dir }: { dir: string }) => validateDirectory(dir)));

    watchDirectory(dirDepthPairs, !options.watch);

    if (options.watch) {
        options.directory.forEach((dir: string) => {
            Logger.info(`Watching directory ${dir}`);
        });
    }
}