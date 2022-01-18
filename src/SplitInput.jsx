import { useEffect, useState, useRef, forwardRef } from "react";
import { useImmer } from "use-immer";

const InputCombo = forwardRef(({ index, onValueChange, onKnownChange }, ref) => {
  const [isKnown, setKnown] = useState(false);
  const [val, setVal] = useState('');

  useEffect(() => {
    onValueChange(val, index);
    if (!val || val === " ") {
      setKnown(false);
    }
    // eslint-disable-next-line
  }, [val]);

  useEffect(() => {
    onKnownChange(isKnown, index);
    // eslint-disable-next-line
  }, [isKnown]);

  return (
    <div className="field is-flex is-flex-direction-column mr-3" style={{ width: '64px' }}>
      <div className="field">
        <input className="input is-large" type="text" maxLength={1} onChange={({ target }) => setVal(target.value)} ref={ref} style={{ textTransform: 'uppercase', minHeight: '64px', textAlign: "center" }} />
      </div>
      <div className="field">
        <button className={`button is-fullwidth ${isKnown && 'is-success'}`} onClick={() => setKnown(!isKnown)} disabled={!val}>{isKnown ? '✅' : '❌'}</button>
      </div>
    </div>
  )
});

export const SplitInput = ({ length, onComplete }) => {
  const [letters, setLetters] = useImmer([...new Array(length)].map(() => { return { letter: '', known: false } }));
  const inputRefs = useRef([]);
  const [focusedIdx, setFocusedIdx] = useState(0);

  const onValueChange = (letter, idx) => {
    if (!letter) return;
    setFocusedIdx(idx + 1);
    setLetters(draft => {
      draft[idx].letter = letter;
    });
  }

  const onKnownChange = (isKnown, idx) => {
    setLetters(draft => {
      draft[idx].known = isKnown;
    })
  }

  useEffect(() => {
    if (inputRefs.current.length <= focusedIdx) {
      return setFocusedIdx(0);
    }
    inputRefs?.current?.[focusedIdx]?.focus();
    inputRefs?.current?.[focusedIdx]?.select();
  }, [focusedIdx])

  return (
    <div className="is-flex is-flex-direction-column">
      <div className="is-flex is-flex-direction-row field is-justify-content-center">
        {[...new Array(length)].map((x, idx) => {
          return <InputCombo index={idx} onValueChange={onValueChange} onKnownChange={onKnownChange} key={`InputCombo-${idx}`} ref={el => inputRefs.current[idx] = el} />
        })}
      </div>
      <div className="field is-flex is-justify-content-center">
        <div className="control" onClick={() => onComplete(letters)}>
          <button className="button is-medium is-success">gimme</button>
        </div>
      </div>
    </div>
  )
}