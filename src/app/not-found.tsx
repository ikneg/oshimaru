import Link from "next/link";
export default function NotFound() { return <main className="desktop-pattern flex min-h-screen items-center justify-center p-4"><div className="win-window max-w-md"><div className="win-titlebar">見つかりません</div><div className="space-y-4 p-6"><p>指定されたページまたはポスターは見つかりませんでした。</p><Link className="underline" href="/">公開ページへ戻る</Link></div></div></main>; }
