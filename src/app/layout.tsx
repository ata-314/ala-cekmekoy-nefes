import type { Metadata, Viewport } from "next";
import { Mona_Sans, Playfair_Display } from "next/font/google";
import { seo, identity } from "@/content/project";
import "./globals.css";

/* Corporate type (kurumsal kimlik): Mona Sans is the primary typeface.
   The auxiliary display serif "The Season" is a licensed font we don't ship;
   Playfair Display stands in behind it — drop the real files into
   public/assets/fonts + an @font-face and the stack picks them up first. */
const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin", "latin-ext"],
});

const season = Playfair_Display({
  variable: "--font-season",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: "tr_TR",
    type: "website",
    siteName: identity.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#00012e",
  width: "device-width",
  initialScale: 1,
  /* Edge-to-edge on notched phones; fixed elements pad with safe-area env(). */
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${mona.variable} ${season.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
