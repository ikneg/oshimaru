import { z } from "zod";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const optionalDate = z.string().trim().transform((value) => value || null).refine((value) => value === null || !Number.isNaN(Date.parse(value)), "正しい日時を入力してください。");

export const posterSchema = z.object({
  title: z.string().trim().min(1, "タイトルは必須です。").max(120, "タイトルは120文字以内です。"),
  alt_text: z.string().trim().min(1, "代替テキストは必須です。").max(240, "代替テキストは240文字以内です。"),
  starts_at: optionalDate,
  ends_at: optionalDate,
  sort_order: z.coerce.number().int("表示順は整数です。").min(0, "表示順は0以上です。").max(1_000_000),
  is_published: z.preprocess((value) => value === "on" || value === true, z.boolean()),
}).superRefine((data, context) => {
  if (data.starts_at && data.ends_at && new Date(data.starts_at) >= new Date(data.ends_at)) {
    context.addIssue({ code: "custom", path: ["ends_at"], message: "終了日時は開始日時より後にしてください。" });
  }
});

export type PosterInput = z.infer<typeof posterSchema>;

export function validateImage(file: File, required: boolean) {
  if (!file.size && !required) return null;
  if (!file.size) return "画像を選択してください。";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) return "JPEG、PNG、WebP形式の画像を選択してください。";
  if (file.size > MAX_IMAGE_BYTES) return "画像は8MB以下にしてください。";
  return null;
}

export async function validateImageFile(file: File, required: boolean) {
  const basicError = validateImage(file, required);
  if (basicError || !file.size) return basicError;
  const chunk = file.slice(0, 12);
  const buffer = typeof chunk.arrayBuffer === "function"
    ? await chunk.arrayBuffer()
    : await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.readAsArrayBuffer(chunk);
      });
  const bytes = new Uint8Array(buffer);
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  const webp = bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const matches = (file.type === "image/jpeg" && jpeg) || (file.type === "image/png" && png) || (file.type === "image/webp" && webp);
  return matches ? null : "画像ファイルの内容と形式が一致しません。";
}

export function japanLocalToIso(value: string | null) {
  return value ? new Date(`${value}:00+09:00`).toISOString() : null;
}

export function safeImageName(userId: string, mime: string) {
  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>)[mime];
  return `${userId}/${crypto.randomUUID()}.${extension}`;
}
