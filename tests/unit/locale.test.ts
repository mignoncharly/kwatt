import { describe, expect, it } from 'vitest';
import { negotiateLocale } from '../../packages/i18n/src/locale.js';

describe('negotiateLocale', () => {
  it('uses the best supported language and handles regional tags', () => {
    expect(negotiateLocale('fr-CA, en;q=0.8')).toBe('fr');
    expect(negotiateLocale('es-ES;q=0.9, de-DE;q=0.8')).toBe('de');
  });

  it('ignores invalid quality values and falls back to English', () => {
    expect(negotiateLocale('fr;q=1.5, de;q=0, es;q=not-a-number')).toBe('en');
    expect(negotiateLocale(undefined)).toBe('en');
  });
});
