import Link from "next/link";
import { WinTitlebar } from "@/components/win95-chrome";
export default function NotFound() { return <main className="desktop-pattern flex min-h-screen items-center justify-center p-4"><div className="win-window max-w-md"><WinTitlebar><span>oshimaru</span></WinTitlebar><div className="space-y-4 p-6"><p className="font-bold">ファイルが見つかりません</p><p>指定されたページまたはポスターは見つかりませんでした。</p><Link className="win-link" href="/">公開ページへ戻る</Link></div></div></main>; }
