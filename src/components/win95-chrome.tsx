import type { ReactNode } from "react";

export function WinTitlebar({ children, meta, controls = true }: { children: ReactNode; meta?: ReactNode; controls?: boolean }) {
  return <header className="win-titlebar">
    <div className="flex min-w-0 items-center gap-2">
      <span className="win-app-icon" aria-hidden="true"><span /></span>
      <div className="min-w-0 truncate">{children}</div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      {meta ? <span className="win-title-meta">{meta}</span> : null}
      {controls ? <span className="win-caption-buttons" aria-hidden="true"><span>_</span><span>□</span><span>×</span></span> : null}
    </div>
  </header>;
}

export function WinMenuBar({ items = ["ファイル(F)", "表示(V)", "ヘルプ(H)"] }: { items?: string[] }) {
  return <div className="win-menubar" aria-hidden="true">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

export function WinStatusBar({ children }: { children: ReactNode }) {
  return <footer className="win-statusbar"><span>{children}</span><i aria-hidden="true" /></footer>;
}

