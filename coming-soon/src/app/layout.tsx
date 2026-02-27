import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-oswald",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Prime Clinics | Opening This Spring",
  description:
    "Step into your prime. Prime Clinics offers personalized solutions for physical health, hormone health, intimate health, regenerative aesthetics, weight management, mental fitness, and joint rehabilitation. Opening this spring — sign up to be the first to know.",
  keywords: [
    "Prime Clinics",
    "health clinic",
    "hormone health",
    "regenerative aesthetics",
    "weight management",
    "mental fitness",
    "physical health",
  ],
  openGraph: {
    title: "Prime Clinics | Opening This Spring",
    description:
      "Step into your prime. Solutions designed around you because confidence starts from within.",
    type: "website",
    siteName: "Prime Clinics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Clinics | Opening This Spring",
    description:
      "Step into your prime. Solutions designed around you because confidence starts from within.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${manrope.variable} font-manrope`}>
        {children}
      </body>
    </html>
  );
}
