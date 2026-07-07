import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Curry & Naan Takeaway Online | Spicy Kitchen Gorkha",
  description:
    "Order online for fast hot takeaway. Pick up fresh curries, tandoori grill, and warm naan from our Kurosaki kitchen.",
  alternates: {
    canonical: "/order",
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
