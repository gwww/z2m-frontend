import { AccessType } from '$lib/types';
import type { Dictionary, ExposedItemBase } from '$lib/types';

// Adapted from: https://stackoverflow.com/a/39718708
export const camel2Title = (str: string): string =>
    str
        .replace(/([A-Z0-9])/g, (match) => ` ${match}`)
        .replace(/^./, (match) => match.toUpperCase())
        .trim();

// From: https://stackoverflow.com/a/64489760
export const snake2Title = (str: string): string =>
    str
        .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
        .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());

const exceptions: Dictionary<string> = {
    linkquality: 'Link Quality',
};

// Simple replace on words to give better looking titles
// If the list of substitutions grows then may need to have a better algorithm
const processModifications = (str: string): string => {
    return str
        .replaceAll(/\bled\b/gi, 'LED')
        .replaceAll(/\btemp\b/gi, 'Temperature')
};

export const any2Title = (str: string): string => {
    if (!str) return '';
    if (exceptions[str]) return exceptions[str];
    const titleCase = str.includes('_') ? snake2Title(str) : camel2Title(str);
    return processModifications(titleCase);
};


export const isWritable = (feature: ExposedItemBase): boolean => {
    return !feature.access || (feature.access & AccessType.ACCESS_WRITE) != 0
}

let n = Date.now();
export const generateId = (prefix = 'tx-'): string => {
    return prefix + (++n).toString(36);
}
