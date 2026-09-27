"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { japanLocalToIso, posterSchema, safeImageName, validateImageFile } from "@/lib/validation";

export type ActionState = { ok: boolean; message: string; errors?: Record<string, string[]> };
const initialFailure = (message: string): ActionState => ({ ok: false, message });

async function adminContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { supabase, user } : null;
}

function posterValues(formData: FormData) {
  return {
    title: formData.get("title"), alt_text: formData.get("alt_text"), starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"), sort_order: formData.get("sort_order"), is_published: formData.get("is_published"),
  };
}

function dbValues(input: ReturnType<typeof posterSchema.parse>) {
  return { ...input, starts_at: japanLocalToIso(input.starts_at), ends_at: japanLocalToIso(input.ends_at) };
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return initialFailure("メールアドレスとパスワードを入力してください。");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return initialFailure("ログインできませんでした。入力内容を確認してください。");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) { await supabase.auth.signOut(); return initialFailure("このアカウントには管理権限がありません。"); }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createPosterAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const context = await adminContext();
  if (!context) return initialFailure("管理者としてログインし直してください。");
  const parsed = posterSchema.safeParse(posterValues(formData));
  if (!parsed.success) return { ok: false, message: "入力内容を確認してください。", errors: parsed.error.flatten().fieldErrors };
  const file = formData.get("image");
  if (!(file instanceof File)) return initialFailure("画像を選択してください。");
  const imageError = await validateImageFile(file, true);
  if (imageError) return initialFailure(imageError);
  const imagePath = safeImageName(context.user.id, file.type);
  const { error: uploadError } = await context.supabase.storage.from("posters").upload(imagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) return initialFailure(`画像を保存できませんでした: ${uploadError.message}`);
  const { error } = await context.supabase.from("posters").insert({ ...dbValues(parsed.data), image_path: imagePath, created_by: context.user.id });
  if (error) { await context.supabase.storage.from("posters").remove([imagePath]); return initialFailure(`ポスターを保存できませんでした: ${error.message}`); }
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePosterAction(id: string, oldImagePath: string, _state: ActionState, formData: FormData): Promise<ActionState> {
  const context = await adminContext();
  if (!context) return initialFailure("管理者としてログインし直してください。");
  const parsed = posterSchema.safeParse(posterValues(formData));
  if (!parsed.success) return { ok: false, message: "入力内容を確認してください。", errors: parsed.error.flatten().fieldErrors };
  const file = formData.get("image");
  if (!(file instanceof File)) return initialFailure("画像を確認できませんでした。");
  const imageError = await validateImageFile(file, false);
  if (imageError) return initialFailure(imageError);
  let imagePath = oldImagePath;
  if (file.size) {
    imagePath = safeImageName(context.user.id, file.type);
    const { error } = await context.supabase.storage.from("posters").upload(imagePath, file, { contentType: file.type, upsert: false });
    if (error) return initialFailure(`新しい画像を保存できませんでした: ${error.message}`);
  }
  const { error } = await context.supabase.from("posters").update({ ...dbValues(parsed.data), image_path: imagePath }).eq("id", id);
  if (error) { if (imagePath !== oldImagePath) await context.supabase.storage.from("posters").remove([imagePath]); return initialFailure(`更新できませんでした: ${error.message}`); }
  if (imagePath !== oldImagePath) await context.supabase.storage.from("posters").remove([oldImagePath]);
  revalidatePath("/"); revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePosterAction(id: string, imagePath: string) {
  const context = await adminContext();
  if (!context) redirect("/admin/login");
  const { error: storageError } = await context.supabase.storage.from("posters").remove([imagePath]);
  if (storageError) throw new Error(`画像を削除できませんでした: ${storageError.message}`);
  const { error } = await context.supabase.from("posters").delete().eq("id", id);
  if (error) throw new Error(`ポスターを削除できませんでした: ${error.message}`);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function togglePosterAction(id: string, publish: boolean) {
  const context = await adminContext();
  if (!context) redirect("/admin/login");
  const { error } = await context.supabase.from("posters").update({ is_published: publish }).eq("id", id);
  if (error) throw new Error(`公開状態を変更できませんでした: ${error.message}`);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function movePosterAction(id: string, direction: "up" | "down") {
  const context = await adminContext();
  if (!context) redirect("/admin/login");
  const { data: current } = await context.supabase.from("posters").select("id,sort_order").eq("id", id).single();
  if (!current) return;
  let query = context.supabase.from("posters").select("id,sort_order").neq("id", id);
  query = direction === "up" ? query.lt("sort_order", current.sort_order).order("sort_order", { ascending: false }) : query.gt("sort_order", current.sort_order).order("sort_order");
  const { data } = await query.limit(1).maybeSingle();
  if (!data) return;
  await context.supabase.from("posters").update({ sort_order: data.sort_order }).eq("id", current.id);
  await context.supabase.from("posters").update({ sort_order: current.sort_order }).eq("id", data.id);
  revalidatePath("/"); revalidatePath("/admin");
}
