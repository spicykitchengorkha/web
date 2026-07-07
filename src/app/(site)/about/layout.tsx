import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Heritage & Chefs | Spicy Kitchen Gorkha",
  description:
    "Founded in 2008, Spicy Kitchen Gorkha serves authentic Nepalese & Indian cuisine cooked in traditional charcoal tandoors in Kurosaki, Kitakyushu.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
