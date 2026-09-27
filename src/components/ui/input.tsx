import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("win-inset min-h-11 w-full bg-white px-3 py-2 text-base text-black disabled:bg-[#dfdfdf]", className)} {...props} />;
}
