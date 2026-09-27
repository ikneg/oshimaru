"use client";
import { Button } from "@/components/ui/button";
import { WinTitlebar } from "@/components/win95-chrome";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="desktop-pattern flex min-h-screen items-center justify-center p-4"><div className="win-window max-w-lg"><WinTitlebar><span>oshimaru</span></WinTitlebar><div className="flex gap-4 p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff0000] text-2xl font-bold text-white" aria-hidden="true">×</span><div className="space-y-4"><p>ポスターを読み込めませんでした。接続設定を確認してください。</p><Button onClick={reset}>再試行(R)</Button></div></div></div></main>;
}
