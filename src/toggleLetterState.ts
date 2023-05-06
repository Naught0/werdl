import { LetterState } from "./enum";

export function toggleLetterState(state: LetterState): LetterState {
  switch (state) {
    case LetterState.IN_WORD:
      return LetterState.CORRECT;
    case LetterState.CORRECT:
      return LetterState.NOT_IN_WORD;
    case LetterState.NOT_IN_WORD:
      return LetterState.IN_WORD;
  }
}
