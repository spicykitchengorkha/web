import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentic Curry, Naan, Momos Menu | Spicy Kitchen Gorkha",
  description:
    "Explore our full menu featuring authentic Himalayan set meals (Thakali Thali), charcoal-grilled tandoori chicken, hand-stretched naan, and Nepalese momos.",
  alternates: {
    canonical: "/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
