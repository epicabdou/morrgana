// utils/text.ts
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length).replace(/\s+\S*$/, '') + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}