export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^|\s)\w/g, (letter) => letter.toUpperCase());
}
