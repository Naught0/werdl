import { WORDS } from "../data/words";

export function getPossibleWords(word: string, maxMatches = 5) {
  const pattern = new RegExp(
    `${word.replaceAll("_", "[a-z]").replaceAll("\s", "").toLowerCase()}`,
  );
  const matches = [];
  for (const word of WORDS) {
    if (pattern.test(word)) {
      matches.push(word);
      maxMatches -= 1;
      if (maxMatches === 0) {
        break;
      }
    }
  }
  return matches;
}
