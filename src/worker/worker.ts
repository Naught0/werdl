import { findWords, type RowLetter } from "./util";

self.onmessage = (
  e: MessageEvent<{ rows: RowLetter[][]; maxMatches?: number }>,
) => {
  const { rows, maxMatches = 10 } = e.data;
  const words = findWords(rows, maxMatches);
  self.postMessage({ words });
};
