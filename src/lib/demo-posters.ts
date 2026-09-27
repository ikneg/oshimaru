import type { Poster } from "@/types/poster";

const now = "2026-01-01T00:00:00.000Z";

export const demoPosters: Poster[] = [
  ["11111111-1111-4111-8111-111111111111", "朝市のお知らせ", "朝市の開催を告知する黄色い縦長ポスター", "morning-market.svg"],
  ["22222222-2222-4222-8222-222222222222", "まちのパン祭り", "パン祭りを案内する青い横長ポスター", "bread-festival.svg"],
  ["33333333-3333-4333-8333-333333333333", "秋の音楽会", "秋の音楽会を案内する赤い正方形ポスター", "autumn-concert.svg"],
  ["44444444-4444-4444-8444-444444444444", "読書週間", "読書週間を案内する緑の縦長ポスター", "reading-week.svg"],
  ["55555555-5555-4555-8555-555555555555", "青空フリーマーケット", "フリーマーケットを案内する紫の横長ポスター", "flea-market.svg"],
  ["66666666-6666-4666-8666-666666666666", "こども工作教室", "工作教室を案内するオレンジ色の正方形ポスター", "craft-class.svg"],
  ["77777777-7777-4777-8777-777777777777", "冬のあったか市", "冬の催しを案内する紺色の縦長ポスター", "winter-fair.svg"],
].map(([id, title, alt, file], sort_order) => ({
  id, title, alt_text: alt, image_path: `/demo/${file}`, image_url: `/demo/${file}`,
  starts_at: null, ends_at: null, sort_order, is_published: true,
  created_by: "00000000-0000-0000-0000-000000000000", created_at: now, updated_at: now,
}));
