import { describe, expect, it } from "vitest";
import { japanLocalToIso, posterSchema, validateImageFile } from "@/lib/validation";

describe("poster validation", () => {
  it("終了が開始以前なら拒否する", () => {
    const result = posterSchema.safeParse({ title: "x", alt_text: "x", starts_at: "2026-02-02T10:00", ends_at: "2026-02-02T09:00", sort_order: 1, is_published: false });
    expect(result.success).toBe(false);
  });
  it("SVGをサーバー側画像検証で拒否する", async () => expect(await validateImageFile(new File(["<svg/>"], "x.svg", { type: "image/svg+xml" }), true)).toMatch(/JPEG/));
  it("偽装PNGをバイト署名検証で拒否する", async () => expect(await validateImageFile(new File(["not png"], "x.png", { type: "image/png" }), true)).toMatch(/一致しません/));
  it("日本時間の入力をUTCへ変換する", () => expect(japanLocalToIso("2026-09-26T12:00")).toBe("2026-09-26T03:00:00.000Z"));
});
