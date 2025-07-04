// utils/image.ts
export function getImageUrl(record: any, filename: string, size?: string): string {
  const pb = usePocketBase()
  const baseUrl = `${pb.baseUrl}/api/files/${record.collectionName}/${record.id}/${filename}`
  return size ? `${baseUrl}?thumb=${size}` : baseUrl
}