import { getPossibleWords } from "./util";

self.onmessage = (
  e: MessageEvent<{ permutations: string[]; maxMatches?: number }>,
) => {
  const { permutations, maxMatches = 5 } = e.data;
  const words = permutations.flatMap((p) => getPossibleWords(p, maxMatches));
  words.sort((a, b) => a.localeCompare(b));
  self.postMessage({ words });
};
