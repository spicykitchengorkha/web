"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useSiteContent } from "@/lib/cms";
import { Globe, Menu, X, Sun, Moon, Phone, Calendar, LogIn } from "lucide-react";
import { TABELOG_RESERVATION_URL } from "@/lib/constants";

export default function Navbar() {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    t,
  } = useApp();
  
  const pathname = usePathname();
  const { data: c = {} } = useSiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const phoneDisplay = c["contact.phone"] || "+977 9812345678";
  const phoneRaw = phoneDisplay.replace(/\s/g, "");

  const navLinks = [
    { name: "Home", link: "/", jp: "ホーム" },
    { name: "Menu", link: "/menu", jp: "メニュー" },
    { name: "Gallery", link: "/gallery", jp: "ギャラリー" },
    { name: "About", link: "/about", jp: "私たちについて" },
    { name: "Contact", link: "/contact", jp: "お問い合わせ" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const close = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 text-foreground ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border py-4"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <img
            src="/assets/logo.png"
            alt="Spicy Kitchen Gorkha Logo"
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links + Book Table */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative text-[11px] font-medium tracking-[0.25em] uppercase transition-colors py-2 ${
                  isActive ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"
                }`}
              >
                {language === "ja" ? item.jp : item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.2px] bg-accent rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Book Table — sits right after Contact in the nav row */}
          <a
            href={TABELOG_RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2 border border-accent text-accent hover:bg-accent hover:text-[#111] font-bold text-[10px] tracking-wider uppercase rounded-full transition-all"
          >
            <Calendar size={12} />
            <span>{t("Book Table", "席を予約する")}</span>
          </a>
        </nav>

        {/* Right: Theme + Language only */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Language Selection */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-foreground/35 hover:bg-foreground/5 text-[9px] tracking-[0.1em] font-medium transition-colors text-foreground uppercase"
          >
            <Globe size={12} className="text-accent" />
            <span>{language === "ja" ? "EN" : "日本語"}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Slide-in Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[280px] bg-[#0e0e14] border-l border-white/[0.07] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Spicy Kitchen Gorkha Logo"
              className="h-9 w-auto object-contain"
            />
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-600 font-bold px-3 mb-3">Navigation</p>
          {navLinks.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={close}
                className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    : "hover:bg-white/[0.04] border border-transparent text-zinc-300 hover:text-white"
                }`}
              >
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase">
                  {language === "ja" ? item.jp : item.name}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-white/[0.06]" />

        {/* Bottom Actions */}
        <div className="px-4 py-5 space-y-3">
          {/* Book Table */}
          <a
            href={TABELOG_RESERVATION_URL}
            onClick={close}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#111] font-bold text-[11px] tracking-widest uppercase transition-colors"
          >
            <Calendar size={14} />
            <span>{t("Book a Table", "席を予約する")}</span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${phoneRaw}`}
            onClick={close}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.07] text-zinc-300 font-semibold text-[11px] tracking-wider uppercase transition-colors"
          >
            <Phone size={14} className="text-amber-500" />
            <span>{phoneDisplay}</span>
          </a>

          {/* Staff Login */}
          <Link
            href="/auth"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-transparent hover:bg-white/[0.03] border border-white/[0.05] text-zinc-600 hover:text-zinc-400 font-medium text-[10px] tracking-widest uppercase transition-colors"
          >
            <LogIn size={12} />
            <span>{t("Staff Login", "スタッフログイン")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

