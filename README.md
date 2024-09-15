[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-brightgreen.svg)](https://github.com/Orzubek-Rakhimov/autosnip-cli)

Are you tired of manually creating React snippets and managing index files? Look no further! AutoSnip CLI is here to save you time and effort. AutoSnip CLI is a powerful tool for automatically creating React , React Native and Next.js snippets and managing index files in your project.

## Features

- Automatically create React component snippets
- Support for React, React Native, and Next.js projects
- TypeScript and JavaScript support
- Watch directories for new files
- Automatically update index files
- Customizable snippet templates
- Configurable directory depths for snippet and index file creation

## Installation

### if you prefer it as a global package

```bash
npm install -g autosnip-cli
```

or 

```bash
yarn global add autosnip-cli
```

### if you prefer it as a local package

```bash
npm install --save-dev autosnip-cli
```

or 

```bash
yarn add --dev autosnip-cli
```

## Usage


### if you prefer it as a global package

```bash
autosnip [options]
```

## Options

- `-V, --version`: Output the version number
- `-d, --directory <directories...>`: Directory to watch for new files (required)
- `-t, --template <template>`: Path to custom template or use available snippets: TRAFC, TRFC, TNAFC, TNFC, TXL, JRAFC, JRFC, JNAFC, JNFC, JXL
- `-w, --watch`: Watch the specified directory for new files
- `-i, --index <indexFile>`: Create a specified index file for default exports
- `--snippet-depth <depth...>`: Depth to create snippets
- `--index-depth <depth...>`: Depth to create index files
- `-h, --help`: Display help for command

## Available Templates

- TRAFC: Typescript React Arrow Functional Component
- TRFC: Typescript React Functional Component
- TNAFC: Typescript React Native Arrow Functional Component
- TNFC: Typescript React Native Functional Component
- TXL: Typescript Next.js Layout
- JRAFC: Javascript React Arrow Functional Component
- JRFC: Javascript React Functional Component
- JNAFC: Javascript React Native Arrow Functional Component
- JNFC: Javascript React Native Functional Component
- JXL: Javascript Next.js Layout


### Examples

```bash
autosnip-cli -d ./src -t TRAFC -w -i notindex.ts --snippet-depth 1 --index-depth 1
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on our [GitHub repository](https://github.com/Orzubek-Rakhimov/autosnip-cli/issues).

---

Made with ❤️ by [Rakhimov Orzubek](https://github.com/Orzubek-Rakhimov)



