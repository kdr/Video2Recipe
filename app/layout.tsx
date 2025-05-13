import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video2Recipe - Convert YouTube Cooking Videos to Recipe Cards",
  description: "Transform any YouTube cooking video into a beautiful recipe card with ingredients and instructions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
