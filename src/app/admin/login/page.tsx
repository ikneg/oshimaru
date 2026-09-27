import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { WinTitlebar } from "@/components/win95-chrome";
import { requireAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminLoginPage() {
  if (await requireAdmin()) redirect("/admin");
  const configured = isSupabaseConfigured();
  return <main className="flex min-h-screen items-center justify-center bg-[#c0c0c0] p-4">
    <section className="win-window w-full max-w-[460px]"><WinTitlebar><h1>ネットワーク パスワードの入力</h1></WinTitlebar><div className="p-5 sm:p-6">
      <div className="mb-5 flex gap-5"><span className="win-key-icon" aria-hidden="true" /><div className="win-dialog-copy"><p className="font-bold">oshimaru 管理</p><p className="mt-1">管理者の電子メール アドレスとパスワードを入力してください。</p></div></div>
      <div className="win-separator mb-5" />
      {configured ? <LoginForm /> : <div role="alert" className="space-y-3"><p className="font-bold">Supabaseが未設定です。</p><p>`README.md` の手順で `.env.local` を設定するとログインできます。公開ページはサンプル表示で確認できます。</p></div>}
    </div></section>
  </main>;
}
