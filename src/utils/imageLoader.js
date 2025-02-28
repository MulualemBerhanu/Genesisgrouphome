export default function imageLoader({ src }) {
  // Remove leading slash if present
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  
  // For production with custom domain, we don't need any prefix
  return `/${cleanSrc}`;
} 