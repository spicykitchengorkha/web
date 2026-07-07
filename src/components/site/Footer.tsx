"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useSiteContent, useFeaturedItems } from "@/lib/cms";
import { motion } from "framer-motion";
import { TABELOG_RESERVATION_URL } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  MessageSquare,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const { t } = useApp();
  const { data: c = {} } = useSiteContent();
  const { data: featuredItems = [] } = useFeaturedItems();


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background text-foreground pt-20 pb-10 border-t border-border/60 mt-auto relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Brand Area */}
        <div className="lg:col-span-4 space-y-6">
          <Link href="/" className="flex items-center group">
            <img
              src="/assets/logo.png"
              alt="Spicy Kitchen Gorkha Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          <p className="text-xs text-foreground font-medium leading-relaxed">
            {c["footer.tagline"] ? t(c["footer.tagline"]) : t(
              "Authentic Nepalese & Indian cuisine crafted with passion and the finest ingredients.",
              "情熱と最高品質の食材から生み出される、本場ネパール・インド料理をご提供いたします。"
            )}
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href={c["social.facebook"] || "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-colors"
            >
              <Facebook size={13} />
            </a>
            <a
              href={c["social.instagram"] || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-pink-500 hover:bg-pink-500/10 transition-colors"
            >
              <Instagram size={13} />
            </a>
            <a
              href="https://wa.me/81930000000"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-[#2ECC71] hover:bg-[#2ECC71]/10 transition-colors"
            >
              <MessageSquare size={13} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-sky-400 hover:bg-sky-400/10 transition-colors"
            >
              <Twitter size={13} />
            </a>
          </div>
        </div>

        {/* Column 1: Quick Links */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-accent font-extrabold">
            {t("QUICK LINKS", "ナビゲーション")}
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-foreground">
            <li><Link href="/" className="hover:text-accent transition-colors">{t("Home", "ホーム")}</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors">{t("About Us", "店舗情報")}</Link></li>
            <li><Link href="/menu" className="hover:text-accent transition-colors">{t("Menu", "メニュー")}</Link></li>
            <li><a href={TABELOG_RESERVATION_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{t("Reservations", "席の予約")}</a></li>
            <li><Link href="/gallery" className="hover:text-accent transition-colors">{t("Gallery", "ギャラリー")}</Link></li>
            <li><Link href="/#events" className="hover:text-accent transition-colors">{t("Events", "イベント")}</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">{t("Contact", "お問い合わせ")}</Link></li>
          </ul>
        </div>

        {/* Column 2: Our Services */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-accent font-extrabold">
            {t("OUR SERVICES", "サービス内容")}
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-foreground select-none">
            <li className="hover:text-accent transition-colors">{t("Dine In", "イートイン")}</li>
            <li className="hover:text-accent transition-colors">{t("Takeaway", "テイクアウト")}</li>
            <li className="hover:text-accent transition-colors">{t("Catering", "ケータリング")}</li>
            <li className="hover:text-accent transition-colors">{t("Private Dining", "プライベート個室")}</li>
            <li className="hover:text-accent transition-colors">{t("Events", "貸切パーティ")}</li>
          </ul>
        </div>

        {/* Column 3: Popular Dishes */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-accent font-extrabold">
            {t("POPULAR DISHES", "人気のメニュー")}
          </h4>
          <ul className="space-y-2 text-xs font-semibold text-foreground">
            {featuredItems.length > 0 ? (
              featuredItems.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link href={`/menu#item-${item.id}`} className="hover:text-accent transition-colors block">
                    {t(item.name, item.jp_name)}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/menu" className="hover:text-accent transition-colors block">{t("Momo", "ネパール風小籠包モモ")}</Link></li>
                <li><Link href="/menu" className="hover:text-accent transition-colors block">{t("Sekuwa", "串焼きラムセクワ")}</Link></li>
                <li><Link href="/menu" className="hover:text-accent transition-colors block">{t("Biryani", "特製炊き込みビリヤニ")}</Link></li>
                <li><Link href="/menu" className="hover:text-accent transition-colors block">{t("Butter Chicken", "クリークリーミーバターチキン")}</Link></li>
                <li><Link href="/menu" className="hover:text-accent transition-colors block">{t("Thali Set", "伝統ネパールタセット")}</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-accent font-extrabold">
            {t("CONTACT US", "店舗アクセス")}
          </h4>
          <ul className="space-y-3.5 text-xs font-semibold text-foreground">
            <li className="flex gap-2">
              <MapPin size={13} className="text-accent shrink-0 mt-0.5" />
              <span>
                {c["contact.address_line1"] ? (
                  <>
                    {t(c["contact.address_line1"])}
                    {c["contact.address_line2"] && `, ${t(c["contact.address_line2"])}`}
                  </>
                ) : (
                  t("Minabhawan Road, Gorkha, Nepal", "北九州市八幡西区黒崎二丁目")
                )}
              </span>
            </li>
            <li className="flex gap-2">
              <Phone size={13} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                {c["contact.phone"] ? (
                  <a href={`tel:${c["contact.phone"].replace(/\s/g, "")}`} className="hover:text-accent transition-colors">
                    {c["contact.phone"]}
                  </a>
                ) : (
                  <>
                    <a href="tel:+81936214567" className="hover:text-accent transition-colors">+81 93-621-4567</a>
                    <a href="tel:+9779812345678" className="hover:text-accent transition-colors">+977 9812345678</a>
                  </>
                )}
              </div>
            </li>
            <li className="flex gap-2">
              <Mail size={13} className="text-accent shrink-0 mt-0.5" />
              <a href={`mailto:${c["contact.email"] || "spicykitchengorkha@gmail.com"}`} className="hover:text-accent transition-colors">
                {c["contact.email"] || "spicykitchengorkha@gmail.com"}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock size={13} className="text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span>
                  {t("Lunch", "ランチ")}: {c["hours.lunch"] || "11:30 – 14:00"}
                </span>
                <span>
                  {t("Dinner", "ディナー")}: {c["hours.dinner"] || "17:30 – 21:30"}
                </span>
                <span className="text-accent/90">
                  {t("Closed", "定休日")}: {t(c["hours.closed"] || "Tuesdays", "毎週火曜日")}
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Sub-Footer row */}
      <div className="max-w-7xl mx-auto px-6 border-t border-border/40 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-foreground">
        <p>© {new Date().getFullYear()} Spicy Kitchen Gorkha. All Rights Reserved.</p>
        
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-accent transition-colors">{t("Privacy Policy", "個人情報保護方針")}</Link>
          <span className="text-border/50">|</span>
          <Link href="/terms" className="hover:text-accent transition-colors">{t("Terms & Conditions", "利用規約")}</Link>
          <span className="text-border/50">|</span>
          <Link href="/auth" className="hover:text-accent transition-colors">
            {t("Staff Login", "スタッフログイン")}
          </Link>
        </div>
        {/* Back to top styled like the scroll indicator */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 select-none group focus:outline-none transition-transform hover:-translate-y-1 active:translate-y-0 ml-auto md:ml-0"
          aria-label="Back to top"
        >
          <div className="w-5 h-9 rounded-full border-2 border-accent flex justify-center p-1.5">
            <motion.div
              animate={{ y: [12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-accent rounded-full"
            />
          </div>
          <span className="text-[7.5px] tracking-[0.4em] uppercase text-accent font-bold mt-1">TOP</span>
        </button>
      </div>
    </footer>
  );
}
