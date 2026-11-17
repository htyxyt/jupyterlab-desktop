import { describe, expect, it } from 'vitest';
import {
  findRegressions,
  parseTranslations
} from '../../scripts/check-translation-retention.cjs';

describe('upstream Chinese translation retention', () => {
  it('permits new translations while preserving existing entries', () => {
    const before = parseTranslations(`const messages = { 'one': '中文' };`);
    const after = parseTranslations(
      `const messages = { 'one': '中文', 'two': '新增' };`
    );
    expect(findRegressions(before, after)).toEqual([]);
  });
  it('flags missing or changed translations', () => {
    const before = parseTranslations(
      `const messages = { 'one': '原文', 'two': '中文' };`
    );
    const after = parseTranslations(`const messages = { 'one': '改动' };`);
    expect(findRegressions(before, after)).toEqual([
      'Changed: one',
      'Missing: two'
    ]);
  });
  it('rejects nonstatic and duplicate entries instead of silently skipping them', () => {
    expect(() => parseTranslations(`const messages = { ...other };`)).toThrow();
    expect(() =>
      parseTranslations(`const messages = { one: '一', one: '二' };`)
    ).toThrow();
  });
});
