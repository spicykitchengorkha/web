"use client";

import { useApp } from "@/context/AppContext";
import { resolveImage } from "@/lib/asset-map";
import { Sparkles, Leaf, Flame, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const { t, language } = useApp();

  const timeline = [
    {
      year: "2008",
      title: "The Dream in Kurosaki",
      jp_title: "黒崎での創業",
      desc: "Spicy Kitchen Gorkha opened its doors in a cozy corner of Kurosaki, bringing the first authentic charcoal tandoor oven to the district.",
      jp_desc: "北九州市八幡西区黒崎の一角に、本場のタンドール窯を備えた「スパイシーキッチン・ゴルカ」を開店しました。"
    },
    {
      year: "2014",
      title: "Himalayan Spice Sourcing",
      jp_title: "ヒマラヤ原生スパイスの直輸入",
      desc: "Partnered directly with spice farmers in Nepal to source wild-harvested herbs, cumin, and cardamom for authentic taste.",
      jp_desc: "ネパールの契約農家と提携し、ヒマラヤの高地で有機栽培されたスパイスやハーブの直接仕入れを開始しました。"
    },
    {
      year: "2020",
      title: "Modern Fine Dining Expansion",
      jp_title: "店舗リニューアル・伝統の再定義",
      desc: "Redesigned our dining space into a candlelit retreat while expanding our menu to include traditional Thakali Platter sets.",
      jp_desc: "店内をキャンドルが灯るモダンでラグジュアリーな空間へ改装し、ネパールの伝統『タカリセット』などの提供を開始。"
    },
    {
      year: "2026",
      title: "A Masterclass Redesign",
      jp_title: "世界基準の体験へ",
      desc: "Completely modernized our operations, launching premium online ordering and table booking systems for high guest convenience.",
      jp_desc: "オンライン予約およびモバイル注文システムを導入。より利便性の高い美食体験へと進化を続けています。"
    }
  ];

  const pillars = [
    {
      icon: <Leaf className="text-accent w-6 h-6" />,
      title: "Organic Herbs",
      jp_title: "有機スパイス",
      desc: "We ground our spice mixtures by hand inside clay pots every morning. No artificial food coloring or preservatives.",
      jp_desc: "化学調味料や着色料は一切不使用。毎朝、石臼とすり鉢で挽く新鮮な生スパイスにこだわっています。"
    },
    {
      icon: <Flame className="text-accent w-6 h-6" />,
      title: "Charcoal Clay Tandoor",
      jp_title: "備長炭タンドール",
      desc: "Our high-temperature clay oven sears marinated meats quickly, sealing juices while adding a delicate smokiness.",
      jp_desc: "炭火の超高温で焼き上げるタンドール窯。表面はパリッと香ばしく、中は驚くほどジューシーに仕上げます。"
    },
    {
      icon: <ShieldCheck className="text-accent w-6 h-6" />,
      title: "Halal Clean Sourcing",
      jp_title: "100% ハラール認証肉",
      desc: "All poultry and lamb used in our kitchen are 100% Halal certified, adhering to clean and ethical preparation practices.",
      jp_desc: "使用する鶏肉・羊肉はすべて100%ハラール認証を取得。徹底してクリーンかつ倫理的に調理されています。"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HEADER HERO */}
      <div className="relative py-24 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Our Legacy", "私たちの物語")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("Spices, Fire, and Patient Cooking", "炭火とスパイスに込める情熱")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Spicy Kitchen Gorkha is built on the philosophy of preserving ancient Nepalese recipes while providing world-class hospitality in Fukuoka.",
              "伝統あるネパールの家庭レシピを守り抜き、北九州の地で世界基準の温かなおもてなしを提供すること。それがゴルカの信念です。"
            )}
          </p>
        </div>
      </div>

      {/* STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light leading-tight">
            {t("A Sanctuary of Taste in Kurosaki", "黒崎に生まれたヒマラヤの隠れ家")}
          </h2>
          <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
            {t(
              "Founded in 2008, Spicy Kitchen Gorkha began as a small vision: to capture the unhurried dinner experience of Kathmandu. We brought our heavy clay ovens and customized charcoal ventilation to Fukuoka to cook dishes the way they've been prepared for generations.",
              "2008年、ネパール高地ののどかなディナー体験を日本で表現したいという小さな夢から始まりました。本物の重厚な粘土製タンドール窯と、特別設計の炭火吸気システムを福岡に導入し、数世代にわたり受け継がれてきた伝統製法を再現しています。"
            )}
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
            {t(
              "Rather than adapting to commercial shortcuts, our curries are thickened using slow-simmered onions and raw pureed spices. Every naan is stretched by hand and baked to order, appearing hot and blistered on your table.",
              "化学的なとろみ成分や市販のルウは使用せず、丸一日かけて煮込んだタマネギとハーブのみでカレーにコクを与えています。ナンはご注文が入るたびに手延べし、窯に入れてその場で焼き上げます。"
            )}
          </p>
        </div>
        <div>
          <img
            src="/assets/interior.jpg"
            alt="Candlelit seating"
            className="w-full aspect-[4/3] object-cover rounded-md shadow-lg border border-border/20"
          />
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="bg-card/40 border-y border-border/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground font-light">
              {t("Our Culinary Standards", "私たちのこだわり")}
            </h3>
            <p className="text-xs text-muted-foreground/75 font-light">
              {t("Three promises that make Spicy Kitchen one of the best in Japan.", "ゴルカが最高の一皿をお届けするための、3つの約束。")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <div key={i} className="bg-background border border-border/30 p-8 rounded-sm space-y-4">
                <div className="p-3 bg-accent/10 border border-accent/20 inline-block rounded-sm">
                  {p.icon}
                </div>
                <h4 className="font-serif text-lg text-foreground font-semibold">
                  {language === "ja" ? p.jp_title : p.title}
                </h4>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-light">
                  {language === "ja" ? p.jp_desc : p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET THE CHEF */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <img
            src="/assets/chef.jpg"
            alt="Head Chef"
            className="w-full aspect-[4/5] object-cover rounded-md shadow-2xl"
          />
        </div>
        <div className="space-y-6">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Master Culinary Artist", "料理長紹介")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light">
            {t("Chef Jaaditya Jaiswal", "シェフ ジャアディティヤ・ジャイスワル")}
          </h2>
          <div className="h-[1px] w-20 bg-accent/40 my-4" />
          
          <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
            {t(
              "Born in Lalitpur, Nepal, Chef Jaiswal spent over a decade honing his craft inside fine tandoor houses in Kathmandu and Mumbai. His philosophy is simple: fire and spice require patience. He refuses to rush clay baking, stating that charcoal embers provide a distinct warmth that cannot be replicated by modern gas burners.",
              "ネパールの古都ラリトプル出身。カトマンズやムンバイの有名ホテルや名門タンドール店で10年以上にわたり腕を磨きました。「火とスパイスには忍耐が必要」というシンプルな哲学のもと、ガス窯を一切使わず、炭火の残り火が放つ独特の赤外線熱でじっくり火を通す製法を貫いています。"
            )}
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed font-light italic">
            &ldquo;{t("Spices are not just for heat; they are for depth. A good curry should comfort your body and soothe your mind.", "スパイスは単に辛くするものではなく、料理に奥行きを与えるもの。美味しいカレーは身体を温め、心までほぐしてくれるものです。")}&rdquo;
          </p>
        </div>
      </section>

      {/* HISTORY TIMELINE */}
      <section className="bg-muted/10 border-t border-border/20 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-serif text-2xl md:text-3xl text-center text-foreground font-light mb-16">
            {t("Our Historical Journey", "これまでの歩み")}
          </h3>

          <div className="relative border-l border-accent/20 ml-4 md:ml-32 space-y-12">
            {timeline.map((item, i) => (
              <div key={i} className="relative pl-8 md:pl-12">
                {/* Year tag left */}
                <div className="absolute left-[-20px] md:left-[-120px] top-1.5 md:w-24 text-left md:text-right">
                  <span className="font-serif text-xl md:text-2xl text-accent font-semibold">{item.year}</span>
                </div>

                {/* Counter Dot */}
                <div className="absolute left-[-6px] top-3.5 w-3 h-3 rounded-full bg-accent border-2 border-background" />

                <div className="space-y-1">
                  <h4 className="font-serif text-base text-foreground font-bold">
                    {language === "ja" ? item.jp_title : item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-light max-w-2xl">
                    {language === "ja" ? item.jp_desc : item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
