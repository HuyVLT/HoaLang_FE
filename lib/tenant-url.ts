export function getTenantUrl(slug: string, path = ''): string {
  const subdomain = slug.replace(/-/g, '');
  
  // Clean path format: ensure leading slash if path is provided and doesn't start with /
  let formattedPath = path;
  if (path && !path.startsWith('/')) {
    formattedPath = `/${path}`;
  }

  // Development environment (local dev)
  if (process.env.NODE_ENV === 'development') {
    return `http://${subdomain}.localhost:3000${formattedPath}`;
  }
  
  // Production environment
  return `https://${subdomain}.hoalang.site${formattedPath}`;
}
