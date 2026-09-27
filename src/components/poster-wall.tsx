"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/image-with-fallback";
import type { Poster } from "@/types/poster";

function updatePosterQuery(posterId?: string) {
  const url = new URL(window.location.href);
  if (posterId) url.searchParams.set("poster", posterId);
  else url.searchParams.delete("poster");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export function PosterWall({ posters, initialPosterId }: { posters: Poster[]; initialPosterId?: string }) {
  const [active, setActive] = useState(() => posters.findIndex((p) => p.id === initialPosterId));
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const open = active >= 0;

  const change = useCallback((delta: number) => setActive((current) => {
    const next = (current + delta + posters.length) % posters.length;
    updatePosterQuery(posters[next].id);
    return next;
  }), [posters]);
  const close = useCallback(() => {
    setActive(-1);
    updatePosterQuery();
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") change(-1);
      if (event.key === "ArrowRight") change(1);
      if (event.key === "Tab") {
        const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])") ?? [])];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); };
  }, [change, close, open]);

  function show(index: number, element: HTMLElement) {
    openerRef.current = element;
    setActive(index);
    updatePosterQuery(posters[index].id);
  }

  if (!posters.length) return <div className="win-window mx-auto max-w-xl"><div className="win-titlebar"><span className="flex items-center gap-2"><span className="win-app-icon" aria-hidden="true"><span /></span>oshimaru</span></div><div className="flex items-start gap-4 p-6"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#000080] text-xl font-bold text-white" aria-hidden="true">i</span><div><p className="font-bold">ポスターはありません</p><p className="mt-2">現在公開中のポスターはありません。しばらくしてからもう一度ご覧ください。</p></div></div></div>;
  const current = open ? posters[active] : null;

  return <>
    <div className="poster-grid" aria-label="公開中のポスター">
      {posters.map((poster, index) => <article className="poster-card" key={poster.id}>
        <button className="poster-paper" aria-label={`${poster.title}を全画面で見る`} onClick={(event) => show(index, event.currentTarget)}>
          <ImageWithFallback src={poster.image_url} alt={poster.alt_text} priority={index < 4} />
        </button>
      </article>)}
    </div>
    {current && <div className="viewer-backdrop fixed inset-0 z-50 flex p-2 sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="viewer-title" className="win-window m-auto flex h-full w-full max-w-[1500px] flex-col">
        <div className="win-titlebar">
          <span className="flex min-w-0 items-center gap-2"><span className="win-app-icon" aria-hidden="true"><span /></span><span id="viewer-title" className="truncate">{current.title}</span><span aria-hidden="true">- oshimaru</span></span>
          <Button variant="compact" aria-label="ビューアーを閉じる" onClick={close} className="min-h-10 min-w-11 text-xl leading-none">×</Button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#202020] p-2 sm:p-4"
          onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => { const start = touchStart.current; const end = event.changedTouches[0]?.clientX; if (start != null && end != null && Math.abs(end - start) > 50) change(end > start ? -1 : 1); touchStart.current = null; }}>
          <ImageWithFallback src={current.image_url} alt={current.alt_text} className="viewer-image" priority />
        </div>
        <div className="flex items-center justify-between gap-3 p-2">
          <Button onClick={() => change(-1)} aria-label="前のポスター">&lt; 前へ(B)</Button>
          <span aria-live="polite" className="text-center text-xs sm:text-sm">{active + 1} / {posters.length}</span>
          <Button onClick={() => change(1)} aria-label="次のポスター">次へ(N) &gt;</Button>
        </div>
      </div>
    </div>}
  </>;
}
