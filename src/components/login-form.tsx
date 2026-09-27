"use client";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { ActionSubmit } from "@/components/action-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const initial: ActionState = { ok: false, message: "" };
export function LoginForm() {
  const [state, action] = useActionState(loginAction, initial);
  return <form action={action} className="space-y-5">
    <div><Label htmlFor="email">メールアドレス</Label><Input id="email" name="email" type="email" autoComplete="username" required /></div>
    <div><Label htmlFor="password">パスワード</Label><Input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {state.message && <p role="alert" className="win-inset bg-white p-3 text-red-800">{state.message}</p>}
    <ActionSubmit idle="ログイン" pending="ログイン中…" />
  </form>;
}
