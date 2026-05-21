import { WORDS } from "../data/words";

export interface RowLetter {
  letter: string;
  state: number;
}

interface Constraints {
  excluded: Set<string>;
  mustContain: Map<string, number[]>;
  correct: Map<number, string>;
}

export function buildConstraints(rows: RowLetter[][]): Constraints {
  const excluded = new Set<string>();
  const mustContain = new Map<string, number[]>();
  const correct = new Map<number, string>();

  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      const { letter, state } = row[i];
      if (!letter) continue;
      const lower = letter.toLowerCase();

      if (state === 1) {
        excluded.add(lower);
      } else if (state === 2) {
        correct.set(i, lower);
        if (!mustContain.has(lower)) mustContain.set(lower, []);
      } else if (state === 0) {
        const existing = mustContain.get(lower) ?? [];
        existing.push(i);
        mustContain.set(lower, existing);
      }
    }
  }

  return { excluded, mustContain, correct };
}

function wordMatches(word: string, c: Constraints): boolean {
  const w = word.toLowerCase();

  for (const ch of c.excluded) {
    if (w.includes(ch)) return false;
  }

  for (const [pos, ch] of c.correct) {
    if (w[pos] !== ch) return false;
  }

  for (const [ch, badPositions] of c.mustContain) {
    if (!w.includes(ch)) return false;
    for (const pos of badPositions) {
      if (w[pos] === ch) return false;
    }
  }

  return true;
}

export function findWords(rows: RowLetter[][], maxMatches: number): string[] {
  const constraints = buildConstraints(rows);
  const results: string[] = [];

  for (const word of WORDS) {
    if (results.length >= maxMatches) break;
    if (wordMatches(word, constraints)) {
      results.push(word);
    }
  }

  return results.sort((a, b) => a.localeCompare(b));
}
