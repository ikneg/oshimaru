"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
export function ActionSubmit({ idle, pending = "処理中…", className }: { idle: string; pending?: string; className?: string }) {
  const status = useFormStatus();
  return <Button type="submit" disabled={status.pending} aria-disabled={status.pending} className={className}>{status.pending ? pending : idle}</Button>;
}
