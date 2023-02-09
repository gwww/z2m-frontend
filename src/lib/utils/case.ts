import type { Dictionary } from '$lib/types'

// Adapted from: https://stackoverflow.com/a/39718708
export const camel2Title = (str: string) => str
  .replace(/([A-Z0-9])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim();

// From: https://stackoverflow.com/a/64489760
export const snake2Title = (str: string) => str
  .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
  .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

const exceptions: Dictionary<string> = {
  'linkquality': 'Link Quality',
}

export const any2Title = (str: string) => {
  exceptions[str] ? exceptions[str] : str.includes('_') ? camel2Title(str) : snake2Title(str)
}
