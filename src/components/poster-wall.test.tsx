import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PosterWall } from "@/components/poster-wall";
import type { Poster } from "@/types/poster";

const poster = (id: string, title: string): Poster => ({ id, title, image_path: `/demo/${id}.svg`, image_url: `/demo/${id}.svg`, alt_text: `${title}の画像`, starts_at: null, ends_at: null, sort_order: 0, is_published: true, created_by: "x", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" });
const posters = [poster("one", "一枚目"), poster("two", "二枚目")];

describe("PosterWall viewer", () => {
  it("開く、前後移動、Escapeで閉じる、元のボタンへフォーカスを戻す", async () => {
    render(<PosterWall posters={posters} />);
    const opener = screen.getByRole("button", { name: "一枚目を全画面で見る" });
    opener.focus(); fireEvent.click(opener);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("一枚目")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "次のポスター" }));
    expect(screen.getByText("二枚目")).toBeInTheDocument();
    expect(window.location.search).toBe("?poster=two");
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByText("一枚目")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await vi.waitFor(() => expect(opener).toHaveFocus());
  });

  it("背景クリックで閉じる", () => {
    render(<PosterWall posters={posters} />);
    fireEvent.click(screen.getByRole("button", { name: "二枚目を全画面で見る" }));
    const backdrop = screen.getByRole("dialog").parentElement!;
    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
