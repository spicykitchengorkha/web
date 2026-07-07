import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Spicy Kitchen Gorkha",
  description:
    "Terms and conditions for table bookings, online orders, and customer service.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
