export enum DefaultSnippets {
    // typescript
    TRAFC = 'ts/react/arrowFunctionComponent.tmpl',
    TRFC = 'ts/react/functionComponent.tmpl',
    TNAFC = 'ts/native/arrowFunctionComponent.tmpl',
    TNFC = 'ts/native/functionComponent.tmpl',
    TXL = 'ts/next/layout.tmpl',
    // javascript
    JRAFC = 'js/react/arrowFunctionComponent.tmpl',
    JRFC = 'js/react/functionComponent.tmpl',
    JNAFC = 'js/native/arrowFunctionComponent.tmpl',
    JNFC = 'js/native/functionComponent.tmpl',
    JXL = 'js/next/layout.tmpl',
}

export enum ProjectType {
    REACT = 'react',
    REACT_NATIVE = 'react-native',
    NEXT = 'next',
}

export enum SupportedStyles {
    CSS = 'css',
    SCSS = 'scss',
    SASS = 'sass',
    LESS = 'less',
    STYLUS = 'stylus',
    MODULE_CSS = 'module-css',
    MODULE_SCSS = 'module-scss',
    MODULE_SASS = 'module-sass',
    MODULE_LESS = 'module-less',
    MODULE_STYLUS = 'module-stylus',
}

export const DEFAULT_SNIPPET_DEPTH = 99;

export const DEFAULT_INDEX_DEPTH = 99;

export const SUPPORTED_FILE_EXTENSIONS = ['.tsx', '.jsx'];
