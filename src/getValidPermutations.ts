import { uniq } from "lodash";
import { LetterState } from "./enum";
import { permute } from "./permute";

export function getValidPermutations(guesses: Letter[][]) {
  const validLetters: string[] = [];
  for (const guess of guesses) {
    for (const letter of guess) {
      if (letter.state === LetterState.NOT_IN_WORD) continue;
      if (validLetters.includes(letter.letter)) continue;
      if (!letter.letter) continue;

      validLetters.push(letter.letter);
    }
  }

  const len = validLetters.length;
  if (len < 5) {
    validLetters.length = 5;
    validLetters.fill("_", len, 5);
  }
  let permutations = permute(validLetters.slice(0, 5));

  // Whittle down permutations based on correct positions
  // For each position correct, disqualify items that do not have the correct char in the position
  for (let guessIdx = 0; guessIdx < guesses.length; guessIdx++) {
    const guess = guesses[guessIdx];
    for (let letterIdx = 0; letterIdx < guess.length; letterIdx++) {
      const letter = guess[letterIdx];
      if (letter.state === LetterState.NOT_IN_WORD) continue;

      if (letter.state === LetterState.CORRECT) {
        permutations = permutations.filter(
          (g) => g[letterIdx] === letter.letter
        );
        continue;
      }

      if (letter.state === LetterState.IN_WORD) {
        permutations = permutations.filter(
          (g) => g[letterIdx] !== letter.letter
        );
      }
    }
  }

  const strings = permutations.map((p) => p.join(""));
  return uniq(strings).filter((s) =>
    ILLEGAL_PAIRS.some((ip) => !s.includes(ip))
  );
}

const ILLEGAL_PAIRS = [
  "BQ",
  "BZ",
  "CF",
  "CJ",
  "CV",
  "CX",
  "FQ",
  "FV",
  "FX",
  "FZ",
  "GQ",
  "GV",
  "GX",
  "HX",
  "HZ",
  "JB",
  "JD",
  "JF",
  "JG",
  "JH",
  "JL",
  "JM",
  "JP",
  "JQ",
  "JR",
  "JS",
  "JT",
  "JV",
  "JW",
  "JX",
  "JY",
  "JZ",
  "KQ",
  "KX",
  "KZ",
  "MX",
  "MZ",
  "PQ",
  "PV",
  "PX",
  "QB",
  "QC",
  "QD",
  "QF",
  "QG",
  "QH",
  "QJ",
  "QK",
  "QL",
  "QM",
  "QN",
  "QP",
  "QQ",
  "QV",
  "QW",
  "QX",
  "QY",
  "QZ",
  "SX",
  "TQ",
  "VB",
  "VF",
  "VH",
  "VJ",
  "VK",
  "VM",
  "VP",
  "VQ",
  "VW",
  "VX",
  "WQ",
  "WV",
  "WX",
  "XD",
  "XJ",
  "XK",
  "XR",
  "XZ",
  "YQ",
  "YY",
  "ZF",
  "ZR",
  "ZX",
];
