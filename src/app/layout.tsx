import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "oshimaru", template: "%s | oshimaru" },
  description: "街のポスターを眺めるデジタル広告ウォール",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
