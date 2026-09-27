# oshimaru MVP 設計メモ

## 構成

Next.js App RouterのServer Componentで一覧を読み、管理変更はServer Actionで実行する。Supabase AuthのCookieは`@supabase/ssr`と`proxy.ts`で更新する。DBとStorageの最終認可はRLSが行う。

## データと画像

- `admin_users`: AuthユーザーIDだけを管理者として登録する。
- `posters`: 画像パス、表示名、代替テキスト、掲載期間、表示順、公開状態を持つ。
- `posters` Storage bucket: private。公開中かつ期間内の行に紐づくオブジェクトだけ匿名`SELECT`を許可する。
- DB行はStorage内のパスだけを保持し、アプリの画像Routeが現在のセッションで取得する。

削除はStorageを先に削除し、失敗したらDB行を残す。差し替えは新画像を保存してDBを更新した後に旧画像を削除する。これによりDBから参照される画像の消失を避ける。

## 合理的な仮定

- 最大画像サイズは8MB。
- `starts_at`はその時刻を含み、`ends_at`はその時刻を含まない。
- 並び替えは上下ボタンを必須手段とし、ドラッグ操作はMVPに含めない。
- Supabase未設定時だけ同梱サンプルを表示し、本番DBへ自動投入しない。
- 管理者が画像を削除した後にDB削除だけ失敗する稀な場合は、画面にエラーを出し、再アップロードまたは行削除を手動復旧する。
