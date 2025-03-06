export function humanReadableFileSize(size: number): string {
  if (size < 1024) {
    return `${String(size)} Bytes`;
  }
  if (size < 1024 * 1024) {
    return `${String(Math.round(size / 1024))} KB`;
  }
  return `${String(Math.round(size / 1024 / 1024))} MB`;
}
