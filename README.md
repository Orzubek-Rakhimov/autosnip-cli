[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.2-brightgreen.svg)](https://github.com/Orzubek-Rakhimov/autosnip-cli)

Are you tired of manually creating React snippets and managing index files? Look no further! AutoSnip CLI is here to save you time and effort. AutoSnip CLI is a powerful tool for automatically creating React , React Native and Next.js snippets and managing index files in your project.

## Features

- Automatically create React component snippets
- Support for React, React Native, and Next.js projects
- TypeScript and JavaScript support
- Watch directories for new files
- Automatically update index files
- Customizable snippet templates
- Configurable directory depths for snippet and index file creation
- Creates style file when snippet is added with different file extensions (css, scss,   sass, less, stylus) optionally prefixed with "module-" for CSS modules (e.g., "module-scss")
- Allow to remove associated style file when component file is deleted

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
or

### if you prefer it as a local package

```bash
npx autosnip [options]
```

## Options

- `-V, --version`: Output the version number
- `-d, --directory <directories...>`: Directory to watch for new files (required)
- `-t, --template <template>`: Path to custom template or use available snippets: TRAFC, TRFC, TNAFC, TNFC, TXL, JRAFC, JRFC, JNAFC, JNFC, JXL
- `-w, --watch`: Watch the specified directory for new files
- `-i, --index <indexFile>`: Create a specified index file for default exports
- `--snippet-depth <depth...>`: Depth to create snippets
- `--index-depth <depth...>`: Depth to create index files
- `-s, --style [type]`: Create a style file with the snippet. `[type]` can be "css", "scss", "sass", "less", "stylus", optionally prefixed with "module-" for CSS modules (e.g., "module-scss")
- `--remove-style`: Remove the associated style file when the component file is deleted
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

#### **Using default snippet:**

```bash
autosnip-cli -d ./src -t TRAFC -w -i notindex.ts --snippet-depth 1 --index-depth 1
```

#### **Using custom snippet and file type must be .tmpl:**

```tsx
import React from 'react';
import {{ name }} from './{{ name }}.module.css';

interface {{ name }}Props {}


const {{ name }} = ({}: {{ name }}Props) => {
  return <div>This is a custom snippet and file name is {{ name }}</div>;
};

export default {{ name }};
```

This custom snippet takes the `name` parameter, which is derived from the file's name, and uses it to generate both the component name and the filename for the CSS module:

```bash
autosnip-cli -d ./src -t ./path/to/your/template.tmpl -w -i notindex.ts --snippet-depth 1 --index-depth 1
```

#### **Multiple directories with multiple depths:**

```bash
autosnip-cli -d ./src ./components -t TRAFC -w -i notindex.ts --snippet-depth 1 2 --index-depth 1 2
```
## **New features**

#### **Creates style file when snippet is added with -s [type] option**

```bash
autosnip-cli -d ./src -t TRAFC -w -i notindex.ts --snippet-depth 1 --index-depth 1 -s module-scss
```
This command will create a style file `{{ name }}.module.scss` when the snippet is added and automatically import it in the snippet

#### **Allow to remove associated style file when component file is deleted with --remove-style option**

```bash
autosnip-cli -d ./src -t TRAFC -w -i notindex.ts --snippet-depth 1 --index-depth 1 -s module-scss --remove-style
```
In react-native project style file will not created or removed because react-native not supported style file or module-style, instead StyleSheet is used and just -s option is enough for react-native project to add StyleSheet in the snippet, other style options are just ignored.

Instead of this:
```tsx
import { Text, View } from 'react-native';

interface {{ name }}Props {}

const {{ name }} = ({}: {{ name }}Props) => {
  return (
    <View>
      <Text>{{ name }}</Text>
    </View>
  );
};

export default {{ name }};
```
This used:

```tsx
import { Text, View , StyleSheet } from 'react-native';

interface {{ name }}Props {}

const {{ name }} = ({}: {{ name }}Props) => {
  return (
    <View>
      <Text>{{ name }}</Text>
    </View>
  );
};

export default {{ name }};

const styles = StyleSheet.create({ /* Add your styles here */ });
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on our [GitHub repository](https://github.com/Orzubek-Rakhimov/autosnip-cli/issues).

---

Made with ❤️ by [Rakhimov Orzubek](https://github.com/Orzubek-Rakhimov)



