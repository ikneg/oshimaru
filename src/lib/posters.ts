import type { Poster, PosterRow } from "@/types/poster";

export function isPosterVisible(
  poster: Pick<PosterRow, "is_published" | "starts_at" | "ends_at">,
  now = new Date(),
) {
  if (!poster.is_published) return false;
  const time = now.getTime();
  if (poster.starts_at && new Date(poster.starts_at).getTime() > time) return false;
  if (poster.ends_at && new Date(poster.ends_at).getTime() <= time) return false;
  return true;
}

export function posterImageUrl(id: string, imagePath: string) {
  if (imagePath.startsWith("/")) return imagePath;
  return `/api/posters/${encodeURIComponent(id)}/image`;
}

export function withImageUrl(row: PosterRow): Poster {
  return { ...row, image_url: posterImageUrl(row.id, row.image_path) };
}
