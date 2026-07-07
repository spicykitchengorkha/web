"use client";

import { useState } from "react";
import { useApp, MenuItem } from "@/context/AppContext";
import { useMenuCategories, useMenuItems } from "@/lib/cms";
import { resolveImage } from "@/lib/asset-map";
import { ShoppingCart, Flame, Search, ChevronRight, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderPage() {
  const { t, language, addToCart, cart } = useApp();
  const { data: categories = [] } = useMenuCategories();
  const { data: items = [] } = useMenuItems();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedSpice, setSelectedSpice] = useState(1);

  // Group dishes by category
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      item.category_id === categories.find((c) => c.slug === activeCategory)?.id;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.jp_name.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleAddClick = (item: MenuItem) => {
    // If it's a drink or bread, add directly with spice level 0
    if (item.category_id === "cat-drinks" || item.category_id === "cat-naan-rice") {
      addToCart(item, 1, 0);
    } else {
      // Open quick spice selector customization modal
      setCustomizingItem(item);
      setSelectedSpice(item.spice_level !== null ? Math.min(item.spice_level, 2) : 1);
    }
  };

  const confirmCustomization = () => {
    if (!customizingItem) return;
    addToCart(customizingItem, 1, selectedSpice);
    setCustomizingItem(null);
  };

  // Check if item is already in cart
  const getCartQty = (itemId: string): number => {
    return cart.filter((c) => c.item.id === itemId).reduce((acc, c) => acc + c.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HEADER HERO */}
      <div className="relative py-20 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(192,57,43,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-[#C0392B] font-bold">
            {t("Direct Online Kitchen", "テイクアウト注文")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("Order Fresh Food For Pickup", "出来立てをお持ち帰り")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Place your order online and pick it up hot from our kitchen in Kurosaki. Ready in approximately 20–30 minutes.",
              "ネットで事前にご注文いただくと、黒崎の店舗にて出来立てをお受け取りいただけます。待ち時間なしで大変便利です（目安20〜30分）。"
            )}
          </p>
        </div>
      </div>

      {/* FILTER STICKY BAR */}
      <div className="sticky top-[72px] z-35 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Tab list */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold border rounded-sm transition-all ${
                activeCategory === "all"
                  ? "bg-accent border-accent text-[#1A1A1A] font-bold"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("All Items", "すべて")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-[10px] tracking-widest uppercase font-semibold border rounded-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.slug
                    ? "bg-accent border-accent text-[#1A1A1A] font-bold"
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
              placeholder={t("Search food items...", "料理名から検索...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/20 border border-border/60 text-xs pl-10 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-accent text-foreground font-light"
            />
          </div>
        </div>
      </div>

      {/* ITEMS CATALOG */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const qty = getCartQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-card border border-border/30 rounded-sm p-4 flex gap-4 hover:border-accent/40 hover:shadow-lg transition-all duration-300 relative group"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-sm bg-muted relative">
                  <img
                    src={resolveImage(item.featured_image_url)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {qty > 0 && (
                    <div className="absolute top-1 right-1 bg-accent text-[#1A1A1A] text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-card shadow-sm">
                      {qty}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-serif text-sm font-bold text-foreground truncate group-hover:text-accent transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="font-serif text-sm text-accent whitespace-nowrap font-semibold">
                        {item.price}
                      </span>
                    </div>
                    
                    <p className="text-[9px] tracking-wider text-muted-foreground uppercase mb-2 truncate">
                      {item.jp_name}
                    </p>

                    <p className="text-xs text-muted-foreground/75 leading-normal line-clamp-2 font-light">
                      {t(item.description, item.jp_description)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/10 mt-3 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50 uppercase">
                      {item.tag && <span className="text-accent font-bold">{item.tag}</span>}
                      {item.spice_level !== null && item.spice_level > 0 && (
                        <span className="flex items-center text-accent">
                          <Flame size={10} className="fill-current" />
                          <span>Level {item.spice_level}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddClick(item)}
                      className="px-4 py-1.5 bg-gradient-gold text-[#1A1A1A] font-bold text-[9px] tracking-widest uppercase flex items-center gap-1 hover:opacity-90 rounded-sm shadow-md"
                    >
                      <Plus size={10} />
                      <span>{t("Add", "追加")}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center space-y-3">
            <h3 className="font-serif text-xl text-muted-foreground">{t("No ordering items found.", "商品が見つかりません。")}</h3>
            <p className="text-xs text-muted-foreground/60 font-light">{t("Try adjusting your filters.", "カテゴリーを変更するか、別のキーワードを入力してください。")}</p>
          </div>
        )}
      </div>

      {/* QUICK SPICE SELECTOR DIALOG */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-sm p-6 border border-border/80 text-foreground relative rounded-sm shadow-2xl space-y-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-serif text-base font-bold">{customizingItem.name}</h4>
                <p className="text-[10px] text-muted-foreground">{customizingItem.jp_name}</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-accent font-bold block">
                {t("Customize Heat Level", "辛さを選ぶ")}
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
                    className={`py-2 text-[9px] tracking-wider uppercase font-semibold border rounded-sm transition-all ${
                      selectedSpice === item.level
                        ? "bg-accent border-accent text-[#1A1A1A] font-bold"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={confirmCustomization}
              className="w-full py-3 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-widest uppercase rounded-sm shadow-md hover:opacity-90 transition-opacity"
            >
              {t("Add to Order Platter", "カートへ追加")}
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function X({ size, className, onClick }: { size: number; className?: string; onClick?: () => void }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
