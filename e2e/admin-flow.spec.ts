import { expect, test } from "@playwright/test";

test("ログインから作成・公開ページ表示・削除まで", async ({ page }, testInfo) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "実Supabase用のE2E認証情報が必要です");
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const title = `E2Eポスター ${testInfo.project.name} ${Date.now()}-${testInfo.workerIndex}`;
  await page.goto("/admin/login");
  await page.getByLabel("メールアドレス").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("パスワード").fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: "新しいポスター" }).click();
  await page.getByLabel(/タイトル/).fill(title);
  await page.getByLabel(/画像の代替テキスト/).fill("E2Eテスト用の小さなポスター");
  await page.getByLabel(/ポスター画像/).setInputFiles({ name: "poster.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64") });
  await page.getByLabel("公開する").check();
  await page.getByRole("button", { name: "ポスターを追加" }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("button", { name: `${title}を全画面で見る` })).toBeVisible();
  await page.goto("/admin");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("heading", { name: title }).locator("../..").getByRole("button", { name: "削除" }).click();
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
  expect(errors).toEqual([]);
});
