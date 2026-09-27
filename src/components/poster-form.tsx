"use client";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { createPosterAction, updatePosterAction, type ActionState } from "@/app/admin/actions";
import { ActionSubmit } from "@/components/action-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validation";
import type { Poster } from "@/types/poster";
const initial: ActionState = { ok: false, message: "" };
const localDate = (value: string | null) => value ? new Date(value).toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" }).replace(" ", "T").slice(0, 16) : "";

export function PosterForm({ poster }: { poster?: Poster }) {
  const bound = poster ? updatePosterAction.bind(null, poster.id, poster.image_path) : createPosterAction;
  const [state, action] = useActionState(bound, initial);
  const [preview, setPreview] = useState<string | null>(poster?.image_url ?? null);
  const [clientImageError, setClientImageError] = useState("");
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);
  return <form action={action} className="space-y-5" onSubmit={(event) => { if (clientImageError) event.preventDefault(); }}>
    <div><Label htmlFor="title">タイトル <span aria-hidden="true">*</span></Label><Input id="title" name="title" defaultValue={poster?.title} maxLength={120} required aria-describedby="title-error" />{state.errors?.title && <p id="title-error" className="mt-1 text-red-800">{state.errors.title[0]}</p>}</div>
    <div><Label htmlFor="alt_text">画像の代替テキスト <span aria-hidden="true">*</span></Label><Input id="alt_text" name="alt_text" defaultValue={poster?.alt_text} maxLength={240} required aria-describedby="alt-error" /><p className="mt-1 text-xs">画像に何が書かれているか、簡潔に説明してください。</p>{state.errors?.alt_text && <p id="alt-error" className="mt-1 text-red-800">{state.errors.alt_text[0]}</p>}</div>
    <div><Label htmlFor="image">ポスター画像 {poster ? "（差し替える場合のみ）" : <span aria-hidden="true">*</span>}</Label><Input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!poster} aria-describedby="image-help image-error" onChange={(event) => { const file = event.target.files?.[0]; setClientImageError(""); if (!file) return; if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) { setClientImageError("JPEG、PNG、WebP形式の画像を選択してください。"); return; } if (file.size > MAX_IMAGE_BYTES) { setClientImageError("画像は8MB以下にしてください。"); return; } if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); setPreview(URL.createObjectURL(file)); }} /><p id="image-help" className="mt-1 text-xs">JPEG / PNG / WebP、最大8MB。SVGは使用できません。</p>{clientImageError && <p id="image-error" role="alert" className="mt-1 text-red-800">{clientImageError}</p>}</div>
    {preview && <div className="win-inset inline-block max-w-sm bg-white p-2"><Image src={preview} alt="アップロード前のプレビュー" width={600} height={800} className="h-auto max-h-80 w-auto max-w-full object-contain" unoptimized /></div>}
    <div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="starts_at">掲載開始日時（日本時間）</Label><Input id="starts_at" name="starts_at" type="datetime-local" defaultValue={localDate(poster?.starts_at ?? null)} />{state.errors?.starts_at && <p className="mt-1 text-red-800">{state.errors.starts_at[0]}</p>}</div><div><Label htmlFor="ends_at">掲載終了日時（日本時間）</Label><Input id="ends_at" name="ends_at" type="datetime-local" defaultValue={localDate(poster?.ends_at ?? null)} />{state.errors?.ends_at && <p className="mt-1 text-red-800">{state.errors.ends_at[0]}</p>}</div></div>
    <div><Label htmlFor="sort_order">表示順 <span aria-hidden="true">*</span></Label><Input id="sort_order" name="sort_order" type="number" min="0" step="1" defaultValue={poster?.sort_order ?? 0} required /></div>
    <label className="flex min-h-11 items-center gap-3"><input name="is_published" type="checkbox" defaultChecked={poster?.is_published ?? false} className="h-5 w-5" /> 公開する</label>
    {state.message && <p role="alert" className="win-inset bg-white p-3 text-red-800">{state.message}</p>}
    <div className="flex gap-3"><ActionSubmit idle={poster ? "変更を保存" : "ポスターを追加"} pending={poster ? "保存中…" : "画像を送信・保存中…"} /></div>
  </form>;
}
