import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/data";

const display = Dela_Gothic_One({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["cyrillic", "latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${business.name} — піца з печі | Київ, Оболонь`,
  description: `Піцерія «${business.name}»: 8 піц 30 і 40 см, конструктор власної піци, закуски й напої. Замовлення онлайн, доставка та самовивіз.`,
  openGraph: {
    title: `${business.name} — піца з печі`,
    description: "Гаряча. Тягуча. Твоя. Замовляйте онлайн або зберіть свою піцу.",
    locale: "uk_UA",
    siteName: business.name,
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#140f0d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
