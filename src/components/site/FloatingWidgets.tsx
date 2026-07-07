"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { MessageCircle, Calendar, ShoppingCart } from "lucide-react";

export default function FloatingWidgets() {
  const { t } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after scrolling 300px
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
