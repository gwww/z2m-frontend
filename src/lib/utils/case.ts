// Adapted from: https://stackoverflow.com/a/39718708
export const camel2Title = (str: string) => str
  .replace(/([A-Z0-9])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim();

// From: https://stackoverflow.com/a/64489760
export const snake2Title = (str: string) => str
  .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
  .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

export const any2Title = (str: string) => str
  .includes('_') ? camel2Title(str) : snake2Title(str)
