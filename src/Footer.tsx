export const Footer = () => {
  return (
    <div className="flex flex-col text-sm pt-10 pb-14 text-center bg-stone-900 text-stone-300 gap-5">
      <p>
        made with 💖 by{" "}
        <a
          className="cursor-pointer text-blue-400"
          href="https://jamese.dev"
          tabIndex={-1}
        >
          me
        </a>
      </p>
      <p className="italic">
        "If it feels like cheating, that's probably because it is"&trade;
      </p>
      <p>
        <a
          className="cursor-pointer text-blue-400"
          href="https://github.com/naught0/werdl"
          tabIndex={-1}
        >
          source
        </a>
      </p>
    </div>
  );
};
