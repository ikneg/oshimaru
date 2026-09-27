import { demoPosters } from "@/lib/demo-posters";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { withImageUrl } from "@/lib/posters";
import type { Poster, PosterRow } from "@/types/poster";

export async function getPublicPosters(options?: { forceDemo?: boolean }): Promise<{ posters: Poster[]; demo: boolean }> {
  const canForceDemo = process.env.NODE_ENV !== "production" && options?.forceDemo;
  if (canForceDemo || !isSupabaseConfigured()) return { posters: demoPosters, demo: true };
  const supabase = await createClient();
  const { data, error } = await supabase.from("posters").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) throw new Error(`ポスターを取得できませんでした: ${error.message}`);
  return { posters: (data as PosterRow[]).map(withImageUrl), demo: false };
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? { user, supabase } : null;
}
