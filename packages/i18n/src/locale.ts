export const supportedLocales = ['fr', 'en', 'de'] as const;
export type Locale = (typeof supportedLocales)[number];

export function negotiateLocale(acceptLanguage: string | undefined): Locale {
  if (!acceptLanguage) return 'en';

  const candidates = acceptLanguage
    .split(',')
    .map((entry, index) => {
      const [rawTag, ...parameters] = entry.trim().split(';');
      const qParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const quality = qParameter ? Number(qParameter.trim().slice(2)) : 1;
      const tag = rawTag?.trim().toLowerCase() ?? '';
      return {
        tag,
        quality: Number.isFinite(quality) && quality > 0 && quality <= 1 ? quality : 0,
        index,
      };
    })
    .filter((candidate) => candidate.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const candidate of candidates) {
    const primary = candidate.tag.split('-')[0];
    if (supportedLocales.includes(primary as Locale)) return primary as Locale;
  }
  return 'en';
}
