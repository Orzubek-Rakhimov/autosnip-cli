import { SupportedStyles as SupportedStylesConstants } from "./constants";

export type DirDepthPair = {
    dir: string;
    snippetDepth: number;
    indexDepth: number;
}

export type SupportedStyles = typeof SupportedStylesConstants[keyof typeof SupportedStylesConstants];

export type SupportedStylesExtensions = '.css' | '.scss' | '.sass' | '.less' | '.styl' | '.module.css' | '.module.scss' | '.module.sass' | '.module.less' | '.module.styl';


