/**
 * Converts a relative image path into an absolute URL using the backend origin.
 * Handles absolute URLs, base64/blob URLs, and relative paths correctly.
 * 
 * @param {string} url - The image URL or path.
 * @returns {string|null} - The absolute URL or the original string if absolute.
 */
export const toAbsoluteImageUrl = (url) => {
    if (!url) return null;

    // 1. If it's already an absolute URL (http/https), a data URL, or a blob URL, return it as is.
    if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // 2. Get the backend origin from environment variables.
    // Fallback to localhost:8080 for development if VITE_BACKEND_ORIGIN is not set.
    const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:8080').replace(/\/$/, '');

    // 3. Ensure the relative path starts with a single slash.
    const path = url.startsWith('/') ? url : `/${url}`;

    // 4. Combine origin and path.
    return `${BACKEND_ORIGIN}${path}`;
};
