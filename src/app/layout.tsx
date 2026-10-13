import type { Metadata } from "next";
import Script from "next/script";

// Import Bootstrap and global styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE HOUSE OF WEAR | Premium Multi-Brand Men's Fashion",
  description: "Curated destination for the modern man, offering a collection of premium luxury labels defined by quality and timeless aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Bodoni+Moda:ital,wght@1,300;1,400&family=Pinyon+Script&display=swap"
          rel="stylesheet"
          precedence="default"
        />

        {/* Custom CSS */}
        <link rel="stylesheet" href="/static/css/style.css" precedence="default" />
      </head>
      <body>
        {children}

        {/* Bootstrap 5 JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
        {/* Custom JS */}
        <Script
          src="/static/js/main.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
