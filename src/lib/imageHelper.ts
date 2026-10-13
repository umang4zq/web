/**
 * Unified image URL resolver for local assets and Firebase Cloud Storage URLs.
 */
export function getImageUrl(
  path?: string | null,
  fallback = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return path;
  }
  return `/static/uploads/products/${path}`;
}
