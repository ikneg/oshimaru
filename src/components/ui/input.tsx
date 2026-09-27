import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("win-inset min-h-11 w-full bg-white px-2 py-2 text-sm text-black selection:bg-[#000080] selection:text-white disabled:bg-[#dfdfdf]", className)} {...props} />;
}
