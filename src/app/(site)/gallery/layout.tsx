import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery & Dining Ambiance | Spicy Kitchen Gorkha",
  description:
    "Take a visual tour of our calm, candlelit dining room in Kurosaki and view our beautifully plated Nepalese and Indian dishes.",
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
