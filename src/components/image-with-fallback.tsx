"use client";

/* Uploaded poster dimensions are not known until the private image is loaded. */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ImageWithFallback({ src, alt, className, priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={`${alt}（画像を読み込めませんでした）`} className={cn("flex min-h-48 items-center justify-center bg-white p-6 text-center font-bold", className)}>画像を読み込めませんでした</div>;
  return <img src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} onError={() => setFailed(true)} />;
}
