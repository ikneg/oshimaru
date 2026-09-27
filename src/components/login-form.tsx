"use client";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { ActionSubmit } from "@/components/action-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const initial: ActionState = { ok: false, message: "" };
export function LoginForm() {
  const [state, action] = useActionState(loginAction, initial);
  return <form action={action} className="space-y-4">
    <div className="grid items-center gap-2 sm:grid-cols-[112px_1fr]"><Label htmlFor="email">メール アドレス(E):</Label><Input id="email" name="email" aria-label="メールアドレス" type="email" autoComplete="username" required /></div>
    <div className="grid items-center gap-2 sm:grid-cols-[112px_1fr]"><Label htmlFor="password">パスワード(P):</Label><Input id="password" name="password" aria-label="パスワード" type="password" autoComplete="current-password" required /></div>
    {state.message && <p role="alert" className="win-inset bg-white p-3 font-bold text-black">{state.message}</p>}
    <div className="win-separator" /><div className="flex justify-end"><ActionSubmit idle="ログイン(O)" pending="ログイン中..." className="min-w-24" /></div>
  </form>;
}
