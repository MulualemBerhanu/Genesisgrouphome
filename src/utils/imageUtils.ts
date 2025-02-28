export function getImagePath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For production with custom domain, we don't need the repository name in the path
  const basePath = '/';
  
  // Encode spaces and special characters in the path
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  
  return `${basePath}${encodedPath}`;
} 