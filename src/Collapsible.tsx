import { PropsWithChildren } from "react";

export function Collapsible({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <details>
      <summary className="cursor-pointer bg-stone-700 px-3 py-2 text-lg rounded-sm">
        {title}
      </summary>
      {children}
    </details>
  );
}
