import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PosterForm } from "@/components/poster-form";
import { WinMenuBar, WinStatusBar, WinTitlebar } from "@/components/win95-chrome";
import { requireAdmin } from "@/lib/data";
import { withImageUrl } from "@/lib/posters";
import type { PosterRow } from "@/types/poster";

export default async function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireAdmin();
  if (!context) redirect("/admin/login");
  const { id } = await params;
  const { data } = await context.supabase.from("posters").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const poster = withImageUrl(data as PosterRow);
  return <main className="min-h-screen bg-[#c0c0c0] p-1 sm:p-5"><section className="win-window mx-auto max-w-3xl">
    <WinTitlebar><h1>ポスターのプロパティ: {poster.title}</h1></WinTitlebar><WinMenuBar items={["ファイル(F)", "編集(E)", "ヘルプ(H)"]} />
    <div className="p-4 sm:p-6"><Link href="/admin" className="win-link mb-5 inline-block">← ポスター一覧へ戻る</Link><PosterForm poster={poster} /></div>
    <WinStatusBar>ポスターの設定を編集しています</WinStatusBar>
  </section></main>;
}
