import Link from "next/link";
import { redirect } from "next/navigation";
import { PosterForm } from "@/components/poster-form";
import { WinMenuBar, WinStatusBar, WinTitlebar } from "@/components/win95-chrome";
import { requireAdmin } from "@/lib/data";

export default async function NewPosterPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  return <main className="min-h-screen bg-[#c0c0c0] p-1 sm:p-5"><section className="win-window mx-auto max-w-3xl">
    <WinTitlebar><h1>新しいポスター - oshimaru</h1></WinTitlebar><WinMenuBar items={["ファイル(F)", "編集(E)", "ヘルプ(H)"]} />
    <div className="p-4 sm:p-6"><Link href="/admin" className="win-link mb-5 inline-block">← ポスター一覧へ戻る</Link><PosterForm /></div>
    <WinStatusBar>新しいポスターのプロパティ</WinStatusBar>
  </section></main>;
}
