export function getImagePath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/Genesisgrouphome' : '';
  // Encode spaces in the path
  const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${basePath}${encodedPath}`;
} 