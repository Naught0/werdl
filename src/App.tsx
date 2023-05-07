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

const INITIAL_ROW_STATE = [
  [...Array(5).keys()].map(() => ({
    state: LetterState.IN_WORD,
    letter: "",
  })),
];

const App = () => {
  const [resp, setResp] = useState<string[]>([]);
  const [rows, setRows] = useImmer<Letter[][]>(INITIAL_ROW_STATE);
  const letterRefs = useRef<HTMLDivElement[][]>([[], [], [], [], [], []]);

  const onComplete = () => {
    setResp(getValidPermutations(rows).sort());
  };

  function setLetter(rowIndex: number, letterIndex: number, l: Letter) {
    setRows((draft) => {
      draft[rowIndex][letterIndex] = l;
    });

    letterRefs.current[rowIndex][letterIndex + 1]?.focus();
  }
  function removeRow(rowIdx: number) {
    if (rowIdx !== 0) {
      setRows((draft) => {
        draft.splice(rowIdx, 1);
      });
    }
  }
  function onKeyPress(
    e: KeyboardEvent<HTMLDivElement>,
    rowIdx: number,
    letterIdx: number
  ) {
    // Return true if we should skip attempting to replace the current character with the pressed key
    // This is useful in avoiding trying to set the maxlen=1 input to something like "RightArrow",
    // or otherwise intercepting the keystroke, as in the case of spacebar
    if (e.key === "Backspace") {
      if (letterIdx === 0) removeRow(rowIdx);
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
          draft[rowIdx][letterIdx].state
        );
      });
      return true;
    }

    return false;
  }

  function addRow() {
    if (rows.length === 6) return;

    setRows((draft) => {
      draft.push(
        [...Array(5).keys()].map(() => ({
          state: LetterState.IN_WORD,
          letter: "",
        }))
      );
    });
  }

  function clear() {
    setRows(() => {
      return INITIAL_ROW_STATE;
    });
    letterRefs.current[0][0].focus();
    setResp([]);
  }

  useLayoutEffect(function focusFirstLetterSlotOnPageLoad() {
    letterRefs.current[0][0].focus();
  }, []);
  useEffect(
    function focusFirstLetterSlot() {
      letterRefs.current[rows.length - 1][0].focus();
    },
    [rows.length]
  );

  return (
    <div className="flex flex-col">
      <div className="bg-dark min-h-screen h-max overflow-clip pt-12">
        <div className="flex items-center justify-center flex-col gap-4">
          {[...Array(rows.length).keys()].map((rowIndex) => (
            <div
              className="flex items-center justify-center flex-row flex-wrap gap-2"
              key={`row${rowIndex}`}
            >
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
              <div className="flex flex-col gap-2">
                <button
                  className="cursor-pointer text-zinc-300 w-8 h-8 bg-zinc-700"
                  onClick={() => addRow()}
                >
                  +
                </button>
                {rowIndex !== 0 && (
                  <button
                    className="cursor-pointer text-zinc-300 w-8 h-8 bg-zinc-700"
                    onClick={() => removeRow(rowIndex)}
                  >
                    -
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-green-700 px-4 py-2 text-zinc-300 text-lg"
              onClick={onComplete}
            >
              ✨ visualize success
            </button>
            <button
              className="min-w-28 bg-red-700 px-4 py-2 text-zinc-300 text-lg"
              onClick={clear}
            >
              💣 clear
            </button>
          </div>
        </div>
        <div className="hidden lg:flex justify-center m-2">
          <Tips />
        </div>

        {resp.length > 0 && <hr className="border-stone-700 my-6" />}
        <div className="flex gap-4 flex-wrap justify-evenly px-6 pb-6">
          {resp &&
            chunk(resp, 5).map((chunk) => (
              <div className="flex flex-col gap-5">
                {chunk.map((possibility) => (
                  <p className="text-zinc-300 text-2xl tracking-widest">
                    {possibility.split("").join(" ")}
                  </p>
                ))}
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
