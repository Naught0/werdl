import { forwardRef, KeyboardEvent, useMemo } from "react";
import { LetterState } from "./enum";
import { StateBtn } from "./StateBtn";
import { toggleLetterState } from "./toggleLetterState";

interface LetterSlotProps {
  setLetter: (letter: Letter) => void;
  onKeyPress: (e: KeyboardEvent<HTMLDivElement>) => boolean;
  letter: Letter;
}

export const LetterSlot = forwardRef<HTMLDivElement, LetterSlotProps>(
  ({ setLetter, letter, onKeyPress }, ref) => {
    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      const exitEarly = onKeyPress(e);
      if (exitEarly) return;

      if (letter.letter.length >= 1 && !(e.key.length > 1)) {
        setLetter({ ...letter, letter: e.key.toUpperCase() });
        e.preventDefault();
        return;
      }
    }

    function toggle() {
      setLetter({ ...letter, state: toggleLetterState(letter.state) });
    }

    const bgColor = useMemo(() => {
      if (letter.letter.length === 0) return "bg-stone-100";
      switch (letter.state) {
        case LetterState.CORRECT:
          return "bg-green-700";
        case LetterState.NOT_IN_WORD:
          return "bg-stone-800";
        case LetterState.IN_WORD:
          return "bg-yellow-600";
      }
    }, [letter]);

    return (
      <div className="flex flex-col gap-2">
        <div
          className={`flex items-center justify-center text-zinc-300 font-extrabold rounded-none aspect-square w-16 h-16 outline-0 text-3xl caret-transparent ${bgColor} focus:border-solid focus:border-2 focus:border-white focus:shadow-zinc-500 focus:shadow-inner`}
          onKeyDown={(e) => onKeyDown(e)}
          onInput={(e) => {
            setLetter({
              state: letter.state,
              letter: e.currentTarget.textContent?.toUpperCase() || "",
            });
          }}
          ref={ref}
          contentEditable
        >
          {letter.letter}
        </div>
        <StateBtn onClick={toggle} state={letter.state} />
      </div>
    );
  }
);
