import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { requireAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminLoginPage() {
  if (await requireAdmin()) redirect("/admin");
  const configured = isSupabaseConfigured();
  return <main className="desktop-pattern flex min-h-screen items-center justify-center p-4">
    <section className="win-window w-full max-w-md"><h1 className="win-titlebar">oshimaru 管理者ログイン</h1><div className="p-6">
      {configured ? <LoginForm /> : <div role="alert" className="space-y-3"><p className="font-bold">Supabaseが未設定です。</p><p>`README.md` の手順で `.env.local` を設定するとログインできます。公開ページはサンプル表示で確認できます。</p></div>}
    </div></section>
  </main>;
}
