"use client";
import { Button } from "@/components/ui/button";
export function ConfirmSubmit({ label, question }: { label: string; question: string }) {
  return <Button type="submit" variant="destructive" onClick={(event) => { if (!window.confirm(question)) event.preventDefault(); }}>{label}</Button>;
}
