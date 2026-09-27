import { describe, expect, it } from "vitest";
import { isPosterVisible } from "@/lib/posters";

const now = new Date("2026-09-26T12:00:00.000Z");
const base = { is_published: true, starts_at: null, ends_at: null };

describe("isPosterVisible", () => {
  it("公開済みで期間指定がなければ表示する", () => expect(isPosterVisible(base, now)).toBe(true));
  it("非公開は表示しない", () => expect(isPosterVisible({ ...base, is_published: false }, now)).toBe(false));
  it("開始日時ちょうどから表示する", () => expect(isPosterVisible({ ...base, starts_at: now.toISOString() }, now)).toBe(true));
  it("開始前は表示しない", () => expect(isPosterVisible({ ...base, starts_at: "2026-09-26T12:00:01.000Z" }, now)).toBe(false));
  it("終了日時ちょうどでは表示しない", () => expect(isPosterVisible({ ...base, ends_at: now.toISOString() }, now)).toBe(false));
  it("終了前は表示する", () => expect(isPosterVisible({ ...base, ends_at: "2026-09-26T12:00:01.000Z" }, now)).toBe(true));
});
