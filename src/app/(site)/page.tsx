"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { resolveImage } from "@/lib/asset-map";
import { TABELOG_RESERVATION_URL } from "@/lib/constants";
import {
  useSiteContent,
  useFeaturedItems,
  useTestimonials,
  useMenuCategories,
  useMenuItems,
  useGallery,
  useBanners,
  useVisitStats,
  trackVisit,
  submitTestimonial,
  likeTestimonial,
  Testimonial,
} from "@/lib/cms";
import {
  ArrowRight,
  Star,
  Loader2,
  Heart,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  ShoppingBag,
  BookOpen,
  Facebook,
  Instagram,
  MessageSquare,
  Play,
  Smile,
  Users,
  Trophy,
  Award,
  Phone,
  Flame,
  ChefHat,
  Leaf,
  Soup,
  CakeSlice,
  Utensils,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Simple countup component for the counters
function Counter({ value, duration = 2 }: { value: string; duration?: number }) {
  const numberPart = parseInt(value.replace(/[^\d]/g, "")) || 0;
  const suffix = value.replace(/[\d]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numberPart;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numberPart, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const { t, language, theme } = useApp();
  const { data: siteCopy = {} } = useSiteContent();
  const { data: menuItems = [] } = useMenuItems();
  const { data: testimonials = [] } = useTestimonials();
  const { data: categories = [] } = useMenuCategories();
  const { data: gallery = [] } = useGallery();
  const { data: banners = [] } = useBanners();
  const { data: visitStats } = useVisitStats();

  // Track this visit once on mount
  useEffect(() => { trackVisit(); }, []);

  const getCategoryLabel = (catId: string) => {
    const matched = categories.find((c: any) => c.id === catId);
    if (matched) {
      return language === "ja" ? matched.jp_title : matched.title;
    }
    const lower = (catId || "").toLowerCase();
    if (lower.includes("appetizer") || lower.includes("starter")) {
      return language === "ja" ? "前菜・点心" : "Starter";
    }
    if (lower.includes("curry") || lower.includes("curries")) {
      return language === "ja" ? "特製カレー" : "Curry";
    }
    if (lower.includes("tandoori")) {
      return language === "ja" ? "タンドリー焼き物" : "Tandoori Grill";
    }
    if (lower.includes("naan") || lower.includes("bread") || lower.includes("rice")) {
      return language === "ja" ? "ナン＆ライス" : "Breads & Rice";
    }
    if (lower.includes("set")) {
      return language === "ja" ? "ヒマラヤセット" : "Himalayan Sets";
    }
    if (lower.includes("drink") || lower.includes("beverage")) {
      return language === "ja" ? "お飲み物" : "Beverages";
    }
    return "";
  };

  // Scroll carousel ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDish, setSelectedDish] = useState<any | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<number>(1);

  // Review Dialog form state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Reservation widget inputs
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("");
  const [resGuests, setResGuests] = useState("2");

  // Local testimonials state for immediate like feedback
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setLocalTestimonials(testimonials);
    }
  }, [testimonials]);

  // Dynamic collage arrays fetched from the database gallery API
  const storyLeftImages = useMemo(() => {
    const space = gallery.filter((img: any) => img.image_url.includes("interior") || img.image_url.includes("welcome")).map((img: any) => img.image_url);
    return space.length > 0 ? space : ["/assets/interior.jpg", "/assets/menu-set.jpg", "/assets/welcome-hostess.jpg"];
  }, [gallery]);

  const storyTopRightImages = useMemo(() => {
    const chef = gallery.filter((img: any) => img.image_url.includes("chef") || img.image_url.includes("spices")).map((img: any) => img.image_url);
    return chef.length > 0 ? chef : ["/assets/chef.jpg", "/assets/spices.jpg"];
  }, [gallery]);

  const storyBottomRightImages = useMemo(() => {
    const food = gallery.filter((img: any) =>
      !img.image_url.includes("interior") &&
      !img.image_url.includes("welcome") &&
      !img.image_url.includes("chef") &&
      !img.image_url.includes("spices")
    ).map((img: any) => img.image_url);
    return food.length > 0 ? food : ["/assets/menu-tandoori.jpg", "/assets/menu-drinks.jpg", "/assets/menu-momo.jpg", "/assets/menu-curry.jpg"];
  }, [gallery]);

  // Hero Image and Text Slideshow
  const heroSlides = useMemo(() => {
    if (banners && banners.length > 0) {
      return banners.map((banner) => ({
        image: resolveImage(banner.image_url),
        kicker: language === "ja" ? banner.jp_kicker || banner.kicker || "" : banner.kicker || "",
        headline: language === "ja" ? banner.jp_title || banner.title : banner.title,
        tagline: language === "ja" ? banner.jp_subtitle || banner.subtitle || "" : banner.subtitle || "",
        buttons: banner.buttons || null,
      }));
    }

    // Default static slides fallback if banners are not populated in db
    return [
      {
        image: "/assets/welcome-hostess.jpg",
        kicker: t("WELCOME TO SPICY KITCHEN GORKHA", "ゴルカへようこそ"),
        headline: (
          <>
            NAMASTE &<br />
            <span className="text-accent font-serif italic font-light tracking-widest block mt-2">WELCOME</span>
          </>
        ),
        tagline: t(
          "Namaste! We welcome you with warm Nepalese hospitality and authentic flavors from the heart of Gorkha.",
          "ナマステ！ゴルカの温かいおもてなしと、本場のネパール・インド伝統の味わいで皆様をお迎えいたします。"
        ),
        buttons: null,
      },
      {
        image: "/assets/menu-tandoori.jpg",
        kicker: t("AUTHENTIC NEPALESE & INDIAN CUISINE", "本格ネパール・インド料理"),
        headline: (
          <>
            CRAFTED WITH<br />
            <span className="text-accent font-serif italic font-light tracking-widest block mt-2">PASSION</span>
          </>
        ),
        tagline: t(
          "Experience the perfect blend of tradition, flavor and hospitality. From the heart of Gorkha to your plate.",
          "伝統と美味しさ、情熱と温かいおもてなしの完璧な融合をご体験ください。ゴルカの魂から、あなたのお皿へ。"
        ),
        buttons: null,
      },
      {
        image: "/assets/menu-momo.jpg",
        kicker: t("HOUSE SPECIALTIES", "名物料理"),
        headline: (
          <>
            HAND-CRAFTED<br />
            <span className="text-accent font-serif italic font-light tracking-widest block mt-2">DUMPLINGS</span>
          </>
        ),
        tagline: t(
          "Taste our signature momos, hand-rolled and steamed to juicy perfection with mountain spices.",
          "手包みしたモチモチの皮から熱々の肉汁が溢れ出す、特製ヒマラヤモモをぜひご賞味ください。"
        ),
        buttons: null,
      },
      {
        image: "/assets/menu-curry.jpg",
        kicker: t("SPICY & REFINED", "薫り高いスパイス"),
        headline: (
          <>
            TRADITIONAL<br />
            <span className="text-accent font-serif italic font-light tracking-widest block mt-2">CURRIES</span>
          </>
        ),
        tagline: t(
          "Indulge in our rich, slowly simmered curries prepared with freshly ground spices and herbs.",
          "挽きたてのスパイスと厳選ハーブを使用し、じっくり時間をかけて煮込んだ奥深い特製カレー。"
        ),
        buttons: null,
      }
    ];
  }, [banners, language]);

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    setHeroSlide(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const currentSlide = heroSlides[heroSlide] || heroSlides[0];

  // Ambience Slideshow
  const ambienceSlidesData = (() => {
    try {
      return siteCopy["ambience.slides"]
        ? JSON.parse(siteCopy["ambience.slides"])
        : [
          { image: "/assets/interior.jpg", label_en: "MAIN DINING ROOM", label_jp: "メインダイニング" },
          { image: "/assets/menu-set.jpg", label_en: "TRADITIONAL SPECIAL THALI SET", label_jp: "伝統的なヒマラヤ御膳セット" },
          { image: "/assets/menu-tandoori.jpg", label_en: "FRESH COOKED TANDOORI MEATS", label_jp: "炭火タンドリー窯での調理" },
          { image: "/assets/menu-drinks.jpg", label_en: "SIGNATURE HIMALAYAN DRINKS", label_jp: "ヒマラヤン特製カクテル" },
          { image: "/assets/spices.jpg", label_en: "HANDGROUND ORGANIC SPICES", label_jp: "手挽きした有機スパイス" },
        ];
    } catch (e) {
      return [];
    }
  })();

  const ambienceImages = ambienceSlidesData.map((s: any) => resolveImage(s.image) || "/assets/interior.jpg");
  const [activeAmbience, setActiveAmbience] = useState(0);

  useEffect(() => {
    if (ambienceImages.length === 0) return;
    const interval = setInterval(() => {
      setActiveAmbience((prev) => (prev + 1) % ambienceImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ambienceImages.length]);

  const idxToLabel = (idx: number) => {
    const slide = ambienceSlidesData[idx];
    if (!slide) return "";
    return language === "ja" ? (slide.label_jp || slide.label_en) : slide.label_en;
  };

  const handleReservationRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = TABELOG_RESERVATION_URL;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    setReviewLoading(true);
    try {
      await submitTestimonial({
        author: reviewName,
        rating: reviewRating,
        text: reviewText,
      });
      const added: Testimonial = {
        id: Math.random().toString(),
        author: reviewName,
        rating: reviewRating,
        text: reviewText,
        likes: 0,
        sort_order: 1,
      };
      setLocalTestimonials((prev) => [added, ...prev]);
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewOpen(false);
        setReviewSuccess(false);
        setReviewName("");
        setReviewText("");
        setReviewRating(5);
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const updated = await likeTestimonial(id);
      setLocalTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, likes: updated.likes } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleTestimonialScroll = () => {
    if (testimonialScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = testimonialScrollRef.current;
      const totalSteps = localTestimonials.length;
      if (totalSteps > 1) {
        const cardWidth = scrollWidth / totalSteps;
        const currentActive = Math.round(scrollLeft / cardWidth);
        setActiveTestimonialIdx(Math.min(currentActive, totalSteps - 1));
      }
    }
  };

  const scrollToTestimonial = (index: number) => {
    if (testimonialScrollRef.current) {
      const container = testimonialScrollRef.current;
      const cards = container.children;
      if (cards && cards[index]) {
        const cardElement = cards[index] as HTMLElement;
        container.scrollTo({
          left: cardElement.offsetLeft - (container.clientWidth - cardElement.clientWidth) / 2,
          behavior: "smooth"
        });
        setActiveTestimonialIdx(index);
      }
    }
  };

  const scrollTestimonials = (direction: "left" | "right") => {
    if (testimonialScrollRef.current) {
      const container = testimonialScrollRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const scrollTo = direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Auto-scrolling interval for testimonials slider
  useEffect(() => {
    if (localTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonialIdx((currentIdx) => {
        const nextIdx = (currentIdx + 1) % localTestimonials.length;
        if (testimonialScrollRef.current) {
          const container = testimonialScrollRef.current;
          const cards = container.children;
          if (cards && cards[nextIdx]) {
            const cardElement = cards[nextIdx] as HTMLElement;
            container.scrollTo({
              left: cardElement.offsetLeft - (container.clientWidth - cardElement.clientWidth) / 2,
              behavior: "smooth"
            });
          }
        }
        return nextIdx;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [localTestimonials]);

  // Mock Chef's Special item lists if CMS featured array is offline
  const fallbackChefSpecials = [
    {
      id: "chef1",
      name: "Gorkha Lamb Sekuwa",
      jp_name: "ゴルカラブ・セクワ",
      category_id: "cat-tandoori",
      description: "Tender lamb skewers marinated in wild Himalayan spices and grilled to perfection.",
      jp_description: "ヒマラヤハーブと厳選スパイスにじっくり漬け込み、炭火で香ばしく焼き上げた極上子羊肉串焼き。",
      price: "1380",
      spice_level: 3,
      tag: "BEST SELLER",
      image: "/assets/menu-tandoori.jpg",
    },
    {
      id: "chef2",
      name: "Himalayan Momo Platter",
      jp_name: "モモ・プラッター",
      category_id: "cat-appetizers",
      description: "Steamed Nepalese dumplings filled with spiced minced chicken, served with tomato chutney.",
      jp_description: "手包みしたモチモチの皮から熱々の肉汁が溢れ出す、ネパールの代表的な小籠包風蒸し餃子。",
      price: "900",
      spice_level: 1,
      tag: "BEST SELLER",
      image: "/assets/menu-momo.jpg",
    },
    {
      id: "chef3",
      name: "Gorkha Butter Chicken",
      jp_name: "バターチキンカレー",
      category_id: "cat-curries",
      description: "Tender tandoori chicken simmered in velvet tomato, cashew nut and pure butter sauce.",
      jp_description: "バターとトマト、カシューナッツをベースにしたクリーミーで奥深い味わいの定番タンドリーチキンカレー。",
      price: "1250",
      spice_level: 1,
      tag: "POPULAR",
      image: "/assets/menu-curry.jpg",
    },
    {
      id: "chef4",
      name: "Hyderabadi Chicken Biryani",
      jp_name: "ハイデラバディ・ビリヤニ",
      category_id: "cat-naan-rice",
      description: "Aromatic basmati rice layered with succulent chicken, saffron, and traditional spices.",
      jp_description: "最高級のバスマティ米を使用し、何十種ものスパイスと柔らかなお肉を交互に重ねて蒸し上げた薫り高い炊き込みご飯。",
      price: "1400",
      spice_level: 2,
      tag: "SIGNATURE",
      image: "/assets/menu-set.jpg",
    },
    {
      id: "chef5",
      name: "Toasted Garlic Naan",
      jp_name: "ガーリックナン",
      category_id: "cat-naan-rice",
      description: "Soft tandoor flatbread topped with fresh minced garlic, coriander leaves and butter.",
      jp_description: "刻みニンニクと香菜をふんだんにのせ、香ばしく焼き上げたパンチのあるナン。",
      price: "550",
      spice_level: 0,
      tag: "POPULAR",
      image: "/assets/menu-naan.jpg",
    },
    {
      id: "chef6",
      name: "Spiced Tandoori Chicken",
      jp_name: "タンドリーチキン",
      category_id: "cat-tandoori",
      description: "Chicken legs marinated in organic yogurt and hand-ground red chili, slow-roasted in clay tandoor.",
      jp_description: "スパイスとヨーグルトのタレに丸一日漬け込み、高温の炭火タンドール窯でジューシーに焼き上げた骨付きチキン。",
      price: "1200",
      spice_level: 2,
      tag: "POPULAR",
      image: "/assets/menu-tandoori.jpg",
    },
    {
      id: "chef7",
      name: "Dal Bhat Thakali Set",
      jp_name: "タカリセット (ダルバート)",
      category_id: "cat-set-meals",
      description: "Traditional Nepalese platter with black lentil soup, rice, chicken curry, and pickles.",
      jp_description: "ネパールの伝統的な国民食。黒レンズ豆スープ（ダル）、ご飯、選べるカレー、高菜炒め、スパイスピクルスなどの御膳セット。",
      price: "1850",
      spice_level: 2,
      tag: "SIGNATURE",
      image: "/assets/menu-set.jpg",
    },
    {
      id: "chef8",
      name: "Sweet Mango Lassi",
      jp_name: "マンゴーラッシー",
      category_id: "cat-drinks",
      description: "Creamy house-made yogurt beverage blended with sweet ripe mango nectar and cardamom.",
      jp_description: "自家製ヨーグルトと濃厚なマンゴーピューレを合わせた、爽やかで優しい甘さのお馴染みのドリンク。",
      price: "500",
      spice_level: 0,
      tag: "REFRESHING",
      image: "/assets/menu-drinks.jpg",
    },
  ];

  const chefSpecials = menuItems.length > 0 ? menuItems : fallbackChefSpecials;

  const filteredSpecials = useMemo(() => {
    if (selectedCategory === "all") return chefSpecials;
    return chefSpecials.filter((dish: any) => dish.category_id === selectedCategory);
  }, [chefSpecials, selectedCategory]);

  const getDishIcon = (dish: any) => {
    const name = (dish.name || "").toLowerCase();
    if (name.includes("biryani") || name.includes("rice") || name.includes("sekuwa") || name.includes("katsu") || name.includes("meat") || name.includes("momo")) {
      return <ChefHat className="text-accent w-4 h-4 stroke-[1.5]" />;
    }
    if (name.includes("naan") || name.includes("roti") || name.includes("bread") || name.includes("paneer") || name.includes("salad")) {
      return <Leaf className="text-accent w-4 h-4 stroke-[1.5]" />;
    }
    if (name.includes("lassi") || name.includes("sweet") || name.includes("dessert") || name.includes("kheer") || name.includes("cheesecake")) {
      return <CakeSlice className="text-accent w-4 h-4 stroke-[1.5]" />;
    }
    if (name.includes("soup") || name.includes("curry") || name.includes("dal")) {
      return <Soup className="text-accent w-4 h-4 stroke-[1.5]" />;
    }
    return <Utensils className="text-accent w-4 h-4 stroke-[1.5]" />;
  };

  const formatPrice = (price: string) => {
    if (!price) return "";
    const cleanPrice = price.toString().replace(/[^\d,]/g, "");
    return `¥${cleanPrice}`;
  };

  return (
    <div className="relative overflow-hidden bg-background -mt-[72px]">

      {/* 1. CINEMATIC STATIC HERO */}
      <section className="relative min-h-[85vh] lg:h-[85vh] w-full overflow-hidden bg-background flex items-start pt-[100px] lg:pt-[125px] pb-16">
        {/* Decorative Gold Glow Leak */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Text & Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {/* Kicker */}
                  <p className="text-[10px] md:text-[11px] tracking-[0.35em] text-accent uppercase font-bold">
                    {currentSlide?.kicker}
                  </p>

                  {/* Headline */}
                  {typeof currentSlide?.headline === "string" ? (
                    <h1
                      className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.1] font-light tracking-wide uppercase min-h-[80px] sm:min-h-[100px] lg:min-h-[140px]"
                      dangerouslySetInnerHTML={{ __html: currentSlide.headline }}
                    />
                  ) : (
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] font-light tracking-wide uppercase min-h-[130px] sm:min-h-[150px] lg:min-h-[220px]">
                      {currentSlide?.headline}
                    </h1>
                  )}

                  {/* Tagline */}
                  <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed font-light mx-auto lg:mx-0 min-h-[60px]">
                    {currentSlide?.tagline}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Buttons Row */}
              <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                {currentSlide?.buttons && currentSlide.buttons.length > 0 ? (
                  currentSlide.buttons.map((btn: any, idx: number) => {
                    const label = language === "ja" ? btn.jp_label || btn.label : btn.label;
                    const isPrimary = btn.style === "primary";
                    const isExternal = btn.link.startsWith("http") || btn.link.startsWith("tel:") || btn.link.startsWith("mailto:");

                    const getCustomIcon = (btnLabel: string, btnLink: string) => {
                      const text = (btnLabel + " " + btnLink).toLowerCase();
                      if (text.includes("reserve") || text.includes("reservation") || text.includes("book") || text.includes("予約") || text.includes("席")) {
                        return <Calendar size={14} />;
                      }
                      if (text.includes("menu") || text.includes("explore") || text.includes("メニュー")) {
                        return <BookOpen size={14} />;
                      }
                      return null;
                    };

                    const icon = getCustomIcon(btn.label, btn.link);

                    if (isExternal) {
                      return (
                        <a
                          key={idx}
                          href={btn.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            isPrimary
                              ? "inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-sm shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                              : "inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-accent text-accent hover:bg-accent/10 font-bold text-xs tracking-wider uppercase rounded-sm transition-all hover:scale-105 active:scale-95"
                          }
                        >
                          {icon}
                          <span>{label}</span>
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={idx}
                        href={btn.link}
                        className={
                          isPrimary
                            ? "inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-sm shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                            : "inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-accent text-accent hover:bg-accent/10 font-bold text-xs tracking-wider uppercase rounded-sm transition-all hover:scale-105 active:scale-95"
                        }
                      >
                        {icon}
                        <span>{label}</span>
                      </Link>
                    );
                  })
                ) : (
                  <>
                    <a
                      href={TABELOG_RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-sm shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                    >
                      <Calendar size={14} />
                      <span>{t("RESERVE A TABLE", "席を予約する")}</span>
                    </a>

                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent border border-accent text-accent hover:bg-accent/10 font-bold text-xs tracking-wider uppercase rounded-sm transition-all hover:scale-105 active:scale-95"
                    >
                      <BookOpen size={14} />
                      <span>{t("EXPLORE MENU", "メニューを見る")}</span>
                    </Link>
                  </>
                )}

                {/* Watch Our Story Play Trigger */}
                <a
                  href="#about-section"
                  className="inline-flex items-center gap-2.5 text-foreground hover:text-accent font-semibold text-xs tracking-widest uppercase transition-colors md:ml-3"
                >
                  <span className="w-9 h-9 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-colors">
                    <Play size={12} className="fill-current ml-0.5" />
                  </span>
                  <span>{t("WATCH OUR STORY", "ストーリーを見る")}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Floating Image Container with Slideshow */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm md:max-w-md aspect-square rounded-sm overflow-hidden border border-foreground/10 shadow-2xl bg-card">
                <AnimatePresence mode="wait">
                  {currentSlide && (
                    <motion.img
                      key={heroSlide}
                      src={currentSlide.image}
                      alt="Spicy Kitchen Gorkha Signature Platter"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                {/* Gold border accent flare */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent z-10" />
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Mouse Indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-25 hidden lg:flex flex-col items-center gap-1 select-none text-[#FAF8F5]">
          <div className="w-5 h-9 rounded-full border-2 border-accent flex justify-center p-1.5 animate-bounce">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
          </div>
          <span className="text-[7.5px] tracking-[0.4em] uppercase text-accent font-bold mt-1">SCROLL</span>
        </div>

        {/* Side Social Column (Right) */}
        <div className="absolute right-6 bottom-24 z-25 hidden md:flex flex-col gap-4 text-foreground/60 select-none">
          <a
            href="tel:+9779812345678"
            className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-accent hover:bg-accent/10 transition-all hover:scale-110"
          >
            <Phone size={13} />
          </a>
          <a
            href="https://wa.me/81930000000"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-[#2ECC71] hover:bg-[#2ECC71]/10 transition-all hover:scale-110"
          >
            <MessageSquare size={13} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-pink-500 hover:bg-pink-500/10 transition-all hover:scale-110"
          >
            <Instagram size={13} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-all hover:scale-110"
          >
            <Facebook size={13} />
          </a>
        </div>
      </section>

      {/* 2. STATS RIBBON SECTION */}
      <section className="relative z-20 -mt-10 mx-auto max-w-6xl px-6">
        <div className="bg-card backdrop-blur-md border border-border rounded-sm shadow-2xl py-8 px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2">

          {/* Today's Visits */}
          <div className="flex items-center gap-3 justify-center lg:px-3 lg:border-r border-border">
            <Eye size={28} className="text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                <Counter value={visitStats ? String(visitStats.today_visits) : "0"} />
              </span>
              <span className="text-[8px] md:text-[9px] tracking-wider uppercase text-muted-foreground font-semibold">
                {t("TODAY'S VISITS", "本日の来店数")}
              </span>
            </div>
          </div>

          {/* Happy Customers */}
          <div className="flex items-center gap-3 justify-center lg:px-3 lg:border-r border-border">
            <Users size={28} className="text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                <Counter value={visitStats?.happy_customers || siteCopy["hero.stat2_value"] || "25K+"} />
              </span>
              <span className="text-[8px] md:text-[9px] tracking-wider uppercase text-muted-foreground font-semibold">
                {language === "ja"
                  ? siteCopy["hero.stat2_label_jp"] || siteCopy["hero.stat2_label"] || t("HAPPY CUSTOMERS", "幸せなお客様")
                  : siteCopy["hero.stat2_label"] || t("HAPPY CUSTOMERS", "幸せなお客様")}
              </span>
            </div>
          </div>

          {/* Years of Excellence */}
          <div className="flex items-center gap-3 justify-center lg:px-3 lg:border-r border-border">
            <Smile size={28} className="text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                <Counter value={visitStats?.years || siteCopy["hero.stat1_value"] || "10+"} />
              </span>
              <span className="text-[8px] md:text-[9px] tracking-wider uppercase text-muted-foreground font-semibold">
                {language === "ja"
                  ? siteCopy["hero.stat1_label_jp"] || siteCopy["hero.stat1_label"] || t("YEARS OF EXCELLENCE", "創業からの歩み")
                  : siteCopy["hero.stat1_label"] || t("YEARS OF EXCELLENCE", "創業からの歩み")}
              </span>
            </div>
          </div>

          {/* Number of Dishes — real count from menu API */}
          <div className="flex items-center gap-3 justify-center lg:px-3 lg:border-r border-border">
            <BookOpen size={28} className="text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                <Counter value={menuItems.length > 0 ? String(menuItems.length) + "+" : siteCopy["hero.stat3_value"] || "100+"} />
              </span>
              <span className="text-[8px] md:text-[9px] tracking-wider uppercase text-muted-foreground font-semibold">
                {language === "ja"
                  ? siteCopy["hero.stat3_label_jp"] || siteCopy["hero.stat3_label"] || t("SIGNATURE DISHES", "自慢の料理の数々")
                  : siteCopy["hero.stat3_label"] || t("SIGNATURE DISHES", "自慢の料理の数々")}
              </span>
            </div>
          </div>

          {/* All-Time Visits */}
          <div className="flex items-center gap-3 justify-center lg:px-3">
            <Trophy size={28} className="text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                <Counter value={visitStats ? String(visitStats.all_time_visits) : "0"} />
              </span>
              <span className="text-[8px] md:text-[9px] tracking-wider uppercase text-muted-foreground font-semibold">
                {t("ALL-TIME VISITS", "累計訪問者数")}
              </span>
            </div>
          </div>

        </div>
      </section>


      {/* 3. CHEF'S SPECIAL SECTION */}
      <section className="pt-24 pb-8 max-w-7xl mx-auto px-6">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-accent font-bold">
              {t("· OUR SIGNATURE ·", "・シグネチャーメニュー・")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-semibold">
              {t("Explore Our Menu", "メニューの紹介")}
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-bold text-foreground hover:text-accent transition-colors"
          >
            <span>{t("VIEW FULL MENU", "全メニューを見る")}</span>
            <ArrowRight size={13} className="text-accent" />
          </Link>
        </div>

        {/* Category Tabs Mini-cards with Image background */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar scroll-smooth justify-start md:justify-center max-w-full">
          {[
            { id: "all", title: "All Dishes", jp_title: "すべて", image_url: "menu-set" },
            ...categories
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`relative w-28 sm:w-32 md:w-36 h-14 sm:h-16 rounded-xs overflow-hidden shrink-0 transition-all border ${isActive
                  ? "border-accent scale-105 shadow-lg shadow-accent/15 ring-1 ring-accent"
                  : "border-border/30 hover:border-accent/40"
                  }`}
              >
                <img
                  src={resolveImage(tab.image_url)}
                  alt={tab.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className={`absolute inset-0 bg-black/65 transition-colors ${isActive ? "bg-black/40" : "hover:bg-black/55"
                  }`} />
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center select-none">
                  <span className="text-[9px] tracking-widest text-[#FAF8F5] uppercase font-bold">
                    {language === "ja" ? tab.jp_title : tab.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Nav Buttons */}
          {filteredSpecials.length > 0 && (
            <>
              <button
                onClick={() => handleScroll("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent shadow-md transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-95 cursor-pointer"
                aria-label="Previous specials"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent shadow-md transition-all opacity-0 group-hover/carousel:opacity-100 active:scale-95 cursor-pointer"
                aria-label="Next specials"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Cards List Row (Slider/Carousel) */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredSpecials.map((dish: any) => {
              return (
                <div
                  key={dish.id}
                  className="w-[260px] sm:w-[290px] shrink-0 bg-card border-2 border-accent/40 hover:border-accent rounded-lg overflow-hidden transition-all duration-300 flex flex-col justify-between group relative cursor-default hover:shadow-2xl hover:shadow-[0_0_20px_rgba(170,132,20,0.25)] snap-start transform hover:-translate-y-1"
                >
                  {/* Top Image area */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <img
                      src={resolveImage(dish.featured_image_url || dish.image_url || dish.image)}
                      alt={dish.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Bookmark Tag (Best Seller / Popular / Chef's Special) */}
                    {dish.tag && (
                      <div className="absolute top-0 left-4 z-10 bg-[#E63946] text-white text-[8px] font-bold px-2 py-3 uppercase flex flex-col items-center shadow-lg rounded-b-sm">
                        <Star size={8} className="fill-current text-white mb-0.5" />
                        <span className="writing-mode-vertical [writing-mode:vertical-lr] tracking-widest text-[7px] font-extrabold leading-none">
                          {dish.tag.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Spice level badge (top-right of image) */}
                    {dish.spice_level && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2 py-1 rounded-full flex items-center gap-0.5 z-10 border border-white/10">
                        {Array.from({ length: dish.spice_level }).map((_, idx) => (
                          <Flame key={idx} size={9} className="text-red-500 fill-red-500" />
                        ))}
                      </div>
                    )}

                    {/* Rating stars overlay (bottom-left of image) */}
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded-full flex gap-0.5 z-10 select-none text-accent">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={8} className="fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Title & Icon row */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-base font-semibold text-foreground tracking-wide group-hover:text-accent transition-colors duration-300 leading-snug">
                          {language === "ja" ? dish.jp_name || dish.name : dish.name}
                        </h3>
                        {/* Food Type Icon */}
                        <div className="p-1.5 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0">
                          {getDishIcon(dish)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground font-light leading-relaxed line-clamp-2 h-10">
                        {language === "ja" ? dish.jp_description || dish.description : dish.description}
                      </p>
                    </div>

                    {/* Bottom Action row */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/20">
                      <span className="font-serif text-sm text-[#E6C250] font-bold">
                        {formatPrice(dish.price)}
                      </span>

                      {/* View Details Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpice(1);
                          setSelectedDish(dish);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#AA8414]/60 text-[#E6C250] hover:bg-[#AA8414] hover:text-[#1A1A1A] text-xs font-semibold rounded-xs transition-all duration-300 cursor-pointer"
                      >
                        <Eye size={11} />
                        <span>{t("View Details", "詳細を見る")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSpecials.length === 0 && (
            <div className="w-full py-16 text-center text-muted-foreground/60 select-none border border-dashed border-border/30 rounded-sm">
              {t("No special items featured in this category.", "このカテゴリに登録されているおすすめ料理は現在ありません。")}
            </div>
          )}
        </div>

      </section>

      {/* 4. MOMENTS & MEMORIES AMBIENCE (Auto-sliding coverflow style) */}
      <section className="pt-12 pb-24 bg-background text-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-accent font-bold">
              {t("· OUR AMBIENCE ·", "・ギャラリー・")}
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-foreground font-semibold">
              {t("Moments & Memories", "店内の雰囲気と瞬間")}
            </h2>
            <div className="h-[2px] w-12 bg-accent/70 mx-auto my-4" />
          </div>

          {/* Coverflow Slider Layout */}
          {(() => {
            const len = ambienceImages.length;
            const prev = (activeAmbience - 1 + len) % len;
            const curr = activeAmbience;
            const next = (activeAmbience + 1) % len;

            const slides = [
              { key: ambienceImages[prev], idx: prev, isCenter: false },
              { key: ambienceImages[curr], idx: curr, isCenter: true },
              { key: ambienceImages[next], idx: next, isCenter: false },
            ];

            return (
              <LayoutGroup id="ambience-slider">
                <div className="flex justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto py-4 overflow-hidden">
                  {slides.map((slide) => {
                    if (slide.isCenter) {
                      return (
                        <motion.div
                          key={slide.key}
                          layout
                          onClick={() => setLightboxImg(slide.key)}
                          className="w-[280px] sm:w-[320px] md:w-[420px] aspect-[4/3] md:aspect-square rounded-sm overflow-hidden border-2 border-accent shadow-2xl scale-105 cursor-pointer relative z-10 shrink-0"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <motion.img
                            layout="position"
                            src={slide.key}
                            className="w-full h-full object-cover"
                            alt="Spicy Kitchen Gorkha Center Active"
                          />
                          <div className="absolute inset-0 bg-black/10" />

                          {/* Label Badge */}
                          <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-xs px-3 py-1.5 border border-white/10 rounded-xs select-none">
                            <span className="text-[9px] tracking-widest text-[#FAF8F5] uppercase font-semibold">
                              {idxToLabel(slide.idx)}
                            </span>
                          </div>

                          {/* Hover hint */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none lg:pointer-events-auto">
                            <span className="text-[9px] tracking-widest text-accent uppercase font-bold border border-accent px-3 py-1.5 bg-black/50">
                              {t("VIEW PHOTO", "拡大表示")}
                            </span>
                          </div>
                        </motion.div>
                      );
                    } else {
                      return (
                        <motion.div
                          key={slide.key}
                          layout
                          onClick={() => setActiveAmbience(slide.idx)}
                          className="hidden sm:block w-[180px] md:w-[260px] aspect-[4/3] md:aspect-square rounded-sm overflow-hidden border border-white/5 opacity-30 scale-90 cursor-pointer hover:opacity-55 shrink-0"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <motion.img
                            layout="position"
                            src={slide.key}
                            className="w-full h-full object-cover"
                            alt="Spicy Kitchen Gorkha Preview Side"
                          />
                        </motion.div>
                      );
                    }
                  })}
                </div>
              </LayoutGroup>
            );
          })()}

          {/* Dots Navigation indicator */}
          <div className="mt-8 flex justify-center gap-2 select-none">
            {ambienceImages.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveAmbience(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === activeAmbience ? "bg-accent w-6" : "bg-foreground/25 hover:bg-foreground/50"
                  } w-2`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. OUR STORY SECTION */}
      <section id="about-section" className="py-24 bg-card text-foreground">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Block */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold">
              {t("OUR STORY", "私たちの物語")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight text-foreground">
              {t("A Culinary Journey Rooted in Tradition", "伝統に深く根ざした美食の旅")}
            </h2>

            <div className="h-[2px] w-16 bg-accent/70 mx-auto lg:mx-0 my-4" />

            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              {t(
                "At Spicy Kitchen Gorkha, every dish tells a story of heritage, passion, and the rich culinary traditions of Nepal and India. We use the freshest ingredients and authentic spices to create flavors that stay with you forever.",
                "スパイシーキッチンゴルカでは、一皿一皿が歴史、情熱、そしてネパールとインドの豊かな美食の伝統を語りかけます。私たちは常に新鮮な食材と、独自ブレンドされた本場スパイスをふんだんに使用し、お客様の心に残り続ける美味しさをご提供します。"
              )}
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-accent text-accent hover:bg-accent/15 font-bold text-xs tracking-wider uppercase transition-all rounded-xs"
              >
                {t("DISCOVER OUR STORY", "ストーリーをさらに詳しく")}
              </Link>
            </div>
          </div>

          {/* Right Images Collage */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

            {/* Left Large Photo */}
            <div className="col-span-1 md:col-span-7 h-[280px] md:h-[420px] rounded-sm overflow-hidden shadow-2xl relative bg-card">
              <img
                src={resolveImage("/assets/hall.jpeg")}
                alt="Cozy dining layout"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* Right Multi Stack */}
            <div className="col-span-1 md:col-span-5 flex flex-row md:flex-col gap-4">

              <div className="h-[130px] md:h-[200px] w-1/2 md:w-full rounded-sm overflow-hidden shadow-xl relative bg-card">
                <img
                  src={resolveImage("/assets/chef.jpg")}
                  alt="Chef cooking with fire"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

              <div className="h-[130px] md:h-[200px] w-1/2 md:w-full rounded-sm overflow-hidden shadow-xl relative bg-card">
                <img
                  src={resolveImage("/assets/menu-set.jpg")}
                  alt="Authentic tandoori layout"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. TESTIMONIAL REVIEWS */}
      <section className="py-24 relative overflow-hidden bg-background">
        {/* Soft Amber Ambient Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 text-left">
              <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-accent font-bold">
                {t("· GUEST REVIEWS ·", "・お客様の声・")}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-foreground font-semibold">
                {t("Guest Testimonials", "愛される味わいと信頼")}
              </h2>
              <div className="gold-divider my-2" />
            </div>
          </div>

          {/* Testimonials Slider Track Container */}
          <div className="relative group/testimonials">
            {/* Left and Right Nav Buttons */}
            {localTestimonials.length > 0 && (
              <>
                <button
                  onClick={() => scrollTestimonials("left")}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent shadow-md transition-all opacity-0 group-hover/testimonials:opacity-100 active:scale-95 cursor-pointer"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollTestimonials("right")}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-accent hover:border-accent shadow-md transition-all opacity-0 group-hover/testimonials:opacity-100 active:scale-95 cursor-pointer"
                  aria-label="Next testimonials"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div
              ref={testimonialScrollRef}
              onScroll={handleTestimonialScroll}
              className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none gap-6 pb-8 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {localTestimonials.map((item) => {
                const initials = item.author
                  ? item.author
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                  : "G";

                return (
                  <div
                    key={item.id}
                    className="snap-center shrink-0 w-full sm:w-[300px] md:w-[330px] bg-card border-2 border-accent/40 hover:border-accent rounded-xl p-6 relative flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(170,132,20,0.25)] transition-all duration-300 transform hover:-translate-y-1.5 group select-none overflow-hidden"
                  >
                    {/* Large decorative quotation mark */}
                    <span className="absolute top-4 right-6 text-accent/10 text-6xl font-serif select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      “
                    </span>

                    <div className="space-y-3 relative z-10">
                      {/* Stars */}
                      <div className="flex gap-1 text-accent">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-current" />
                        ))}
                        {Array.from({ length: 5 - item.rating }).map((_, i) => (
                          <Star key={i} size={11} className="opacity-20" />
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="text-xs text-foreground/85 font-light leading-relaxed italic line-clamp-4 h-20">
                        "{language === "ja" ? item.jp_text || item.text : item.text}"
                      </p>
                    </div>

                    {/* Divider line in card */}
                    <div className="w-full h-[1px] bg-border/20 my-4" />

                    {/* Author and Like action */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        {/* Avatar initials with gold gradient */}
                        <div className="w-8 h-8 rounded-full bg-gradient-gold text-accent-foreground font-bold text-[10px] flex items-center justify-center shadow-md select-none">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground tracking-wide group-hover:text-accent transition-colors duration-300">
                            {language === "ja" ? item.jp_author || item.author : item.author}
                          </span>
                          <span className="text-[8px] text-muted-foreground uppercase tracking-widest">
                            {t("Verified Guest", "認証ゲスト")}
                          </span>
                        </div>
                      </div>

                      {/* Like button pills */}
                      <button
                        onClick={() => handleLike(item.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 hover:bg-accent/15 border border-border/20 hover:border-accent/35 text-muted-foreground hover:text-accent transition-all duration-300 text-[9px] font-bold cursor-pointer"
                      >
                        <Heart size={9} className="fill-current text-secondary group-hover:scale-110 transition-transform duration-300" />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination dots */}
          {localTestimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {localTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeTestimonialIdx === index
                      ? "w-6 bg-accent"
                      : "w-2 bg-foreground/25 hover:bg-foreground/50"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Action trigger button */}
          <div className="pt-14 text-center">
            <button
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center px-6 py-3.5 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-wider uppercase rounded-full shadow-lg shadow-accent/15 hover:shadow-accent/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t("Write a Review", "レビューを投稿する")}
            </button>
          </div>
        </div>
      </section>



      {/* 7. BOOK YOUR TABLE RESERVE STRIP */}
      <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: "url('/assets/interior.jpg')" }}>
        {/* Dark/Light Blurry Backdrop */}
        <div className={`absolute inset-0 backdrop-blur-xs transition-colors duration-300 ${theme === "light" ? "bg-[#FAF8F5]/90" : "bg-black/85"
          }`} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold">
              {t("BOOK YOUR TABLE", "お席のご予約")}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-semibold leading-tight">
              {t("Ready for an Unforgettable Dining Experience?", "忘れられない食体験を楽しむ準備はできましたか？")}
            </h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              {t(
                "Reserve your table now and enjoy an exceptional culinary journey.",
                "今すぐお席をご予約し、極上の美食の旅をお楽しみください。"
              )}
            </p>
          </div>

          {/* Reserve Action Button */}
          <a
            href={TABELOG_RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-gold text-[#1A1A1A] hover:opacity-90 font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-all shadow-xl hover:scale-105 active:scale-95 select-none whitespace-nowrap shrink-0"
          >
            {t("BOOK A TABLE", "席を予約する")}
          </a>
        </div>
      </section>

      {/* 8. TESTIMONIAL REVIEW DIALOG MODAL */}
      <AnimatePresence>
        {reviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setReviewOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card border border-border/80 p-6 md:p-8 rounded-sm max-w-md w-full shadow-2xl z-10 text-foreground"
            >
              <button
                onClick={() => setReviewOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <h3 className="font-serif text-2xl font-bold mb-6">
                {t("Write a Review", "レビューを投稿する")}
              </h3>

              {reviewSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-sm font-semibold">{t("Review Submitted!", "投稿完了いたしました！")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("Thank you for sharing your experience.", "貴重なお声をいただきありがとうございます。")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      {t("Your Name", "お名前")}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-background border border-border text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground block">
                      {t("Rating", "評価")}
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="text-accent focus:outline-none"
                        >
                          <Star
                            size={18}
                            className={star <= reviewRating ? "fill-current" : "text-muted-foreground/30"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      {t("Your Review", "レビュー本文")}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t("Share your experience with us...", "スパイスやナンの美味しさ、店内の感想など...")}
                      className="w-full bg-background border border-border text-xs px-3 py-2.5 rounded-sm focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full py-3 bg-[#C0392B] hover:bg-[#A92E22] text-white font-bold text-xs tracking-wider uppercase rounded-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {reviewLoading && <Loader2 size={13} className="animate-spin" />}
                    <span>{t("Submit Review", "レビューを送信")}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. IMAGE ZOOM LIGHTBOX */}
      <AnimatePresence>
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-accent"
              aria-label="Close image"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImg}
              alt="Ambience Zoom Preview"
              className="max-h-[90vh] max-w-[95vw] object-contain rounded-xs border border-white/10 shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>

      {/* DISH DETAIL POPUP MODAL */}
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
                    src={resolveImage(selectedDish.featured_image_url || selectedDish.image_url || selectedDish.image)}
                    alt={selectedDish.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] tracking-[0.25em] text-accent uppercase font-bold">
                      {categories.find((c: any) => c.id === selectedDish.category_id)?.title || getCategoryLabel(selectedDish.category_id)}
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
                              className={`py-1.5 text-[9px] tracking-wider uppercase font-semibold border rounded-sm transition-all ${selectedSpice === item.level
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
