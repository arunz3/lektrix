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
