import { ReactNode } from "react";

const Key = ({ children }: { children: ReactNode }) => {
  return (
    <kbd className="bg-stone-700 text-rose-200 py-0.5 px-1.5 text-xs font-mono border-b-2 border-stone-500 rounded shadow-sm">
      {children}
    </kbd>
  );
};
export const Tips = () => {
  return (
    <details className="text-stone-300 text-sm w-full">
      <summary className="cursor-pointer select-none px-3 py-1 text-center">
        keyboard shortcuts
      </summary>
      <div className="py-1 flex justify-center rounded-sm">
        <table className="border-separate border-spacing-y-1.5">
          <tbody>
            <tr>
              <td className="pr-3 align-middle">
                <Key>space</Key>
              </td>
              <td className="align-middle">toggle a letter's correctness</td>
            </tr>
            <tr>
              <td className="pr-3 align-middle">
                <Key>enter</Key>
              </td>
              <td className="align-middle">add another row</td>
            </tr>
            <tr>
              <td className="pr-3 align-middle">
                <Key>⌘+enter</Key> <Key>ctrl+enter</Key>
              </td>
              <td className="align-middle">submit guesses</td>
            </tr>
            <tr>
              <td className="pr-3 align-middle">
                <Key>tab</Key> <Key>shift+tab</Key> <Key>↑</Key> <Key>↓</Key>{" "}
                <Key>←</Key> <Key>→</Key>
              </td>
              <td className="align-middle">
                navigate between letters &amp; rows
              </td>
            </tr>
            <tr>
              <td className="pr-3 align-middle">
                <Key>backspace</Key>
              </td>
              <td className="align-middle">
                remove a letter or row (if pressed at the beginning of a row)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  );
};
