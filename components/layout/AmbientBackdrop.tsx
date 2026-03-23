/** Matches the grain + vignette layer from the original static pages. */
export function AmbientBackdrop() {
  return (
    <>
      <div className="fixed inset-0 -z-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 pointer-events-none" />
    </>
  );
}
