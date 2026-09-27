import { expect, test } from "@playwright/test";

test("ポスターを開き、移動し、Escapeで閉じてフォーカスが戻る", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "oshimaru" })).toBeVisible();
  const first = page.getByRole("button", { name: /朝市のお知らせを全画面で見る/ });
  await first.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/poster=/);
  await page.getByRole("button", { name: "次のポスター" }).click();
  await expect(page.getByText("まちのパン祭り", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/poster=22222222-2222-4222-8222-222222222222/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(first).toBeFocused();
  await expect(page).toHaveURL(/demo=1/);
  await expect(page).not.toHaveURL(/poster=/);
  expect(errors).toEqual([]);
});

test("共有URLから指定ポスターを直接開ける", async ({ page }) => {
  await page.goto("/?demo=1&poster=33333333-3333-4333-8333-333333333333");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("秋の音楽会", { exact: true })).toBeVisible();
});
