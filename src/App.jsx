import { SplitInput } from "./SplitInput";
import axios from 'axios';
import { useState } from "react";
import "lodash.permutations";
import { permutations, chunk, zip } from "lodash";


export const App = () => {
  const [resp, setResp] = useState([]);

  const onComplete = (data) => {
    let perms = permutations(data.map(e => e.letter), data.length);
    if (data.some(e => e.known)) {
      perms = perms.filter(perm => zip(perm, data).every(combo => !(combo[0] !== combo[1].letter && combo[1].known)));
    }
    setResp(perms);
    // (async () => {
    //   const opts = (await axios.post('/dothething', data)).data;
    //   setResp(opts);
    // })();
  }

  return (
    <section className="hero is-fullheight is-black is-bold">
      <div className="hero-body is-flex is-flex-direction-column">
        <h1 className="title">watcha got so far?</h1>
        <SplitInput length={5} onComplete={d => onComplete(d)} />
        <section className="container mt-6">
          <div className="columns is-multiline is-flex is-justify-content-flex-start">
            {chunk(resp, 10).map((c, idx) => {
              return <div className="column is-flex is-flex-grow-0" style={{ minWidth: '7rem' }}>
                <div className="content is-size-5">
                  {c.map((e, idx) => {
                    return <p key={`option-${idx}`}>{e.map(letter => letter.toUpperCase().replace(' ', '_')).join(' ')}</p>
                  })}
                </div>
              </div>
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
