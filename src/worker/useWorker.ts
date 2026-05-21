import { useEffect, useRef, useState } from "react";
import type { RowLetter } from "./util";

export function useWorker() {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (e: MessageEvent<{ words: string[] }>) => {
      setWords(e.data.words);
      setLoading(false);
    };
    worker.onerror = (e) => {
      console.error("Worker error:", e);
      setLoading(false);
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  function run(rows: RowLetter[][], maxMatches?: number) {
    if (rows.length === 0) {
      setWords([]);
      return;
    }
    setLoading(true);
    workerRef.current?.postMessage({ rows, maxMatches });
  }

  return { loading, words, run };
}
