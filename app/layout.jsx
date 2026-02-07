import { Inter, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const josefin = Josefin_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata = {
  title: "Be My Valentine?",
  description: "Please say yes... 🥺👉👈",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${josefin.variable} antialiased selection:bg-pink-200 selection:text-pink-900`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
