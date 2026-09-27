import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { deletePosterAction, logoutAction, movePosterAction, togglePosterAction } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/data";
import { withImageUrl } from "@/lib/posters";
import type { PosterRow } from "@/types/poster";

export default async function AdminPage() {
  const context = await requireAdmin();
  if (!context) redirect("/admin/login");
  const { data, error } = await context.supabase.from("posters").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) throw new Error(`管理用ポスター一覧を取得できませんでした: ${error.message}`);
  const posters = (data as PosterRow[]).map(withImageUrl);
  return <main className="desktop-pattern min-h-screen p-2 sm:p-5"><section className="win-window mx-auto max-w-6xl">
    <header className="win-titlebar"><h1>oshimaru 管理</h1><span className="text-xs font-normal">{context.user.email}</span></header>
    <nav aria-label="管理メニュー" className="flex flex-wrap gap-2 border-b-2 border-[#808080] p-3">
      <Link className="win-button inline-flex min-h-11 items-center px-4 font-bold" href="/admin/posters/new">新しいポスター</Link>
      <Link className="win-button inline-flex min-h-11 items-center px-4 font-bold" href="/" target="_blank">公開ページをプレビュー</Link>
      <form action={logoutAction} className="sm:ml-auto"><Button type="submit">ログアウト</Button></form>
    </nav>
    <div className="p-3 sm:p-5"><h2 className="mb-4 text-lg font-bold">ポスター一覧（{posters.length}件）</h2>
      {!posters.length ? <div className="win-inset bg-white p-8 text-center">まだポスターがありません。「新しいポスター」から追加してください。</div> :
      <div className="space-y-3">{posters.map((poster, index) => <article key={poster.id} className="win-inset grid gap-3 bg-white p-3 md:grid-cols-[90px_1fr_auto]">
        <Image src={poster.image_url} alt="" width={90} height={96} unoptimized className="h-24 w-[90px] object-contain bg-[#eee]" />
        <div className="min-w-0"><h3 className="font-bold">{poster.title}</h3><p className="mt-1 text-xs">表示順: {poster.sort_order}</p><p className="mt-1"><span className={`inline-block border border-black px-2 py-1 text-xs font-bold ${poster.is_published ? "bg-[#b7f0b1]" : "bg-[#e0e0e0]"}`}>{poster.is_published ? "公開設定" : "非公開"}</span></p><p className="mt-2 text-xs">期間（日本時間）: {poster.starts_at ? new Date(poster.starts_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : "指定なし"} ～ {poster.ends_at ? new Date(poster.ends_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : "指定なし"}</p></div>
        <div className="flex flex-wrap items-start gap-2 md:max-w-72 md:justify-end">
          <form action={movePosterAction.bind(null, poster.id, "up")}><Button type="submit" disabled={index === 0} aria-label={`${poster.title}を上へ移動`}>↑ 上へ</Button></form>
          <form action={movePosterAction.bind(null, poster.id, "down")}><Button type="submit" disabled={index === posters.length - 1} aria-label={`${poster.title}を下へ移動`}>↓ 下へ</Button></form>
          <form action={togglePosterAction.bind(null, poster.id, !poster.is_published)}><Button type="submit">{poster.is_published ? "非公開にする" : "公開する"}</Button></form>
          <Link className="win-button inline-flex min-h-11 items-center px-4 font-bold" href={`/admin/posters/${poster.id}/edit`}>編集</Link>
          <form action={deletePosterAction.bind(null, poster.id, poster.image_path)}><ConfirmSubmit label="削除" question={`「${poster.title}」と画像を削除します。元に戻せません。よろしいですか？`} /></form>
        </div>
      </article>)}</div>}
    </div>
  </section></main>;
}
