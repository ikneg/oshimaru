import Link from "next/link";
import { redirect } from "next/navigation";
import { PosterForm } from "@/components/poster-form";
import { requireAdmin } from "@/lib/data";

export default async function NewPosterPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  return <main className="mono-desktop"><section className="mono-window mono-form-window">
    <div className="mono-titlebar"><h1>oshimaru / new poster</h1></div>
    <div className="mono-wall"><Link href="/admin" className="win-link mb-5 inline-block">← ポスター一覧へ戻る</Link><PosterForm /></div>
  </section></main>;
}
