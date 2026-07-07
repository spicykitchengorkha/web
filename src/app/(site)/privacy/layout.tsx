import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Spicy Kitchen Gorkha",
  description:
    "Read our privacy policy regarding order details, reservations, and personal data safety.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
