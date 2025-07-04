// utils/image.ts
export function getImageUrl(record: any, filename: string, size?: string): string {
  const pb = usePocketBase()
  const baseUrl = pb.files.getURL(record, filename)
  return size ? `${baseUrl}?thumb=${size}` : baseUrl
}
