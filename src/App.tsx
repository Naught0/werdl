import {
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useImmer } from "use-immer";
import { LetterState } from "./enum";
import { LetterSlot } from "./LetterSlot";
import { Tips } from "./Tips";
import { toggleLetterState } from "./toggleLetterState";
import { chunk } from "lodash";
import { getValidPermutations } from "./getValidPermutations";
import { Footer } from "./Footer";
import { getPossibleWords } from "./worker/util";
import { Collapsible } from "./Collapsible";

const MAX_ROWS = 5;

const INITIAL_ROW_STATE = [
  [...Array(5).keys()].map(() => ({
    state: LetterState.IN_WORD,
    letter: "",
  })),
];
const smartColumnsClassName = "columns-2 sm:columns-3 md:columns-4";

const App = () => {
  const [resp, setResp] = useState<string[]>([]);
  const [possibleWords, setPossibleWords] = useState<Set<string>>(new Set());
  const [rows, setRows] = useImmer<Letter[][]>(INITIAL_ROW_STATE);
  const letterRefs = useRef<HTMLDivElement[][]>([[], [], [], [], [], []]);

  const onComplete = () => {
    const permutations = getValidPermutations(rows).sort();
    setResp(permutations);
    if (permutations.length > 0) {
      const words = permutations.flatMap((p) => getPossibleWords(p, 5));
      words.sort((a, b) => a.localeCompare(b));

      setPossibleWords(new Set(words));
    }
  };

  function setLetter(rowIndex: number, letterIndex: number, l: Letter) {
    setRows((draft) => {
      draft[rowIndex][letterIndex] = l;
    });

    letterRefs.current[rowIndex][letterIndex + 1]?.focus();
  }
  function removeRow(rowIdx: number) {
    setRows((draft) => {
      draft.splice(rowIdx, 1);
    });
  }
  function onKeyPress(
    e: KeyboardEvent<HTMLDivElement>,
    rowIdx: number,
    letterIdx: number,
  ) {
    // Return true if we should skip attempting to replace the current character with the pressed key
    // This is useful in avoiding trying to set the maxlen=1 input to something like "RightArrow",
    // or otherwise intercepting the keystroke, as in the case of spacebar
    if (e.key === "Backspace") {
      if (letterIdx === 0 && rowIdx !== 0) removeRow(rowIdx);
      e.preventDefault();

      if (!letterRefs.current[rowIdx][letterIdx - 1]) return false;

      letterRefs.current[rowIdx][letterIdx - 1]?.focus();

      setRows((draft) => {
        draft[rowIdx][letterIdx].letter = "";
        if (letterIdx === 1) draft[rowIdx][letterIdx - 1].letter = "";
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (rowIdx === 0) return false;

      letterRefs.current[rowIdx - 1][letterIdx].focus();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (rowIdx === rows.length - 1) return false;

      letterRefs.current[rowIdx + 1][letterIdx].focus();
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (letterIdx === 0) {
        if (rowIdx !== 0) {
          letterRefs.current[rowIdx - 1][4]?.focus();
        }
      } else {
        letterRefs.current[rowIdx][letterIdx - 1]?.focus();
      }
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (letterIdx === 4) {
        if (rowIdx !== rows.length - 1) {
          letterRefs.current[rowIdx + 1][0]?.focus();
        }
      } else {
        letterRefs.current[rowIdx][letterIdx + 1]?.focus();
      }
    }

    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
      addRow();
    }

    if (e.key === " ") {
      e.preventDefault();
      setRows((draft) => {
        draft[rowIdx][letterIdx].state = toggleLetterState(
          draft[rowIdx][letterIdx].state,
        );
      });
      return true;
    }

    return false;
  }

  function addRow() {
    if (rows.length === MAX_ROWS) return;

    setRows((draft) => {
      draft.push(
        [...Array(5).keys()].map(() => ({
          state: LetterState.IN_WORD,
          letter: "",
        })),
      );
    });
  }

  function clear() {
    setRows(() => {
      return INITIAL_ROW_STATE;
    });
    letterRefs.current[0][0].focus();
    setResp([]);
    setPossibleWords(new Set());
  }

  useLayoutEffect(function focusFirstLetterSlotOnPageLoad() {
    letterRefs.current[0][0].focus();
  }, []);
  useEffect(
    function focusFirstLetterSlot() {
      letterRefs.current[rows.length - 1][0].focus();
    },
    [rows.length],
  );

  return (
    <div className="flex flex-col text-stone-200">
      <div className="bg-dark min-h-screen h-max overflow-clip pt-12 pb-36">
        <div className="flex items-center justify-center flex-col gap-2">
          {[...Array(rows.length).keys()].map((rowIndex) => (
            <div
              className="flex flex-wrap gap-2 items-center justify-center"
              key={`row${rowIndex}`}
            >
              <div className="flex items-center justify-center flex-row gap-2">
                {[...Array(5).keys()].map((letterIndex) => (
                  <LetterSlot
                    onKeyPress={(e) => onKeyPress(e, rowIndex, letterIndex)}
                    setLetter={(l) => setLetter(rowIndex, letterIndex, l)}
                    letter={rows[rowIndex][letterIndex]}
                    key={`letter${rowIndex}${letterIndex}`}
                    ref={(r) => {
                      letterRefs.current[rowIndex][letterIndex] = r!;
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-row sm:flex-col gap-2 justify-center items-center w-full sm:w-fit">
                {(rowIndex !== 0 || rows.length > 1) && (
                  <button
                    className="cursor-pointer text-stone-300 w-8 h-8 bg-stone-700 select-none"
                    onClick={() => removeRow(rowIndex)}
                  >
                    -
                  </button>
                )}
                {rowIndex === rows.length - 1 && rowIndex < MAX_ROWS - 1 && (
                  <button
                    className="cursor-pointer text-stone-300 w-8 h-8 bg-stone-700 select-none"
                    onClick={() => addRow()}
                  >
                    +
                  </button>
                )}
                <div className="w-8 h-0 hidden sm:flex" />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              className="bg-green-700 px-4 py-2 text-stone-300 text-lg"
              onClick={onComplete}
            >
              ✨ visualize success
            </button>
            <button
              className="min-w-28 bg-red-700 px-4 py-2 text-stone-300 text-lg"
              onClick={clear}
            >
              💣 clear
            </button>
          </div>
        </div>
        <div className="hidden sm:flex justify-center m-2">
          <Tips />
        </div>

        {resp.length > 0 && <hr className="border-stone-700 my-6" />}
        <div className="flex flex-col gap-5 sm:max-w-screen-sm m-auto">
          <div
            className={`flex flex-row gap-3 justify-center flex-wrap m-auto px-6`}
          >
            {resp &&
              resp.map((possibility, idx) => (
                <div key={idx} className={`flex-col flex gap-3`}>
                  <p
                    key={possibility}
                    className="text-stone-300 size-fit text-2xl tracking-widest bg-stone-700 px-2 py-1 whitespace-nowrap"
                  >
                    {possibility.split("").join(" ")}
                  </p>
                </div>
              ))}
          </div>
          {possibleWords.size > 0 && (
            <div className="m-auto w-full">
              <Collapsible title={`possible words (${possibleWords.size})`}>
                <ul
                  className={`list-disc list-inside ml-3 text-lg ${smartColumnsClassName}`}
                >
                  {Array.from(possibleWords).map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </Collapsible>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
