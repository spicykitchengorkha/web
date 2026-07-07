"use client";

import { useState, useMemo } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { useMenuCategories, useMenuItems } from "@/lib/cms";
import { resolveImage } from "@/lib/asset-map";
import { Search, Info, Plus, Minus, ChevronRight, X, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuPage() {
  const { t, language, addToCart } = useApp();
  const { data: categories = [] } = useMenuCategories();
  const { data: items = [] } = useMenuItems();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  
  // Custom states inside detail modal
  const [selectedSpice, setSelectedSpice] = useState(1); // Default Medium
  const [quantity, setQuantity] = useState(1);

  // Filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        item.category_id === categories.find((c) => c.slug === activeCategory)?.id;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        (item.jp_name && item.jp_name.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.jp_description && item.jp_description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [items, categories, activeCategory, searchQuery]);

  const handleOpenDetail = (dish: MenuItem) => {
    setSelectedDish(dish);
    setSelectedSpice(dish.spice_level !== null ? Math.min(dish.spice_level, 2) : 1);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedDish) return;
    addToCart(selectedDish, quantity, selectedSpice);
    setSelectedDish(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HEADER HERO */}
      <div className="relative py-24 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Discover Our Dishes", "お品書き")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("A Journey Through Himalayan Flavors", "ヒマラヤの香りとスパイスを巡る旅")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Every recipe is hand-blended with authentic spices and fresh local ingredients. Choose a category below to explore our culinary history.",
              "新鮮な食材と、ネパールの高地から調達された秘伝の有機ハーブ＆スパイスを使用。こだわりの一皿をご堪能ください。"
            )}
          </p>
        </div>
      </div>

      {/* STICKY SEARCH & CATEGORY NAV */}
      <div className="sticky top-[72px] z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold border rounded-full transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("All Dishes", "すべて")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold border rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {language === "ja" ? cat.jp_title : cat.title}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/60 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder={t("Search menu items...", "料理名・説明から検索...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/20 border border-border/60 text-xs pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-accent text-foreground font-light"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Legend Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border/20 rounded-md bg-muted/10 mb-12 text-[10px] tracking-wider text-muted-foreground/80 uppercase">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><span className="text-accent">🌶️</span> {t("Mild", "甘口")}</span>
            <span className="flex items-center gap-1.5"><span className="text-accent">🌶️🌶️</span> {t("Medium", "中辛")}</span>
            <span className="flex items-center gap-1.5"><span className="text-accent">🌶️🌶️🌶️</span> {t("Hot", "辛口")}</span>
          </div>
          <div>
            <span>{t("All chicken & lamb are Halal certified", "ハラール認証肉のみ使用しています")}</span>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.article
              layout
              onClick={() => handleOpenDetail(item)}
              key={item.id}
              className="group cursor-pointer flex flex-col sm:flex-row bg-card border border-border/30 rounded-sm overflow-hidden hover:border-accent/40 hover:shadow-xl transition-all duration-500 min-h-0 h-auto sm:h-[160px]"
            >
              {/* Image Frame (Left on desktop, top on mobile) */}
              <div className="relative w-full sm:w-[150px] md:w-[160px] h-[130px] sm:h-full shrink-0 overflow-hidden bg-muted">
                <img
                  src={resolveImage(item.featured_image_url)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Badges Overlay */}
                {item.tag && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-accent text-[#1A1A1A] text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
                      {item.tag}
                    </span>
                  </div>
                )}

                {/* Rating stars overlay (top-right) */}
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs border border-white/10 px-1.5 py-0.5 rounded-full flex gap-0.5 z-10 select-none text-accent">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={7} className="fill-current" />
                  ))}
                </div>

                {item.spice_level !== null && item.spice_level > 0 && (
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-sm flex gap-0.5 text-[8px] z-10">
                    {Array.from({ length: item.spice_level }).map((_, i) => (
                      <span key={i}>🌶️</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Info (Right on desktop, bottom on mobile) */}
              <div className="p-4 flex-1 flex flex-col justify-between min-h-[120px] sm:min-h-0">
                <div>
                  {(() => {
                    const cat = categories.find((c) => c.id === item.category_id);
                    if (cat) {
                      return (
                        <span className="text-[7.5px] tracking-[0.2em] text-accent uppercase font-bold block mb-1">
                          {language === "ja" ? cat.jp_title : cat.title}
                        </span>
                      );
                    }
                    return null;
                  })()}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-serif text-sm font-light text-foreground group-hover:text-accent transition-colors duration-300 leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="font-serif text-xs md:text-sm text-accent whitespace-nowrap">{item.price}</span>
                  </div>
                  <p className="text-[8px] tracking-wider text-muted-foreground uppercase mb-1 truncate">
                    {item.jp_name}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground/75 leading-relaxed font-light line-clamp-1 italic">
                    {t(item.description, item.jp_description)}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/10 mt-2 flex justify-between items-center text-[8.5px] text-muted-foreground/60 uppercase">
                  <span>{t("Click for detail", "詳細をみる")}</span>
                  <ChevronRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center space-y-3">
            <h3 className="font-serif text-xl text-muted-foreground">{t("No dishes found.", "料理が見つかりません。")}</h3>
            <p className="text-xs text-muted-foreground/60 font-light">{t("Try adjusting your search criteria.", "検索キーワードまたはカテゴリーを変更してください。")}</p>
          </div>
        )}
      </div>

      {/* DISH DETAIL MODAL */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-xl border border-border/80 text-foreground relative rounded-sm shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Visual */}
                <div className="relative h-48 md:h-full min-h-[220px] bg-muted">
                  <img
                    src={resolveImage(selectedDish.featured_image_url)}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] tracking-[0.25em] text-accent uppercase font-bold">
                      {categories.find((c) => c.id === selectedDish.category_id)?.title}
                    </span>
                    <h2 className="font-serif text-lg md:text-xl font-bold mt-1 text-foreground">
                      {selectedDish.name}
                    </h2>
                    <p className="text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                      {selectedDish.jp_name}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mb-4 select-none">
                      <div className="flex gap-0.5 text-accent">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} size={11} className="fill-current" />
                        ))}
                      </div>
                      <span className="text-[9px] text-muted-foreground font-light ml-0.5">(4.9 · 128 Reviews)</span>
                    </div>
                    
                    <span className="font-serif text-xl text-accent block mb-4">{selectedDish.price}</span>
                    
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-light mb-6">
                      {t(selectedDish.description, selectedDish.jp_description)}
                    </p>

                    {/* Spice Customization Selection */}
                    {selectedDish.category_id !== "cat-drinks" && selectedDish.category_id !== "cat-naan-rice" && (
                      <div className="space-y-2 mb-6">
                        <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">
                          {t("Choose Heat Level", "辛さを選ぶ")}
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { level: 0, label: t("Mild", "甘口") },
                            { level: 1, label: t("Medium", "中辛") },
                            { level: 2, label: t("Hot", "辛口") },
                          ].map((item) => (
                            <button
                              key={item.level}
                              type="button"
                              onClick={() => setSelectedSpice(item.level)}
                              className={`py-1.5 text-[9px] tracking-wider uppercase font-semibold border rounded-sm transition-all ${
                                selectedSpice === item.level
                                  ? "bg-accent border-accent text-[#1A1A1A]"
                                  : "border-border/60 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}


