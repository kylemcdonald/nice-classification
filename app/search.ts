import type { ClassMeta } from "./class-meta";

export type SearchableNiceClass = {
  number: number;
  heading: string;
  note: string;
  includes: string[];
};

const stopWords = new Set(["a", "an", "and", "class", "for", "in", "of", "the", "to"]);

function hasToken(text: string, token: string) {
  if (text.includes(token)) return true;
  return token.length >= 5 && text.includes(token.slice(0, 5));
}

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function scoreNiceClass(
  entry: SearchableNiceClass,
  meta: ClassMeta,
  query: string,
) {
  const normalizedQuery = normalizeSearchText(query).trim();
  if (!normalizedQuery) return 0;

  const classQuery = normalizedQuery.match(/^(?:class\s*)?0?(\d{1,2})$/);
  if (classQuery) {
    return Number(classQuery[1]) === entry.number ? 1000 : 0;
  }

  const tokens = (normalizedQuery.match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (token) => !stopWords.has(token),
  );
  if (!tokens.length) return 0;

  const shortName = normalizeSearchText(meta.shortName);
  const heading = normalizeSearchText(entry.heading);
  const note = normalizeSearchText(entry.note);
  const examples = entry.includes.map(normalizeSearchText);
  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;
    if (shortName === token) tokenScore += 22;
    else if (shortName.startsWith(token)) tokenScore += 16;
    else if (hasToken(shortName, token)) tokenScore += 11;
    if (hasToken(heading, token)) tokenScore += 7;
    if (hasToken(note, token)) tokenScore += 3;
    tokenScore += Math.min(
      9,
      examples.reduce((total, example) => total + (hasToken(example, token) ? 3 : 0), 0),
    );
    if (!tokenScore) return 0;
    score += tokenScore;
  }

  if (shortName.includes(normalizedQuery)) score += 24;
  if (heading.includes(normalizedQuery)) score += 14;
  if (note.includes(normalizedQuery)) score += 6;
  if (examples.some((example) => example.includes(normalizedQuery))) score += 12;
  return score;
}
