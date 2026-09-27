import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: poster } = await supabase.from("posters").select("image_path").eq("id", id).maybeSingle();
  if (!poster) return new Response("Not found", { status: 404 });
  const { data, error } = await supabase.storage.from("posters").download(poster.image_path);
  if (error || !data) return new Response("Not found", { status: 404 });
  return new Response(await data.arrayBuffer(), {
    headers: { "Content-Type": data.type || "application/octet-stream", "Cache-Control": "private, max-age=300", "X-Content-Type-Options": "nosniff" },
  });
}
