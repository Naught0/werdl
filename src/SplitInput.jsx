import { faCheck, faPuzzlePiece, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef, forwardRef } from "react";
import { useImmer } from "use-immer";

export const STATE = {
  CORRECT: 1,
  UNKNOWN: 0,
  INCORRECT: 2
}

const InputCombo = forwardRef(({ index, onValueChange, onKnownChange, letterState, setLetterState, onBackspace, setFocus }, ref) => {
  const [val, setVal] = useState('');
  const toggleState = () => {
    setLetterState(letterState + 1 > 2 ? 0 : letterState + 1);
  }

  useEffect(() => {
    onValueChange(val, index);
    if (!val || val === " ") {
      setLetterState(STATE.UNKNOWN);
    }
    // eslint-disable-next-line
  }, [val]);

  useEffect(() => {
    onKnownChange(letterState, index);
    // eslint-disable-next-line
  }, [letterState]);

  const keyDown = ({ code }) => {
    if (code === 'Backspace') {
      onBackspace();
    }
  }

  return (
    <div className="field is-flex is-flex-direction-column mr-3" style={{ width: '64px' }}>
      <div className="field">
        <input tabIndex={index + 1} className="input is-large" type="text" maxLength={1} onKeyDown={keyDown} onFocus={() => setFocus(index)} onChange={({ target }) => setVal(target.value)} ref={ref} style={{ textTransform: 'uppercase', minHeight: '64px', textAlign: "center" }} />
      </div>
      <div className="field">
        <button className={`button has-text-weight-bold is-fullwidth ${letterState === STATE.CORRECT && 'is-success'} ${letterState === STATE.INCORRECT && 'is-warning'}`} onClick={toggleState} disabled={!val}>
          <span className="icon"><FontAwesomeIcon icon={letterState === STATE.CORRECT ? faCheck : letterState === STATE.INCORRECT ? faTimes : faQuestion} /></span>
        </button>
      </div>
    </div>
  )
});

export const SplitInput = ({ length, onComplete, onCleared }) => {
  const [letters, setLetters] = useImmer([...new Array(length)].map(() => { return { letter: ' ', state: STATE.UNKNOWN } }));
  const inputRefs = useRef([]);
  const [focusedIdx, setFocusedIdx] = useState(0);

  const onValueChange = (letter, idx) => {
    if (!letter) {
      setLetters(draft => {
        draft[idx].letter = " ";
      });
      return;
    }
    setFocusedIdx(idx + 1);
    setLetters(draft => {
      draft[idx].letter = letter;
    });
  }

  const onKnownChange = (letterState, idx) => {
    setLetters(draft => {
      draft[idx].state = letterState;
    })
  }

  const onBackspace = () => {
    setFocusedIdx(focusedIdx - 1 >= 0 ? focusedIdx - 1 : 0);
  }

  useEffect(() => {
    if (inputRefs.current.length <= focusedIdx) {
      return setFocusedIdx(5);
    }
    inputRefs?.current?.[focusedIdx]?.focus();
    inputRefs?.current?.[focusedIdx]?.select();
  }, [focusedIdx])

  const onClear = () => {
    inputRefs.current[0].focus();
    inputRefs.current.forEach(ref => {
      ref.value = "";
    });
    setLetters(draft => {
      for (let i = 0; i < draft.length; i++) {
        draft[i].state = STATE.UNKNOWN;
      }
    });
    onCleared();
  }

  return (
    <div className="is-flex is-flex-direction-column">
      <div className="is-flex is-flex-direction-row field is-justify-content-center">
        {[...new Array(length)].map((x, idx) => {
          return <InputCombo setFocus={setFocusedIdx} index={idx} setLetterState={s => onKnownChange(s, idx)} onBackspace={onBackspace} letterState={letters[idx].state} onValueChange={onValueChange} onKnownChange={onKnownChange} key={`InputCombo-${idx}`} ref={el => inputRefs.current[idx] = el} />
        })}
      </div>
      <div className="field is-flex is-justify-content-center">
        <div className="control buttons are-grouped are-medium">
          <button className="button is-success" onClick={() => onComplete(letters)}>
            <span className="icon"><FontAwesomeIcon icon={faPuzzlePiece} /></span>
            <span>get combos</span>
          </button>
          <button className="button is-dark" onClick={onClear}>
            <span className="icon"><FontAwesomeIcon icon={faTimes} /></span>
            <span>clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}