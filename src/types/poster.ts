export type Poster = {
  id: string;
  title: string;
  image_path: string;
  alt_text: string;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  image_url: string;
};

export type PosterRow = Omit<Poster, "image_url">;
