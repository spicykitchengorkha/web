"use client";

import { useEffect } from "react";
import { TABELOG_RESERVATION_URL } from "@/lib/constants";
import { Calendar, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ReservationPage() {
  const { t } = useApp();

  useEffect(() => {
    // Perform redirection immediately using replace to avoid history back-loop traps
    window.location.replace(TABELOG_RESERVATION_URL);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative py-20 max-w-md w-full border border-border/20 rounded-lg bg-card/30 backdrop-blur-md shadow-2xl space-y-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.08),transparent_70%)]" />
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
          <Calendar className="text-accent w-7 h-7" />
          <Loader2 className="absolute text-accent w-12 h-12 animate-spin opacity-40" />
        </div>

        {/* Messaging */}
        <div className="space-y-3 relative z-10">
          <h1 className="font-serif text-xl font-light text-foreground tracking-wide">
            {t("Connecting to Tabelog...", "食べログへ接続中...")}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {t(
              "We are redirecting you to our official online table booking form.",
              "席予約のため、公式食べログオンライン予約フォームへ移動しています。"
            )}
          </p>
        </div>

        {/* Fallback Option */}
        <div className="pt-4 relative z-10">
          <a
            href={TABELOG_RESERVATION_URL}
            className="text-xs text-accent hover:underline tracking-wider uppercase font-semibold animate-pulse"
          >
            {t("Click here if not redirected", "自動で移動しない場合はこちら")} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
