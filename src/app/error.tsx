"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="desktop-pattern flex min-h-screen items-center justify-center p-4"><div className="win-window max-w-lg"><div className="win-titlebar">読み込みエラー</div><div className="space-y-4 p-6"><p>ポスターを読み込めませんでした。接続設定を確認してください。</p><Button onClick={reset}>再試行</Button></div></div></main>;
}
