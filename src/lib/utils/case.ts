import type { Dictionary } from '$lib/types'

// Adapted from: https://stackoverflow.com/a/39718708
export const camel2Title = (str: string): string => str
  .replace(/([A-Z0-9])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim();

// From: https://stackoverflow.com/a/64489760
export const snake2Title = (str: string): string => str
  .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
  .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

const exceptions: Dictionary<string> = {
  'linkquality': 'Link Quality',
}

const processModifications = (str: string): string => {
  return str
    .replaceAll(/\bled\b/ig, 'LED')
}

export const any2Title = (str: string): string => {
  if (!str) return ''
  if (exceptions[str]) return exceptions[str]
  const titleCase = str.includes('_') ? snake2Title(str) : camel2Title(str)
  return processModifications(titleCase)
}
