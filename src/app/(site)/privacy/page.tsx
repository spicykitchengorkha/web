"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Shield, Lock, Eye, Mail, Phone, MapPin, FileText } from "lucide-react";

export default function PrivacyPage() {
  const { t } = useApp();

  const sections = [
    {
      icon: <Shield className="text-accent w-5 h-5" />,
      title: t("Compliance with Laws", "法令等の遵守"),
      content: t(
        "Spicy Kitchen Gorkha complies with the Act on the Protection of Personal Information (APPI) of Japan and other applicable laws and guidelines concerning the proper handling of personal information.",
        "スパイシーキッチン・ゴルカは、個人情報の保護に関する法律（個人情報保護法）その他の関係法令、国が定める指針およびその他の規範を遵守し、個人情報の適正な取扱いに努めます。"
      )
    },
    {
      icon: <Eye className="text-accent w-5 h-5" />,
      title: t("Collection of Information", "個人情報の収集方法"),
      content: t(
        "We collect personal information (such as name, email address, phone number, and reservation details) through fair and lawful means, primarily when you make a reservation or contact us via our website or telephone.",
        "当店は、お客様がウェブサイトからのご予約、お問い合わせ、またはお電話の際、適正かつ公正な手段によって、氏名、メールアドレス、電話番号、ご予約日時などの個人情報を収集いたします。"
      )
    },
    {
      icon: <FileText className="text-accent w-5 h-5" />,
      title: t("Purpose of Use", "個人情報の利用目的"),
      content: t(
        "We use the collected personal information for: managing reservations and seating, responding to inquiries, delivering updates or promotional offers (where permitted), and improving our website and customer service.",
        "収集した個人情報は、以下の目的のみで利用いたします：ご予約・お席の管理、お問い合わせへの回答、新メニューやキャンペーン等のご案内（同意がある場合）、サービス向上のための統計分析。"
      )
    },
    {
      icon: <Lock className="text-accent w-5 h-5" />,
      title: t("Security & Data Protection", "安全管理措置"),
      content: t(
        "We implement strict technical and organizational security measures, including SSL/TLS encryption for online submissions, to protect your personal data against unauthorized access, loss, alteration, or disclosure.",
        "当店は、お預かりした個人情報の漏洩、紛失、改ざんを防ぐため、SSL/TLS暗号化通信の導入やアクセス権限の制限など、厳格な安全管理措置を講じています。"
      )
    },
    {
      icon: <Shield className="text-accent w-5 h-5" />,
      title: t("Third-Party Disclosure", "第三者への提供について"),
      content: t(
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your explicit consent, except when required by law or to complete essential booking operations (e.g., booking partner systems).",
        "当店は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供・開示することはありません（予約処理等の業務委託先を除く）。"
      )
    },
    {
      icon: <FileText className="text-accent w-5 h-5" />,
      title: t("Rights of the Individual", "開示・訂正・削除のご請求"),
      content: t(
        "You have the right to request access to, correction of, or deletion of your personal data. Please contact us using the details below, and we will promptly respond to your request in accordance with applicable regulations.",
        "お客様は、ご自身の個人情報の開示、訂正、追加または削除を請求することができます。ご希望の場合は、下記の窓口までご連絡ください。速やかに対応いたします。"
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER HERO */}
      <div className="relative py-24 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Data Protection", "セキュリティ")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("Privacy Policy", "個人情報保護方針")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "How Spicy Kitchen Gorkha handles, protects, and respects your personal data in accordance with Japanese regulations.",
              "スパイシーキッチン・ゴルカにおける、お客様の個人情報の取り扱い、管理体制、および法令遵守に関する規定。"
            )}
          </p>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="grid gap-8">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-card/30 border border-border/20 p-6 rounded-sm space-y-3 hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 border border-accent/20 rounded-sm">
                  {sec.icon}
                </div>
                <h3 className="font-serif text-lg text-foreground font-semibold">
                  {sec.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-relaxed font-light pl-1">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* CONTACT INFORMATION */}
        <div className="mt-16 bg-muted/5 border border-border/30 p-8 rounded-sm text-center space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl text-foreground font-bold">
              {t("Privacy Inquiries", "お問い合わせ窓口")}
            </h3>
            <p className="text-xs text-muted-foreground/80 max-w-lg mx-auto font-light">
              {t(
                "If you have questions regarding this Privacy Policy or wish to request data deletion, please contact us:",
                "個人情報の取扱いに関するご質問、または開示・訂正・削除のご請求は、下記までご連絡ください。"
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4 text-xs font-semibold text-foreground">
            <div className="flex flex-col items-center gap-2 p-4 border border-border/20 rounded-sm">
              <Phone size={16} className="text-accent" />
              <span>+81 93-621-4567</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-border/20 rounded-sm">
              <Mail size={16} className="text-accent" />
              <a href="mailto:spicykitchengorkha@gmail.com" className="hover:text-accent transition-colors">
                spicykitchengorkha@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border border-border/20 rounded-sm">
              <MapPin size={16} className="text-accent" />
              <span className="text-center font-light">
                {t(
                  "Kurosaki, Kitakyushu, Fukuoka, Japan",
                  "福岡県北九州市八幡西区黒崎二丁目"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
