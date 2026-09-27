import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("win-button inline-flex min-h-11 items-center justify-center gap-2 px-3 py-2 text-xs font-bold disabled:cursor-not-allowed", {
  variants: { variant: { default: "", destructive: "text-[#800000]", compact: "min-h-10 px-2 py-1" } },
  defaultVariants: { variant: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
