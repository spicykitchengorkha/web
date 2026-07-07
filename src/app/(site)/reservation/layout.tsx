import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Table Online | Spicy Kitchen Gorkha Kurosaki",
  description:
    "Reserve your table online at Spicy Kitchen Gorkha for a calm, candlelit dining experience. Ideal for dinner dates, families, and private events.",
  alternates: {
    canonical: "/reservation",
  },
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
