import { SplitInput, STATE } from "./SplitInput";
import { useState } from "react";
import "lodash.permutations";
import { permutations, chunk, zip, uniqBy } from "lodash";
import logo from './favicon.svg';
import { Footer } from "./Footer";

const ILLEGAL_PAIRS = "bq bz cf cj cv cx fq fv fx fz gq gv gx hx hz jb jd jf jg jh jl jm jp jq jr js jt jv jw jx jy jz kq kx kz mx mz pq pv px qb qc qd qf qg qh qj qk ql qm qn qp qq qv qw qx qy qz sx tq vb vf vh vj vk vm vp vq vw vx wq wv wx xd xj xk xr xz yq yy zf zr zx".split(" ");

export const App = () => {
  const [resp, setResp] = useState([]);

  const onComplete = (data) => {
    let perms = permutations(data.map(e => e.letter), data.length);
    // Filter for only correct inputs
    perms = perms.filter(perm => zip(perm, data).every(combo => !(combo[0] !== combo[1].letter && combo[1].state === STATE.CORRECT)));

    // Filter out incorrect inputs
    perms = perms.filter(perm => zip(perm, data).every(combo => !(combo[0] === combo[1].letter && combo[1].state === STATE.INCORRECT)));

    // Filter out any words with illegal character pairs in them
    perms = perms.filter(perm => !ILLEGAL_PAIRS.some(pair => perm.join('').toLowerCase().includes(pair)));

    setResp(uniqBy(perms, e => e.join('')));
  }

  return (
    <>
      <nav className="navbar is-spaced is-black">
        <div className="navbar-brand">
          <div className="navbar-item">
            <img src={logo} alt="" />
          </div>
          <span className="navbar-item">
            <span className="is-size-4">werdl</span>
          </span>
        </div>
        <div className="navbar-menu">
          <div className="navbar-item">
            <span className="has-text-grey-light">solve wordles at ludicrous speed</span>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight-with-navbar is-black">
        <div className="hero-body is-flex is-flex-direction-column">
          <SplitInput length={5} onComplete={d => onComplete(d)} />
          <section className="container mt-6">
            <div className="columns is-multiline is-flex is-justify-content-flex-start">
              {chunk(resp, 10).map((c, idx) => {
                return <div key={`result-col-${idx}`} className="column is-flex is-flex-grow-0 is-justify-content-center" style={{ minWidth: '9rem' }}>
                  <div className="content is-size-5">
                    {c.map((e, idx) => {
                      return <p key={`option-${idx}`}>{e.map(letter => {
                        if (!letter || (letter === "")) {
                          return "_"
                        }
                        return letter.toUpperCase().replace(' ', '_');
                      }).join(' ')}</p>
                    })}
                  </div>
                </div>
              })}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}
