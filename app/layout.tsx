import type { Metadata, Viewport } from "next";
import { Nunito, Unbounded } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/data";

const heading = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});
const body = Nunito({
  subsets: ["cyrillic", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${business.name} — піца з печі з доставкою | Київ`,
  description: `Піцерія «${business.name}»: піца 30 і 40 см, закуски та напої. Замовлення онлайн, доставка по району.`,
  openGraph: {
    title: `${business.name} — піца з печі`,
    description: business.tagline,
    locale: "uk_UA",
    siteName: business.name,
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#d6362b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
