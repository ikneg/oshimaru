# oshimaru

スーパーなどの壁にたくさんの宣伝ポスターが貼られている雰囲気を、Web上で楽しめるデジタル広告ウォールです。一般ユーザーは公開期間中のポスターを閲覧し、管理者だけが画像の追加・編集・削除・公開・並び替えを行えます。

Supabase未接続のローカル環境では、プロジェクト内で作成した7枚のオリジナル画像を表示します。サンプルはDBへ自動登録されないため、本番へ混入しません。

## 技術構成

- Next.js 16 App Router / React 19 / TypeScript
- Tailwind CSS 4 / shadcn/ui方式の所有コンポーネント
- Supabase PostgreSQL / Auth / private Storage
- Vitest / Testing Library / Playwright
- Vercelへのデプロイを想定

詳しい設計判断は [docs/architecture.md](docs/architecture.md) に記録しています。

## 必要なもの

- Node.js 20.9以上（推奨: 現行LTS）
- npm
- 実データを扱う場合はSupabaseアカウント
- 公開する場合はVercelアカウント

## ローカル起動

SupabaseなしでUIだけ確認する場合:

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。7枚のサンプルポスターが表示されます。管理画面はSupabase設定後に利用できます。

Supabaseへ接続する場合:

```bash
cp .env.example .env.local
```

`.env.local` に次を設定してから `npm run dev` を再起動します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

どちらもブラウザ公開を前提とした値です。Supabase Dashboardの **Project Settings → API** から取得します。旧プロジェクトでPublishable keyが表示されない場合はanon keyを同じ欄へ設定できます。service role keyは不要で、ブラウザへ渡してはいけません。

## Supabaseプロジェクトの作成とmigration

1. Supabase Dashboardで新規プロジェクトを作成します。
2. ローカルへSupabase CLIを用意し、リポジトリ直下でログインします。
3. DashboardのProject SettingsでProject Refを確認します。
4. 次を実行します。

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

適用されるSQLは [supabase/migrations/20260926000000_initial_schema.sql](supabase/migrations/20260926000000_initial_schema.sql) です。`admin_users`、`posters`、制約、index、`updated_at` trigger、RLS、privateな`posters` Storage bucketとStorage policyを再現可能に作成します。

### Storage設定

migrationが次を自動設定します。

- bucket名: `posters`
- public: オフ（private）
- 最大サイズ: 8MB
- MIME type: JPEG / PNG / WebPのみ
- 読み取り: 公開中かつ掲載期間内のポスター画像、または管理者だけ
- 作成・更新・削除: `admin_users`登録済み管理者だけ

Dashboardでbucketをpublicへ変更しないでください。未公開画像がURLだけで閲覧できる状態になります。

## 初期管理者の作成

パスワードは、このリポジトリ、SQL、README、Git履歴へ書かないでください。

1. Supabase Dashboardで **Authentication → Users → Add user → Create new user** を開きます。
2. Emailへ `chappy11@aioros.ocn.ne.jp` を入力します。
3. 十分に長く固有のパスワードをその場で設定し、安全なパスワードマネージャーへ保存します。
4. ユーザー作成後、Dashboardの **SQL Editor** を開き、次だけを実行します。

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'chappy11@aioros.ocn.ne.jp'
on conflict (user_id) do nothing;
```

5. 登録を確認します。

```sql
select au.email, ad.created_at
from public.admin_users ad
join auth.users au on au.id = ad.user_id
where au.email = 'chappy11@aioros.ocn.ne.jp';
```

1行表示されれば完了です。アプリはメールアドレス自体で管理者判定をせず、AuthのUUIDが`admin_users.user_id`に存在するかをRLSで確認します。

## 管理操作

- `/admin/login`: メール＋パスワードでログイン
- `/admin`: 一覧、公開切替、上下ボタンでの並び替え、削除、公開プレビュー、ログアウト
- `/admin/posters/new`: 画像付きポスター作成
- `/admin/posters/[id]/edit`: 情報・画像の編集

削除時はStorage画像を先に削除し、成功した場合だけDB行を削除します。画像差し替えは新画像を保存し、DB更新成功後に旧画像を削除します。同名ファイルは使用せず、`ユーザーUUID/ランダムUUID.拡張子`で保存します。

## テスト

通常の検証:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

ブラウザE2E（デスクトップ幅とPixel 7相当）:

```bash
npx playwright install chromium
npm run test:e2e
```

公開ページのE2Eはサンプルモードで実行できます。実Supabaseで「ログイン → 作成 → 公開ページ表示 → 削除」まで実行する場合だけ、ローカルのシェルまたは`.env.local`（コミット禁止）へ次を設定します。

```env
E2E_ADMIN_EMAIL=chappy11@aioros.ocn.ne.jp
E2E_ADMIN_PASSWORD=ローカルだけに置く実パスワード
```

RLSのDBテストは [supabase/tests/database/rls.test.sql](supabase/tests/database/rls.test.sql) にあり、匿名ユーザー、非管理ログインユーザー、管理者の読み書きを確認します。Docker起動後に次を実行します。

```bash
npx supabase start
npx supabase test db
```

## Vercelへ公開

1. このリポジトリをGitHub等へpushします。`.env.local`は`.gitignore`対象です。
2. Vercel Dashboardで **Add New → Project** を選び、リポジトリをImportします。
3. Framework PresetがNext.jsであることを確認します。
4. **Environment Variables** に`NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`を追加します。Production、Preview、Developmentの必要な環境を選びます。
5. Supabase Dashboardの **Authentication → URL Configuration** で、Site URLにVercelのURL（例: `https://oshimaru-xxxx.vercel.app`）を設定します。
6. Deployを実行します。独自ドメインは不要で、Deployment完了画面に表示される `*.vercel.app` URLが公開URLです。
7. `/`で公開ポスター、`/admin/login`で管理ログインを確認します。

CLIを使う場合は、Vercelへログイン後に次でも公開できます。

```bash
npx vercel
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npx vercel --prod
```

## セキュリティ上の要点

- DBとStorageの両方でRLSを有効化。画面のルートガードだけに依存しません。
- `admin_users.user_id`を唯一の管理権限情報とし、ユーザーが編集できるmetadataやメール文字列を認可に使いません。
- private bucketを使用し、未公開・期間外画像は匿名Storageアクセスでも取得できません。
- MIME typeと8MB上限をクライアント入力、Server Action、Storage bucketで検証します。
- SVGはアップロード不可。レスポンスに`X-Content-Type-Options: nosniff`を付けます。
- service role key、パスワード、秘密鍵をアプリへ渡しません。
- 管理画面の日時は日本時間として入力・表示します。開始日時は含み、終了日時は含まない条件で、SQL RLSと表示を統一しています。

## 既知の制約

- MVPは単一ウォール・単一管理者想定です。複数店舗、広告主、投稿、コメント、決済はありません。
- 画像変換や自動圧縮は行いません。8MBまでのJPEG/PNG/WebPをそのまま保存します。
- 並び替えはアクセシブルな上下ボタン方式で、ドラッグ操作はありません。
- Storage削除成功後にDB削除だけが失敗する非常に稀な場合は、DB行の画像を再アップロードするか行をSQL Editorで削除する手動復旧が必要です。
- 管理フローE2EとRLS DBテストは、実Supabase認証情報またはローカルSupabase/Dockerがある環境でのみ実行されます。
