"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Scale, Calendar, AlertOctagon, HelpCircle, Shield, FileText } from "lucide-react";

export default function TermsPage() {
  const { t } = useApp();

  const sections = [
    {
      icon: <Scale className="text-accent w-5 h-5" />,
      title: t("Agreement to Terms", "利用規約への同意"),
      content: t(
        "By accessing and using this website, or placing reservations, you agree to be bound by these Terms and Conditions and all applicable laws in Japan. If you do not agree, please refrain from using our online services.",
        "当ウェブサイトのご利用、またはオンライン予約のご利用にあたっては、本規約および日本国内の適用法令に同意いただいたものとみなします。同意いただけない場合は、ご利用をお控えください。"
      )
    },
    {
      icon: <Calendar className="text-accent w-5 h-5" />,
      title: t("Reservations & Cancellations", "ご予約・キャンセルについて"),
      content: t(
        "Reservations made online are subject to confirmation. Please notify us of any cancellations or group size changes at least 24 hours prior to your scheduled time. In case of no-shows or late cancellations, we reserve the right to restrict future reservations.",
        "オンラインでのご予約は、店舗からの確定通知をもって完了します。人数変更やキャンセルは、ご予約日時の24時間前までにご連絡ください。無断キャンセルや直前のキャンセルが続く場合、以後のご予約をお断りすることがあります。"
      )
    },
    {
      icon: <FileText className="text-accent w-5 h-5" />,
      title: t("Intellectual Property", "知的財産権"),
      content: t(
        "All content on this website, including texts, images, logos, graphics, and menu designs, is the property of Spicy Kitchen Gorkha and protected by intellectual property laws of Japan. Unauthorized reuse or reproduction is strictly prohibited.",
        "当サイトに掲載されている文章、画像、ロゴ、デザイン、メニュー情報等の著作権およびその他の権利は、すべてスパイシーキッチン・ゴルカに帰属します。無断転載・複製・二次利用は固く禁止いたします。"
      )
    },
    {
      icon: <AlertOctagon className="text-accent w-5 h-5" />,
      title: t("Prohibited Activities", "禁止事項"),
      content: t(
        "Users are prohibited from: submitting false booking details, attempting to disrupt the server or website functionality, scraping content, or engaging in any activity that violates public order, morals, or Japanese law.",
        "ユーザーは以下の行為を行ってはなりません：虚偽の情報による予約、サイトへの不正アクセスやシステム妨害、データ収集等の目的でのスクレイピング、その他公序良俗または法令に違反する一切の行為。"
      )
    },
    {
      icon: <HelpCircle className="text-accent w-5 h-5" />,
      title: t("Disclaimers & Allergies", "免責事項・アレルギー"),
      content: t(
        "We strive to ensure menu details and prices are accurate, but reserves the right to update items without notice. While we accommodate dietary requirements, patrons with severe allergies must note that cross-contamination may occur, and they assume personal responsibility.",
        "メニュー内容や価格等は予告なく変更される場合があります。アレルギー対応には細心の注意を払っておりますが、調理器具等を共有するためコンタミュニケーションの可能性を完全に排除できません。アレルギーをお持ちのお客様は最終的なご判断をお願いいたします。"
      )
    },
    {
      icon: <Shield className="text-accent w-5 h-5" />,
      title: t("Governing Law & Jurisdiction", "準拠法・管轄裁判所"),
      content: t(
        "These Terms and Conditions are governed by and construed in accordance with the laws of Japan. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the Fukuoka District Court.",
        "本利用規約の解釈および適用は、日本国法に準拠するものとします。当サイトのご利用に関連して生じる一切の紛争については、福岡地方裁判所を第一審の専属的合意管轄裁判所とします。"
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
            {t("Legal Agreement", "規約と方針")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("Terms & Conditions", "利用規約")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Rules, guidelines, and terms of service for utilizing the website and dining services of Spicy Kitchen Gorkha.",
              "スパイシーキッチン・ゴルカのウェブサイトおよび各種サービスをご利用いただく際の規約とガイドライン。"
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

        {/* REVISIONS NOTICE */}
        <div className="mt-12 text-center text-xs text-muted-foreground/60 font-light">
          {t(
            "Last updated: July 2026. Spicy Kitchen Gorkha reserves the right to modify these terms at any time.",
            "最終改訂日：2026年7月。本利用規約は予告なく改定される場合がありますので、予めご了承ください。"
          )}
        </div>
      </div>
    </div>
  );
}
