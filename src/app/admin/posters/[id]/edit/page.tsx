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
  return <main className="mono-desktop"><section className="mono-window mono-form-window">
    <div className="mono-titlebar"><h1>oshimaru / edit poster</h1></div>
    <div className="mono-wall"><Link href="/admin" className="win-link mb-5 inline-block">← ポスター一覧へ戻る</Link><PosterForm poster={poster} /></div>
  </section></main>;
}
