"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ja" | "en";
export type Theme = "light" | "dark";

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  jp_name: string;
  description: string;
  jp_description?: string;
  price: string;
  spice_level: number | null;
  tag: string | null;
  featured: boolean;
  featured_image_url: string | null;
  image_style: "square" | "video" | "portrait" | "wide" | null;
  sort_order: number;
};
export type MenuCategory = {
  id: string;
  slug: string;
  title: string;
  jp_title: string;
  image_url: string | null;
  sort_order: number;
  items?: MenuItem[];
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
  selectedSpice?: number; // 0: Mild, 1: Medium, 2: Hot
};

const translations: Record<string, Record<string, string>> = {
  ja: {
    "View Menu": "メニューを見る",
    "A calm, candlelit dining room in Kurosaki serving authentic flavors.":
      "黒崎の静かなキャンドルの灯る店内で、本格的な味わいをお楽しみください。",
    "Our Story": "私たちの物語",
    Reserve: "ご予約",
    "Authentic Nepalese & Indian": "本格ネパール・インド料理",
    "Flavors of the <em>Himalayas</em> in Kitakyushu": "北九州で味わう<em>ヒマラヤ</em>の味",
    "A calm, candlelit dining room in Kurosaki serving authentic tandoori, hand-stretched naan, and the signature flavors of Gorkha.":
      "黒崎の静かなキャンドルの灯る店内で、本格的なタンドリー、手延べナン、そしてゴルカ伝統の味をお楽しみください。",
    "A heritage of spice and fire": "スパイスと炎の伝統",
    "At Spicy Kitchen Gorkha, we bring the authentic soul of Nepalese and Indian cuisine to the heart of Kurosaki. Our chefs, hailing from the foothills of the Himalayas, use traditional techniques and charcoal-fired tandoors to craft every dish with patience.":
      "スパイシーキッチン・ゴルカでは、黒崎の中心でネパールとインドの本格的な味わいをお届けします。ヒマラヤの山麓出身のシェフたちが、伝統的な技法と炭火タンドール釜を使い、丹精を込めてすべての料理を作り上げます。",
    "From the precision of our spice blends to the warmth of our hospitality, we invite you to experience an unhurried evening of culinary discovery.":
      "こだわり抜いたスパイスの調合から温かいおもてなしまで、ゆっくりとしたディナータイムをご体験ください。",
    "15+": "15年以上",
    "Years of Heritage": "年の伝統",
    "48h": "48時間",
    "Slow Marinated": "じっくりマリネ",
    "100%": "100%",
    "Handmade Naan": "手作りナン",
    "24": "24種類",
    "Signature Spices": "伝統のスパイス",
    "Cooking is a language that speaks of where we come from and what we value.":
      "料理とは、私たちの出身地や大切にしているものを語る言葉です。",
    "The perfect setting for conversation": "会話を楽しむための最高の空間",
    "Our dining room is designed as a sanctuary from the bustling city outside. Soft lighting, warm woods, and the subtle aroma of incense create an atmosphere where meals are lingered over and memories are made.":
      "店内は賑やかな街から離れた安らぎの空間となるよう設計されています。柔らかな照明、温かみのある木製家具、そしてお香のほのかな香りが、お食事をゆっくりと楽しむ心地よい雰囲気を醸し出します。",
    "Join us for an unhurried evening.": "ゆっくりとした夕べのひとときをお過ごしください。",
    "Reservations recommended on weekends. We hold each table for the full evening.":
      "週末はご予約をお勧めいたします。各テーブルはお客様にゆっくりお過ごしいただけるよう確保しております。",
    "Book a Table": "テーブルを予約する",
    "Serving authentic Nepalese & Indian flavors in the heart of Kurosaki since 2008.":
      "2008年以来、黒崎の中心で本格的なネパール＆インドの味をお届けしています。",
    Tuesdays: "火曜日",
    Closed: "定休日",
    Lunch: "ランチ",
    Dinner: "ディナー",
    "Kurosaki, Kitakyushu": "北九州市八幡西区黒崎",
    "Fukuoka, Japan": "福岡県",
    Japan: "日本",
    "Discover Our Menu": "メニュー",
    "Authentic Flavors, Multiple Choices": "本場の味、多彩な選択肢",
    "From spicy curries and tandoori grills to traditional Himalayan set meals. Explore our diverse range of authentic dishes.":
      "スパイシーなカレーやタンドリーグリルから、伝統的なヒマラヤのセットメニューまで。多彩な本場のお料理をご用意しております。",
    "Explore Full Menu": "全メニューを見る",
    "Guest Voices · 評判": "お客様の声 · 評判",
    "What our guests say": "お客様の声",
    "Overall Rating": "総合評価",
    "View All Items": "メニューを見る",
    Mild: "マイルド",
    Medium: "中辛",
    Hot: "辛口",
    "All chicken & lamb are Halal certified": "チキンとラムはすべてハラール認証を取得しています",
    "Staff Login": "スタッフログイン",
    "Spicy Kitchen Gorkha · Thank you": "スパイシーキッチン・ゴルカ · ありがとうございます",
    "Menu — Spicy Kitchen Gorkha": "メニュー — スパイシーキッチン・ゴルカ",
    "Curries, tandoori, naan & rice, drinks and Himalayan set meals — our full menu of authentic Nepalese & Indian dishes.":
      "カレー、タンドリー、ナン＆ライス、ドリンク、そしてヒマラヤセットメニュー — 本格的なネパール＆インド料理のフルメニュー。",
    "A Journey Through Himalayan Flavors": "ヒマラヤの香りとスパイスを巡る旅",
    "Every dish is crafted with authentic spices and fresh local ingredients. From the tandoor of Nepal to the vibrant streets of India.":
      "新鮮な食材と秘伝 of スパイスで仕上げた一皿一皿。ネパールの窯元タンドールから、インドの活気に満ちた街角の味まで。",
    "Selection in progress...": "準備中...",
    "We are currently updating this section of our menu.":
      "現在、このカテゴリーのメニューを準備・更新しております。",
    "Contact Us": "お問い合わせ",
    "Get in Touch": "ご連絡はこちらから",
    "We welcome your reservations and inquiries. For same-day reservations, please call us directly.":
      "ご予約やお問い合わせをお待ちしております。当日のご予約は直接お電話にてお願いいたします。",
    Address: "住所",
    Phone: "電話番号",
    "Your Name": "お名前",
    "Your Email": "メールアドレス",
    Message: "メッセージ",
    "Send Message": "メッセージを送信",
    "Submitting...": "送信中...",
    "Message sent successfully": "メッセージが送信されました",
    "In the heart of Kurosaki": "黒崎の中心で",
    "Five minutes on foot from JR Kurosaki Station (West Exit). Coin parking available across the street.":
      "JR黒崎駅（西口）から徒歩5分。道路を挟んだ向かい側にコインパーキングがございます。",
    "A glimpse inside": "店内の様子",
    "Quiet corners, charcoal flames, and the dishes that fill our tables.":
      "静かな席、炭火の炎、そしてテーブルを彩る料理たち。",
    Reservation: "ご予約",
    "Reserve your table": "お席の予約",
    "Lunch seatings 11:30–14:00, dinner seatings 17:30–21:30. We hold each table for 2 hours. For parties of 7 or more, please call us on +81 93-000-0000.":
      "ランチ 11:30〜14:00、ディナー 17:30〜21:30。お席のご利用は2時間までとさせていただきます。7名様以上でのご予約は、お電話（093-000-0000）にて直接ご連絡ください。",
    "Reservations Closed": "ご予約の受付停止",
    "Online reservations are currently unavailable. Please contact us directly by phone or social media to book your table.":
      "現在、オンラインでのご予約は受け付けておりません。ご予約はお電話またはSNSにて直接ご連絡ください。",
    "The ambiance here is incredible, and the Butter Chicken is the best I have ever had in Japan.":
      "雰囲気は素晴らしく、バターチキンは日本で食べた中で最高です。",
    "Authentic flavors that take me back to my travels. A hidden gem in Kurosaki.":
      "旅の記憶が蘇る本場の味。黒崎の隠れた名店です。",
    "Tender chicken in a rich, creamy tomato and butter sauce.":
      "コクのあるクリーミーなトマトとバターのソースで煮込んだ柔らかいチキン。",
    "Fresh spinach and cottage cheese cubes with aromatic spices.":
      "新鮮なほうれん草とカッテージチーズに、香り高いスパイスを効かせて。",
    "Classic roasted chicken marinated in yogurt and spices.":
      "ヨーグルトとスパイスに漬け込んで香ばしく焼き上げた定番チキン。",
    "The warm glow of our evening dining room.": "夕暮れ時の温かみある店内の雰囲気。",
    "Freshly baked naan straight from the tandoor.": "タンドール窯から焼き立てのナン。",
    "Page not found": "ページが見つかりません",
    "The page you're looking for doesn't exist or has been moved.":
      "お探しのページは存在しないか、移動された可能性があります。",
    "Go home": "ホームに戻る",
    Overview: "概要",
    "Overview — Spicy Kitchen Gorkha": "概要 — スパイシーキッチン・ゴルカ",
    "Gorkha Admin": "ゴルカ管理画面",
    Menu: "メニュー管理",
    "Access Denied": "アクセス拒否",
    "Your account does not have administrative privileges.":
      "アカウントには管理者権限がありません。",
    "Please contact the system administrator to request the admin role.":
      "管理者ロールをリクエストするには、システム管理者にお問い合わせください。",
    "Your User ID": "ユーザーID",
    "Initializing Dashboard...": "ダッシュボードを初期化中...",
    "Return Home": "ホームに戻る",
  },
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (enText: string, jaText?: string) => string;
  mounted: boolean;
  
  // Cart state
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedSpice?: number) => void;
  removeFromCart: (itemId: string, selectedSpice?: number) => void;
  updateQuantity: (itemId: string, quantity: number, selectedSpice?: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("gorkha_lang");
    if (savedLang === "ja" || savedLang === "en") {
      setLanguageState(savedLang);
    }

    const savedTheme = localStorage.getItem("gorkha_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme);
    } else {
      // Default to dark theme for premium luxury feel
      setThemeState("dark");
    }

    const savedCart = localStorage.getItem("gorkha_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to restore cart state", e);
      }
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("gorkha_lang", language);
    window.document.documentElement.setAttribute("lang", language);
  }, [language, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("gorkha_theme", theme);
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("gorkha_cart", JSON.stringify(cart));
  }, [cart, mounted]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setTheme = (t: Theme) => setThemeState(t);

  const t = (enText: string, jaText?: string) => {
    if (!mounted) {
      if (jaText) return jaText;
      return translations.ja[enText] || enText;
    }
    if (language === "ja") {
      if (jaText) return jaText;
      return translations.ja[enText] || enText;
    }
    return enText;
  };

  // Cart operations
  const parsePrice = (priceStr: string): number => {
    // e.g. "¥1,200" -> 1200
    // e.g. "1200" -> 1200
    const cleaned = priceStr.replace(/[^\d]/g, "");
    return parseInt(cleaned) || 0;
  };

  const addToCart = (item: MenuItem, quantity = 1, selectedSpice = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (c) => c.item.id === item.id && c.selectedSpice === selectedSpice
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevCart, { item, quantity, selectedSpice }];
    });
    setIsCartOpen(true); // Automatically open drawer when item is added
  };

  const removeFromCart = (itemId: string, selectedSpice = 1) => {
    setCart((prevCart) =>
      prevCart.filter((c) => !(c.item.id === itemId && c.selectedSpice === selectedSpice))
    );
  };

  const updateQuantity = (itemId: string, quantity: number, selectedSpice = 1) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSpice);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.item.id === itemId && c.selectedSpice === selectedSpice
          ? { ...c, quantity }
          : c
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const cartTotal = cart.reduce((acc, c) => acc + parsePrice(c.item.price) * c.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        mounted,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
