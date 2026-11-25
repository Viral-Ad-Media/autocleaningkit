"use client";

import { useEffect, useRef } from "react";

/**
 * One large statement whose words turn from grey to ink as it crosses the middle of the
 * screen, and back on the way up. Words inside `strong` turn to the accent instead.
 * Without script, and under reduced motion, every word is ink (the CSS handles that).
 *
 * `parts` is plain text with the strong run wrapped in *asterisks*.
 */
export function Statement({ parts, className = "" }: { parts: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>(".wh-word"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-on"));
      return;
    }
    el.dataset.live = "true";
    let frame = 0;
    let shown = -1;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.45;
      const t = Math.min(1, Math.max(0, (start - r.top) / Math.max(1, start - end + r.height)));
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const k = atEnd ? words.length : Math.round(t * words.length);
      if (k === shown) return;
      shown = k;
      words.forEach((w, i) => w.classList.toggle("is-on", i < k));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Split "*strong run*" out of the text, then every run into words.
  const runs = parts.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <p ref={ref} className={`t-h2 max-w-[24ch] md:max-w-[22ch] ${className}`}>
      {runs.map((run, i) => {
        const strong = run.startsWith("*");
        const words = (strong ? run.slice(1, -1) : run).split(/(\s+)/);
        const spans = words.map((w, j) =>
          /^\s+$/.test(w) || !w ? (
            w
          ) : (
            <span key={j} className="wh-word">
              {w}
            </span>
          ),
        );
        return strong ? (
          <strong key={i} className="wh-strong font-[inherit]">
            {spans}
          </strong>
        ) : (
          <span key={i}>{spans}</span>
        );
      })}
    </p>
  );
}
