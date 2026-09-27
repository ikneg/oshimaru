import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PosterForm } from "@/components/poster-form";
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
  return <main className="desktop-pattern min-h-screen p-3 sm:p-6"><section className="win-window mx-auto max-w-3xl"><h1 className="win-titlebar">ポスターを編集: {poster.title}</h1><div className="p-4 sm:p-6"><Link href="/admin" className="mb-5 inline-block underline">← 一覧へ戻る</Link><PosterForm poster={poster} /></div></section></main>;
}
