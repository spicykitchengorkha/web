import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import QueryProvider from "@/context/QueryProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spicykitchengorkha.com"),
  alternates: {
    canonical: "/",
  },
  title: "Spicy Kitchen Gorkha — Authentic Nepalese & Indian in Kitakyushu",
  description:
    "A calm, candlelit dining room in Kurosaki serving authentic Nepalese & Indian cuisine — curry, tandoori, naan, momos, and Himalayan set meals.",
  keywords: [
    "Gorkha",
    "Spicy Kitchen",
    "Kitakyushu Restaurant",
    "Nepalese Curry",
    "Indian Food Kurosaki",
    "Himalayan Momo",
  ],
  openGraph: {
    title: "Spicy Kitchen Gorkha",
    description: "Authentic Nepalese & Indian flavors in Kurosaki, Kitakyushu.",
    url: "https://spicykitchengorkha.com",
    siteName: "Spicy Kitchen Gorkha",
    images: [
      {
        url: "/assets/hero-curry.jpg",
        width: 1200,
        height: 630,
        alt: "Spicy Kitchen Gorkha Signature Curry",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://spicykitchengorkha.com/#restaurant",
  "name": "Spicy Kitchen Gorkha",
  "image": [
    "https://spicykitchengorkha.com/assets/hero-curry.jpg",
    "https://spicykitchengorkha.com/assets/interior.jpg",
    "https://spicykitchengorkha.com/assets/logo.png"
  ],
  "url": "https://spicykitchengorkha.com",
  "telephone": "+81-93-621-4567",
  "priceRange": "¥1,000 - ¥3,000",
  "menu": "https://spicykitchengorkha.com/menu",
  "acceptsReservations": "true",
  "servesCuisine": ["Nepalese", "Indian", "Himalayan Curry", "Tandoori"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kurosaki 2-chome",
    "addressLocality": "Yahatananishi-ku, Kitakyushu",
    "addressRegion": "Fukuoka",
    "postalCode": "806-0021",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.8654,
    "longitude": 130.7656
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "11:30",
      "closes": "14:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "17:30",
      "closes": "21:30"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${playfair.variable} ${inter.variable} ${notoSerifJp.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <QueryProvider>
          <AppProvider>{children}</AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
