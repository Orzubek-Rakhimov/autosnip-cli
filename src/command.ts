import { Command } from "commander";
import { version } from "../package.json";
import { DefaultSnippets } from "./constants";
import { main } from "./main";
import { parseDepth } from "./utils/helpers";


export const program = new Command();

program
  .name("autosnip-cli")
  .version(version)
  .description('Create a React component snippet')
  .requiredOption('-d, --directory <directories...>', 'Directory to watch for new files')
  .option('-t, --template <template>', 'Path to custom template or use available snippets: ' + Object.keys(DefaultSnippets).join(', '))
  .option('-w, --watch', 'Watch the specified directory for new files')
  .option('-i, --index <indexFile>', 'Create a specified index file for default exports')
  .option('--snippet-depth <depth...>', 'Depth to create snippets', (value: string, prev: number[] | undefined) => parseDepth(value, prev, false))
  .option('--index-depth <depth...>', 'Depth to create index files', (value: string, prev: number[] | undefined) => parseDepth(value, prev, true, '--index-depth'))
  .allowUnknownOption(false)
  .allowExcessArguments(false)
  .showHelpAfterError()
  .action(async () => {
    await main();
  });