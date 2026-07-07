"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useGallery } from "@/lib/cms";
import { resolveImage } from "@/lib/asset-map";
import { X, ZoomIn, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const { t } = useApp();
  const { data: gallery = [] } = useGallery();
  
  const [activeTab, setActiveTab] = useState<"all" | "space" | "food">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Simple hardcoded mapping for categorizing since it's client-filtered
  const filteredGallery = gallery.filter((img) => {
    if (activeTab === "all") return true;
    if (activeTab === "space") return img.image_url.includes("interior") || img.image_url.includes("chef");
    if (activeTab === "food") return img.image_url.includes("curry") || img.image_url.includes("naan") || img.image_url.includes("spices") || img.image_url.includes("momo") || img.image_url.includes("set") || img.image_url.includes("tandoori");
    return true;
  });

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const navigateLightbox = (dir: "prev" | "next") => {
    if (activeIndex === null) return;
    const len = filteredGallery.length;
    if (dir === "prev") {
      setActiveIndex((activeIndex - 1 + len) % len);
    } else {
      setActiveIndex((activeIndex + 1) % len);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HERO HEADER */}
      <div className="relative py-24 overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] tracking-[0.4em] uppercase text-accent font-bold">
            {t("Visual Sanctuary", "ギャラリー")}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("Moments Captured in Gorkha", "店内の雰囲気と料理")}
          </h1>
          <div className="gold-divider mx-auto my-3" />
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t(
              "Take a look inside our candlelit dining spaces, our kitchen hearth fire, and the vibrant colors of Himalayan spices.",
              "落ち着いた照明の店内、香ばしいナンを焼き上げるタンドール窯、スパイスが織り成す料理をご覧ください。"
            )}
          </p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex justify-center">
        <div className="inline-flex border border-border/40 p-1 rounded-sm bg-muted/10">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 text-[10px] tracking-widest uppercase font-semibold transition-all rounded-sm ${
              activeTab === "all" ? "bg-accent text-[#1A1A1A] font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("All Photos", "すべて")}
          </button>
          <button
            onClick={() => setActiveTab("space")}
            className={`px-6 py-2 text-[10px] tracking-widest uppercase font-semibold transition-all rounded-sm ${
              activeTab === "space" ? "bg-accent text-[#1A1A1A] font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("Dining & Kitchen", "店内・調理風景")}
          </button>
          <button
            onClick={() => setActiveTab("food")}
            className={`px-6 py-2 text-[10px] tracking-widest uppercase font-semibold transition-all rounded-sm ${
              activeTab === "food" ? "bg-accent text-[#1A1A1A] font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("Signature Dishes", "お料理")}
          </button>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((img, index) => (
            <motion.div
              layout
              key={img.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(index)}
              className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border/20 shadow-sm cursor-pointer group bg-muted"
            >
              <img
                src={resolveImage(img.image_url)}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                loading="lazy"
              />
              
              {/* Hover effect mask */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex justify-between items-center text-white">
                  <div className="space-y-0.5">
                    <p className="font-serif text-sm tracking-wide">{img.caption}</p>
                    <span className="text-[8px] uppercase tracking-wider text-accent font-bold">
                      {img.image_url.includes("interior") || img.image_url.includes("chef") ? t("Dining", "空間") : t("Cuisine", "料理")}
                    </span>
                  </div>
                  <div className="p-2 rounded-full border border-white/20">
                    <Eye size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX SLIDER OVERLAY */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-accent p-1"
              aria-label="Close viewer"
            >
              <X size={24} />
            </button>

            {/* Left Nav */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-6 text-[#FAF8F5]/60 hover:text-accent p-2 hover:scale-110 active:scale-95 transition-all bg-black/35 rounded-full"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Large Image Frame */}
            <div className="max-w-4xl w-full flex flex-col items-center space-y-4">
              <motion.img
                key={filteredGallery[activeIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={resolveImage(filteredGallery[activeIndex].image_url)}
                alt={filteredGallery[activeIndex].caption}
                className="max-h-[75vh] max-w-full object-contain rounded-sm shadow-2xl"
              />
              <div className="text-center text-[#FAF8F5] max-w-lg space-y-1">
                <p className="font-serif text-lg tracking-wide">
                  {filteredGallery[activeIndex].caption}
                </p>
                <p className="text-[10px] text-accent tracking-widest uppercase">
                  Image {activeIndex + 1} of {filteredGallery.length}
                </p>
              </div>
            </div>

            {/* Right Nav */}
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-6 text-[#FAF8F5]/60 hover:text-accent p-2 hover:scale-110 active:scale-95 transition-all bg-black/35 rounded-full"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
