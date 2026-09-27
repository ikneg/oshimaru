"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="mono-desktop flex items-center justify-center"><div className="mono-window mono-dialog w-full max-w-lg"><div className="mono-titlebar"><span>oshimaru / error</span></div><div className="mono-dialog-body flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-2xl font-bold text-white" aria-hidden="true">×</span><div className="space-y-4"><p>ポスターを読み込めませんでした。接続設定を確認してください。</p><Button onClick={reset}>再試行(R)</Button></div></div></div></main>;
}
