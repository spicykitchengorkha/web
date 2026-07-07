import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWidgets from "@/components/site/FloatingWidgets";
import CartDrawer from "@/components/site/CartDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[72px]">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingWidgets />
    </>
  );
}
