import React, { FC, useMemo } from "react";
import { LetterState } from "./enum";

interface StateBtnProps {
  onClick: () => void;
  state: LetterState;
}
export const StateBtn: FC<StateBtnProps> = ({ state, onClick }) => {
  const text = useMemo(
    function () {
      switch (state) {
        case LetterState.IN_WORD:
          return "❔";
        case LetterState.CORRECT:
          return "✅";
        case LetterState.NOT_IN_WORD:
          return "❌";
      }
    },
    [state]
  );
  return (
    <button
      className="w-100 bg-stone-700 select-none"
      tabIndex={-1}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
