import { getPossibleWords } from "./util";

self.onmessage = (e: MessageEvent<{ permutations: string[] }>) => {
  const { permutations } = e.data;
  const words = permutations.flatMap((p) => getPossibleWords(p, 5));
  words.sort((a, b) => a.localeCompare(b));
  self.postMessage({ words });
};
