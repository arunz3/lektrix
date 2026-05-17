/**
 * Parses a string of page ranges (e.g., "1, 3-5") into an array of 0-indexed page numbers.
 * @param {string} input - Comma-separated page numbers or ranges.
 * @param {number} maxPages - Maximum number of pages available in the document.
 * @returns {number[]} Array of sorted, unique 0-indexed page numbers.
 */
export const parsePageRanges = (input, maxPages) => {
  if (!input || typeof input !== 'string' || !input.trim()) return [];
  const parts = input.split(',').map(p => p.trim());
  const pages = new Set();
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n, 10));
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const actualStart = Math.max(1, start);
        const actualEnd = Math.min(end, maxPages);
        for (let i = actualStart; i <= actualEnd; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page > 0 && page <= maxPages) {
        pages.add(page - 1);
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
};

/**
 * Formats byte size into human-readable strings (KB, MB, GB, etc.).
 * @param {number} bytes - Size in bytes.
 * @returns {string} Human-readable formatted size string.
 */
export const formatSize = (bytes) => {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const absBytes = Math.abs(bytes);

  const i = Math.min(
    Math.floor(Math.log(absBytes) / Math.log(k)),
    sizes.length - 1
  );

  const value = bytes / Math.pow(k, i);
  return parseFloat(value.toFixed(2)) + ' ' + sizes[i];
};

/**
 * Converts a hex color string to an RGB object with 0-1 ratio values.
 * @param {string} hex - Hex color string (e.g., "#FF0000").
 * @returns {{ r: number, g: number, b: number }} RGB values as ratios (0-1).
 */
export const hexToRgbValues = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};
