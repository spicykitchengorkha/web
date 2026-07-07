import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Access Map | Spicy Kitchen Gorkha Kitakyushu",
  description:
    "Find us in Kurosaki, Kitakyushu (5 mins walk from JR Kurosaki Station). Phone number, interactive map, parking options, and business hours.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
