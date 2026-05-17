import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSize, parsePageRanges } from './utils.js';

test('formatSize utility', async (t) => {
  await t.test('formats bytes correctly', () => {
    assert.strictEqual(formatSize(0), '0 Bytes');
    assert.strictEqual(formatSize(100), '100 Bytes');
    assert.strictEqual(formatSize(1023), '1023 Bytes');
  });

  await t.test('formats KB correctly', () => {
    assert.strictEqual(formatSize(1024), '1 KB');
    assert.strictEqual(formatSize(1536), '1.5 KB');
    assert.strictEqual(formatSize(1024 * 1024 - 1), '1024 KB');
  });

  await t.test('formats MB correctly', () => {
    assert.strictEqual(formatSize(1024 * 1024), '1 MB');
    assert.strictEqual(formatSize(1024 * 1024 * 2.5), '2.5 MB');
  });

  await t.test('formats GB correctly', () => {
    assert.strictEqual(formatSize(1024 * 1024 * 1024), '1 GB');
    assert.strictEqual(formatSize(1024 * 1024 * 1024 * 1.25), '1.25 GB');
  });

  await t.test('handles values beyond GB (TB, PB)', () => {
    assert.strictEqual(formatSize(1024 * 1024 * 1024 * 1024), '1 TB');
    assert.strictEqual(formatSize(1024 * 1024 * 1024 * 1024 * 1024), '1 PB');
  });

  await t.test('handles negative values correctly', () => {
    assert.strictEqual(formatSize(-1024), '-1 KB');
    assert.strictEqual(formatSize(-1536), '-1.5 KB');
  });

  await t.test('handles non-numeric values gracefully', () => {
    // @ts-ignore
    assert.strictEqual(formatSize(null), '0 Bytes');
    // @ts-ignore
    assert.strictEqual(formatSize(undefined), '0 Bytes');
    // @ts-ignore
    assert.strictEqual(formatSize('abc'), '0 Bytes');
    assert.strictEqual(formatSize(NaN), '0 Bytes');
  });
});

test('parsePageRanges utility', async (t) => {
  const maxPages = 10;

  await t.test('parses simple comma-separated list', () => {
    assert.deepStrictEqual(parsePageRanges('1, 2, 3', maxPages), [0, 1, 2]);
  });

  await t.test('parses ranges', () => {
    assert.deepStrictEqual(parsePageRanges('1-3, 5', maxPages), [0, 1, 2, 4]);
  });

  await t.test('handles overlapping ranges and sorts them', () => {
    assert.deepStrictEqual(parsePageRanges('5, 1-3, 2-4', maxPages), [0, 1, 2, 3, 4]);
  });

  await t.test('clamps to maxPages', () => {
    assert.deepStrictEqual(parsePageRanges('1, 9-20', maxPages), [0, 8, 9]);
  });

  await t.test('handles invalid ranges', () => {
    assert.deepStrictEqual(parsePageRanges('5-3', maxPages), []);
    assert.deepStrictEqual(parsePageRanges('0-3', maxPages), [0, 1, 2]);
  });

  await t.test('handles whitespace and empty input', () => {
    assert.deepStrictEqual(parsePageRanges('  1,   4 - 5  ', maxPages), [0, 3, 4]);
    assert.deepStrictEqual(parsePageRanges('', maxPages), []);
    assert.deepStrictEqual(parsePageRanges('   ', maxPages), []);
    // @ts-ignore
    assert.deepStrictEqual(parsePageRanges(null, maxPages), []);
  });

  await t.test('handles non-numeric garbage', () => {
    assert.deepStrictEqual(parsePageRanges('abc, def-ghi, 1', maxPages), [0]);
  });
});
