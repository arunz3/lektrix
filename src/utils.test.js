// Unit tests for hexToRgbValues
// This script imports the actual implementation from src/utils.js

import { hexToRgbValues } from './utils.js';

const assert = (condition, message) => {
  if (!condition) {
    console.error('FAILED: ' + message);
    process.exit(1);
  }
  console.log('PASSED: ' + message);
};

console.log('Running unit tests for hexToRgbValues from src/utils.js...');

const testHexToRgbValues = () => {
  const cases = [
    { hex: '#000000', expected: { r: 0, g: 0, b: 0 } },
    { hex: '#FFFFFF', expected: { r: 1, g: 1, b: 1 } },
    { hex: '#FF0000', expected: { r: 1, g: 0, b: 0 } },
    { hex: '#00FF00', expected: { r: 0, g: 1, b: 0 } },
    { hex: '#0000FF', expected: { r: 0, g: 0, b: 1 } },
    { hex: '#336699', expected: { r: 51/255, g: 102/255, b: 153/255 } },
  ];

  cases.forEach(({ hex, expected }) => {
    const result = hexToRgbValues(hex);
    assert(
      Math.abs(result.r - expected.r) < 0.0001 &&
      Math.abs(result.g - expected.g) < 0.0001 &&
      Math.abs(result.b - expected.b) < 0.0001,
      `hexToRgbValues("${hex}") correctly calculates RGB values`
    );
  });
};

try {
  testHexToRgbValues();
  console.log('\nAll unit tests passed successfully!');
} catch (error) {
  console.error('\nTest execution failed:', error);
  process.exit(1);
}
