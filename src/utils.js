/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - Hex color string (e.g., "#FF0000")
 * @returns {Object} RGB values as ratios (0-1)
 */
export const hexToRgbValues = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};
