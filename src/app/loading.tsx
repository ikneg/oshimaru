import { WinTitlebar } from "@/components/win95-chrome";

export default function Loading() {
  return <main className="desktop-pattern min-h-screen p-4" aria-busy="true"><div className="win-window mx-auto max-w-xl"><WinTitlebar><span>oshimaru</span></WinTitlebar><div className="space-y-4 p-6"><p>ポスター フォルダを読み込んでいます...</p><div className="win-inset win-progress" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div></div></div></main>;
}
