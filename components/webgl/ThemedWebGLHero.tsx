"use client";

import { useEffect, useRef } from "react";
import {
  initPageAmbientWebGL,
  type PageAmbientVariant,
} from "./page-ambient-webgl";

type Props = {
  variant: PageAmbientVariant;
};

export function ThemedWebGLHero({ variant }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return initPageAmbientWebGL(canvas, variant);
  }, [variant]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(72vh,560px)] overflow-hidden">
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#09090b]/25 to-[#09090b]"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  );
}
