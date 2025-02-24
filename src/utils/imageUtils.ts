export function getImagePath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const basePath = process.env.NODE_ENV === 'production' ? '/Genesisgrouphome/' : '/';
  
  // Encode spaces and special characters in the path
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  return `${basePath}${encodedPath}`;
} 