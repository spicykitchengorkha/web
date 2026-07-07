"use client";

import { useEffect, useState } from "react";
import { useApp, CartItem, MenuItem } from "@/context/AppContext";
import { resolveImage } from "@/lib/asset-map";
import { X, Plus, Minus, Trash2, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    t,
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    addToCart,
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset checkout steps on close
      setTimeout(() => {
        setCheckoutStep("cart");
        setName("");
        setPhone("");
        setPickupTime("");
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Upselling helper: recommend Naan if not in cart, or Drink if no drinks
  const getUpsellItems = (): MenuItem[] => {
    const hasNaan = cart.some((c) => c.item.category_id === "cat-naan-rice");
    const hasDrink = cart.some((c) => c.item.category_id === "cat-drinks");

    const list: MenuItem[] = [];
    if (!hasNaan) {
      list.push({
        id: "item-cheese-naan",
        category_id: "cat-naan-rice",
        name: "Cheese Naan",
        jp_name: "チーズナン",
        price: "¥650",
        description: "Soft flatbread baked with mozzarella.",
        featured: true,
        tag: null,
        featured_image_url: "menu-naan",
        image_style: "square",
        spice_level: 0,
        sort_order: 1
      });
    }
    if (!hasDrink) {
      list.push({
        id: "item-mango-lassi",
        category_id: "cat-drinks",
        name: "Mango Lassi",
        jp_name: "マンゴーラッシー",
        price: "¥500",
        description: "Yogurt drink with mango pulp.",
        featured: false,
        tag: null,
        featured_image_url: "menu-drinks",
        image_style: "square",
        spice_level: 0,
        sort_order: 1
      });
    }
    return list;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pickupTime) return;
    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      setLoading(false);
      setCheckoutStep("success");
      clearCart();
    }, 1500);
  };

  const upsells = getUpsellItems();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* DRAWER CONTAINER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col border-l border-border/40 text-foreground"
          >
            {/* HEADER */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif text-xl tracking-wide">
                  {checkoutStep === "success"
                    ? t("Order Placed", "注文完了")
                    : checkoutStep === "form"
                      ? t("Checkout Info", "ご注文手続き")
                      : t("Your Order Cart", "カート")}
                </h2>
                {checkoutStep === "cart" && cartCount > 0 && (
                  <span className="text-xs text-muted-foreground">({cartCount} items)</span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY CONTENT */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              
              {/* SUCCESS STATE */}
              {checkoutStep === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-accent pt-2">
                    {t("Thank you!", "ご注文ありがとうございました")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      "Your order has been transmitted to our kitchen. We are preparing it fresh. Please pick it up at the requested time.",
                      "ご注文を承りました。出来立てをご用意いたしますので、ご指定の時間にお越しください。"
                    )}
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-8 py-3 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-widest uppercase rounded-sm hover:opacity-90 shadow-md"
                  >
                    {t("Back to Menu", "メニューに戻る")}
                  </button>
                </div>
              )}

              {/* CART STATE */}
              {checkoutStep === "cart" && (
                <div className="space-y-6">
                  {cart.length === 0 ? (
                    <div className="py-24 text-center space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t("Your cart is empty.", "カートは空です。")}
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-semibold tracking-wider text-accent border border-accent/40 px-5 py-2.5 hover:bg-accent hover:text-[#1A1A1A] transition-all"
                      >
                        {t("Browse Menu", "メニューをみる")}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* CART ITEMS LIST */}
                      <div className="space-y-4">
                        {cart.map((cartItem) => {
                          const spiceLabels = [t("Mild", "甘口"), t("Medium", "中辛"), t("Hot", "辛口")];
                          return (
                            <motion.div
                              layout
                              key={`${cartItem.item.id}-${cartItem.selectedSpice}`}
                              className="flex items-center gap-4 bg-muted/20 border border-border/20 p-3 rounded-md"
                            >
                              <img
                                src={resolveImage(cartItem.item.featured_image_url)}
                                alt={cartItem.item.name}
                                className="w-16 h-16 object-cover rounded-sm bg-muted"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-sm truncate">{cartItem.item.name}</h4>
                                <p className="text-[10px] text-muted-foreground truncate">{cartItem.item.jp_name}</p>
                                <p className="text-[10px] text-accent font-semibold mt-1">
                                  {spiceLabels[cartItem.selectedSpice ?? 1]}
                                </p>
                                <p className="text-sm font-serif text-accent mt-0.5">{cartItem.item.price}</p>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 border border-border/50 rounded-sm bg-card p-1">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        cartItem.item.id,
                                        cartItem.quantity - 1,
                                        cartItem.selectedSpice
                                      )
                                    }
                                    className="p-0.5 hover:bg-muted text-foreground"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs w-4 text-center font-medium">
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        cartItem.item.id,
                                        cartItem.quantity + 1,
                                        cartItem.selectedSpice
                                      )
                                    }
                                    className="p-0.5 hover:bg-muted text-foreground"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <button
                                  onClick={() =>
                                    removeFromCart(cartItem.item.id, cartItem.selectedSpice)
                                  }
                                  className="text-muted-foreground/60 hover:text-[#C0392B] transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* UPSELL SECTION */}
                      {upsells.length > 0 && (
                        <div className="border-t border-border/40 pt-6 space-y-3">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                            {t("Complete Your Platter", "おすすめの追加一品")}
                          </h4>
                          {upsells.map((up) => (
                            <div
                              key={up.id}
                              className="flex items-center justify-between gap-3 bg-muted/10 border border-dashed border-border/60 p-2.5 rounded-sm"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={resolveImage(up.featured_image_url)}
                                  alt={up.name}
                                  className="w-10 h-10 object-cover rounded-sm"
                                />
                                <div>
                                  <h5 className="font-serif text-xs leading-none">{up.name}</h5>
                                  <p className="text-[9px] text-muted-foreground mt-1">{up.price}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(up, 1, 0)}
                                className="text-[10px] font-semibold tracking-wider text-accent border border-accent/20 px-3 py-1.5 hover:bg-accent hover:text-[#1A1A1A] transition-all rounded-sm"
                              >
                                {t("Add", "追加")}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* CHECKOUT INFO FORM */}
              {checkoutStep === "form" && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                      {t("Your Name", "お名前")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("e.g. Yamada Taro", "例: 山田 太郎")}
                      className="w-full bg-muted/20 border border-border/60 text-sm p-3 rounded-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                      {t("Phone Number", "電話番号")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("e.g. 090-0000-0000", "例: 090-0000-0000")}
                      className="w-full bg-muted/20 border border-border/60 text-sm p-3 rounded-sm focus:outline-none focus:border-accent text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-accent font-bold block">
                      {t("Expected Pickup Time", "お受取り希望時間")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-muted/20 border border-border/60 text-sm p-3 rounded-sm focus:outline-none focus:border-accent text-foreground"
                    />
                    <span className="text-[9px] text-muted-foreground block pt-0.5">
                      {t("Pickup available 11:30–14:00, 17:30–21:30", "受取時間: 11:30〜14:00、17:30〜21:30")}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border/40 space-y-4">
                    <div className="flex justify-between font-serif text-base text-accent">
                      <span>{t("Total Amount", "お支払合計")}</span>
                      <span>¥{cartTotal.toLocaleString()}</span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm shadow-md hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        t("Confirm & Place Order", "注文を確定する")
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("cart")}
                      className="w-full py-3 border border-border/60 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground text-center"
                    >
                      {t("Back to Cart", "カートに戻る")}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* DRAWER FOOTER (FOR SUBTOTALS & CHECKOUT TRIGGERS) */}
            {checkoutStep === "cart" && cart.length > 0 && (
              <div className="p-6 border-t border-border/50 space-y-4 bg-muted/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">{t("Subtotal", "小計")}</span>
                  <span className="font-serif text-xl text-accent">¥{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full py-4 bg-gradient-gold text-[#1A1A1A] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity rounded-sm shadow-md shadow-accent/10 group"
                >
                  <span>{t("Proceed to Checkout", "注文へ進む")}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
