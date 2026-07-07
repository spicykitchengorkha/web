"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { useSiteContent } from "@/lib/cms";
import { MapPin, Phone, Mail, Clock, Train, ArrowRight, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const { t } = useApp();
  const { data: c = {} } = useSiteContent();

  const phoneRaw = (c["contact.phone"] || "+81 93-000-0000").replace(/\s/g, "");
  const emailRaw = c["contact.email"] || "info@spicykitchengorkha.com";

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HEADER HERO */}
      <div className="relative py-24 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Connect With Us", "お問い合わせ・アクセス")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("We Welcome Your Visit", "ご来店をお待ちしております")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Five minutes on foot from JR Kurosaki Station (West Exit). Same-day booking requests should be made directly via phone.",
              "JR黒崎駅（西口）から徒歩5分。当日のご予約はお電話にて承っております。"
            )}
          </p>
        </div>
      </div>

      {/* CORE DETAILS ROW */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        
        {/* Contact Info Cards */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-8">
            
            {/* Address */}
            <div className="flex gap-5 pb-6 border-b border-border/20">
              <div className="shrink-0 h-10 w-10 border border-accent/40 text-accent flex items-center justify-center rounded-sm bg-muted/10">
                <MapPin size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-bold">{t("Location", "住所")}</span>
                <h4 className="font-serif text-lg text-foreground font-bold">{t("Address")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {t(c["contact.address_line1"] || "1-chome, Kurosaki, Yahatanishi-ku")}
                  <br />
                  {t(c["contact.address_line2"] || "Kitakyushu, Fukuoka")}
                  <br />
                  {t(c["contact.address_line3"] || "Japan 806-0021")}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-5 pb-6 border-b border-border/20">
              <div className="shrink-0 h-10 w-10 border border-accent/40 text-accent flex items-center justify-center rounded-sm bg-muted/10">
                <Phone size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-bold">{t("Call Us", "電話")}</span>
                <h4 className="font-serif text-lg text-foreground font-bold">{t("Phone")}</h4>
                <a
                  href={`tel:${phoneRaw}`}
                  className="text-xs text-accent hover:text-foreground hover:underline transition-colors block font-light pt-1"
                >
                  {c["contact.phone"] || "+81 93-000-0000"}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5 pb-6 border-b border-border/20">
              <div className="shrink-0 h-10 w-10 border border-accent/40 text-accent flex items-center justify-center rounded-sm bg-muted/10">
                <Mail size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-bold">{t("Email", "メール")}</span>
                <h4 className="font-serif text-lg text-foreground font-bold">{t("Email")}</h4>
                <a
                  href={`mailto:${emailRaw}`}
                  className="text-xs text-accent hover:text-foreground hover:underline transition-colors block font-light pt-1"
                >
                  {emailRaw}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-5 pb-6 border-b border-border/20">
              <div className="shrink-0 h-10 w-10 border border-accent/40 text-accent flex items-center justify-center rounded-sm bg-muted/10">
                <Clock size={18} />
              </div>
              <div className="space-y-2 flex-1">
                <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-bold">{t("Opening Hours", "営業時間")}</span>
                <h4 className="font-serif text-lg text-foreground font-bold">{t("Hours")}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-light max-w-xs pt-1">
                  <span>{t("Lunch", "ランチ")}</span>
                  <span>{c["hours.lunch"] || "11:30 – 14:00"}</span>
                  <span>{t("Dinner", "ディナー")}</span>
                  <span>{c["hours.dinner"] || "17:30 – 21:30"}</span>
                  <span className="text-[#C0392B] font-semibold">{t("Closed", "定休日")}</span>
                  <span className="text-[#C0392B] font-semibold">{t(c["hours.closed"] || "Tuesdays", "毎週火曜日")}</span>
                </div>
              </div>
            </div>

            {/* Access */}
            <div className="flex gap-5">
              <div className="shrink-0 h-10 w-10 border border-accent/40 text-accent flex items-center justify-center rounded-sm bg-muted/10">
                <Train size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-bold">{t("Transit", "交通手段")}</span>
                <h4 className="font-serif text-lg text-foreground font-bold">{t("Access")}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {t(
                    c["contact.access"] || "5-minute walk from JR Kurosaki Station West Exit. Right across Kurosaki shopping street."
                  )}
                </p>
              </div>
            </div>

          </div>

          {/* Quick Direct Link CTAs */}
          <div className="pt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${phoneRaw}`}
              className="px-6 py-3.5 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-sm hover:opacity-90 shadow-md"
            >
              {t("Call Now", "今すぐ電話する")}
            </a>
            <a
              href="https://wa.me/81930000000"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 border border-[#FAF8F5]/30 hover:border-accent text-foreground hover:text-accent font-semibold text-xs tracking-wider uppercase rounded-sm flex items-center gap-1.5 transition-all"
            >
              <MessageSquare size={13} />
              <span>{t("WhatsApp Chat", "ワッツアップで聞く")}</span>
            </a>
          </div>
        </div>

        {/* Dynamic Embedded Map */}
        <div className="relative overflow-hidden aspect-video lg:aspect-auto border border-border shadow-md rounded-sm min-h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.6094627443916!2d130.76348981521128!3d33.8610539806587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3543c723f5b77ea7%3A0xe54d9c792de9cf7!2zSmUgS3Vyb3Nha2kgU3RhdGlvbg!5e0!3m2!1sen!2sjp!4v1650000000000!5m2!1sen!2sjp"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Spicy Kitchen Gorkha Map Location"
          ></iframe>
        </div>

      </div>

    </div>
  );
}
