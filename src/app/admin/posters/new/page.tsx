import Link from "next/link";
import { redirect } from "next/navigation";
import { PosterForm } from "@/components/poster-form";
import { requireAdmin } from "@/lib/data";

export default async function NewPosterPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  return <main className="desktop-pattern min-h-screen p-3 sm:p-6"><section className="win-window mx-auto max-w-3xl"><h1 className="win-titlebar">新しいポスター</h1><div className="p-4 sm:p-6"><Link href="/admin" className="mb-5 inline-block underline">← 一覧へ戻る</Link><PosterForm /></div></section></main>;
}
