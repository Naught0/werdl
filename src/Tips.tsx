import { ReactNode } from "react";

const Key = ({ children }: { children: ReactNode }) => {
  return (
    <code className="bg-zinc-700 text-rose-200 py-0.5 px-1 font-mono">
      {children}
    </code>
  );
};
export const Tips = () => {
  return (
    <div className="text-stone-300 text-sm space-y-1">
      <p>
        <Key>space</Key> - toggle a letter's correctness
      </p>
      <p>
        <Key>enter</Key> - add another row
      </p>
      <p>
        <Key>tab</Key>, <Key>shift+tab</Key> / arrow keys - navigate between
        letters &amp; rows
      </p>
      <p>
        <Key>backspace</Key> - remove a letter or row if pressed at the
        beginning of a row
      </p>
    </div>
  );
};
