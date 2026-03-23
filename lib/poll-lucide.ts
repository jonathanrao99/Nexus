/** Waits for the Lucide UMD bundle (from layout) and runs `createIcons` once. */
export function startLucideIconPoll(intervalMs = 30, maxWaitMs = 10_000): () => void {
  const started = Date.now();
  const id = window.setInterval(() => {
    const L = (
      window as unknown as { lucide?: { createIcons: () => void } }
    ).lucide;
    if (L?.createIcons) {
      L.createIcons();
      window.clearInterval(id);
    } else if (Date.now() - started > maxWaitMs) {
      window.clearInterval(id);
    }
  }, intervalMs);
  return () => window.clearInterval(id);
}
