"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ImageUpload } from "@/components/admin/ImageUpload";

function resolveImage(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  let path = url;
  while (path.startsWith("/")) path = path.substring(1);
  while (path.startsWith("storage/storage/")) {
    path = path.substring(8);
  }
  if (!path.startsWith("storage/")) {
    path = "storage/" + path;
  }
  return `/${path}`;
}

function MenuItemCard({
  item,
  catId,
  categoryName,
  onSave,
  onDelete,
}: {
  item: any;
  catId: string;
  categoryName: string;
  onSave: (d: any) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);
  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  return (
    <div className={`bg-[#181820] border rounded-xl overflow-hidden transition-all ${editing ? "border-amber-500/30" : "border-white/[0.06] hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/[0.01]"}`}>
      {!editing ? (
        <div className="flex h-40">
          {/* Left: Food Image */}
          <div className="w-1/3 shrink-0 relative bg-zinc-900 overflow-hidden border-r border-white/[0.04]">
            {item.image_url ? (
              <img
                src={resolveImage(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">
                No image
              </div>
            )}

            {/* Stars Overlay */}
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-amber-400 font-bold tracking-wider select-none">
              ★★★★★
            </div>

            {/* Spice overlay */}
            {item.spice_level > 0 && (
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded flex gap-0.5 items-center z-10">
                {Array.from({ length: Math.min(item.spice_level, 5) }).map((_, i) => (
                  <span key={i} className="text-red-500 text-xs">🌶️</span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0 font-sans">
            <div>
              {/* Category */}
              <p className="text-[9px] uppercase font-bold text-amber-500/80 tracking-wider truncate mb-1">
                {categoryName || "Menu Item"}
              </p>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-white truncate flex-1 leading-snug">{item.name}</h4>
                <span className="text-sm font-bold text-amber-400 shrink-0">¥{item.price}</span>
              </div>

              {/* Japanese Title */}
              {item.jp_name && (
                <p className="text-[10px] text-zinc-550 mt-0.5 truncate leading-tight font-jp">{item.jp_name}</p>
              )}

              {/* Description */}
              <p className="text-xs text-zinc-500 mt-2 line-clamp-2 italic leading-relaxed">
                {item.description || "No description provided."}
              </p>
            </div>

            {/* Bottom: Action buttons */}
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 mt-2">
              <button
                onClick={() => setEditing(true)}
                className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Click for Detail / Edit
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <button
                onClick={() => { if (confirm("Delete this menu item?")) onDelete(); }}
                className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 rounded-md transition-colors cursor-pointer"
                title="Delete Item"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-white/[0.06] pt-4 space-y-3 font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Name (EN)</label>
              <input
                value={draft.name}
                onChange={e => set("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Name (JP)</label>
              <input
                value={draft.jp_name || ""}
                onChange={e => set("jp_name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Description</label>
            <textarea
              value={draft.description || ""}
              onChange={e => set("description", e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Price (¥)</label>
              <input
                type="number"
                value={String(draft.price || "").replace(/[^\d]/g, "")}
                onChange={e => set("price", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Spice Level</label>
              <input
                type="number"
                min={0}
                max={5}
                value={draft.spice_level || 0}
                onChange={e => set("spice_level", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Sort Order</label>
              <input
                type="number"
                value={draft.sort_order || 0}
                onChange={e => set("sort_order", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!draft.is_featured}
                onChange={e => set("is_featured", e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-400">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!draft.is_spicy}
                onChange={e => set("is_spicy", e.target.checked)}
                className="w-4 h-4 rounded accent-red-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-400">Spicy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.available !== false}
                onChange={e => set("available", e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-400">Available</span>
            </label>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Image</label>
            <ImageUpload
              value={draft.image_url || ""}
              onChange={url => set("image_url", url)}
              aspectRatio="aspect-video"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setDraft(item); setEditing(false); }}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSave(draft); setEditing(false); }}
              className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddItemDialog({
  categoryId,
  categories,
  onClose,
}: {
  categoryId: string;
  categories: any[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [data, setData] = useState({
    category_id: categoryId,
    name: "",
    jp_name: "",
    description: "",
    jp_description: "",
    price: "",
    image_url: "",
    image_style: "square",
    spice_level: 0,
    is_featured: false,
  });

  const set = (k: string, v: any) => setData((d) => ({ ...d, [k]: v }));

  const create = useMutation({
    mutationFn: () => {
      const payload = {
        category_id: data.category_id,
        name: data.name,
        jp_name: data.jp_name || data.name,
        description: data.description || "",
        jp_description: data.jp_description || data.description || "",
        price: String(data.price),
        featured_image_url: data.image_url || "",
        featured: data.is_featured ? 1 : 0,
        spice_level: data.spice_level,
        sort_order: 100,
        image_style: data.image_style,
      };
      return api.post("/admin/menu-items", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "menu"] });
      onClose();
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to add item"),
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-8" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white mb-1 font-serif">Add Menu Item</h3>
        <p className="text-xs text-zinc-500 mb-6 font-sans">Create a new dish for your menu.</p>

        <div className="space-y-4 font-sans">
          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <ImageUpload
              value={data.image_url}
              onChange={url => set("image_url", url)}
              aspectRatio={
                data.image_style === "square"
                  ? "aspect-square"
                  : data.image_style === "video"
                    ? "aspect-video"
                    : data.image_style === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-video"
              }
              className={
                data.image_style === "square"
                  ? "max-h-[220px] mx-auto animate-in fade-in duration-300"
                  : data.image_style === "portrait"
                    ? "max-h-[300px] mx-auto animate-in fade-in duration-300"
                    : "max-h-[220px] mx-auto animate-in fade-in duration-300"
              }
            />
          </div>

          {/* Row 1: Category & Image Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-350">Category</label>
              <select
                value={data.category_id}
                onChange={e => set("category_id", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#111118]">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id} className="bg-[#111118]">
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-355">Image Display</label>
              <select
                value={data.image_style}
                onChange={e => set("image_style", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all cursor-pointer"
              >
                <option value="square" className="bg-[#111118]">Square (1:1)</option>
                <option value="video" className="bg-[#111118]">Wide (16:9)</option>
                <option value="portrait" className="bg-[#111118]">Tall (3:4)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Item Name (English) & Japanese Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-350">Item Name</label>
              <input
                value={data.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Chicken Tikka Masala"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-350">Japanese Name</label>
              <input
                value={data.jp_name}
                onChange={e => set("jp_name", e.target.value)}
                placeholder="e.g. チキンティッカマサラ"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
              />
            </div>
          </div>

          {/* Row 3: English Description & Japanese Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-355">English Description</label>
              <textarea
                value={data.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Describe the flavors..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-355">Japanese Description</label>
              <textarea
                value={data.jp_description}
                onChange={e => set("jp_description", e.target.value)}
                placeholder="日本語の説明を入力..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all resize-none"
              />
            </div>
          </div>

          {/* Row 4: Price & Spice Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-350">Price</label>
              <input
                value={data.price}
                onChange={e => set("price", e.target.value)}
                placeholder="e.g. ¥1,200"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-350">Spice Level (0-3)</label>
              <input
                type="number"
                min={0}
                max={3}
                value={data.spice_level}
                onChange={e => set("spice_level", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_featured}
                onChange={e => set("is_featured", e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-zinc-300">Mark as Featured Item</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!data.name || !data.price || !data.category_id || create.isPending}
            onClick={() => create.mutate()}
            className="px-5 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-lg transition-colors cursor-pointer"
          >
            {create.isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [addItemFor, setAddItemFor] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCat, setNewCat] = useState({ title: "", jp_title: "", slug: "", image_url: "" });
  const [editCategory, setEditCategory] = useState<any | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "menu"],
    queryFn: async () => {
      const [catsRes, itemsRes] = await Promise.all([
        api.get("/admin/menu-categories"),
        api.get("/admin/menu-items"),
      ]);
      const cats = catsRes.data as any[];
      const items = itemsRes.data as any[];

      return cats.map(cat => ({
        ...cat,
        menu_items: items
          .filter(item => item.category_id === cat.id)
          .map(item => ({
            ...item,
            image_url: item.featured_image_url || "",
            is_featured: !!item.featured,
            is_spicy: (item.spice_level ?? 0) > 0,
          }))
      }));
    },
  });

  // Set initial tab when categories load
  useEffect(() => {
    if (!activeTab && categories?.length) {
      setActiveTab(String(categories[0].id));
    }
  }, [categories, activeTab]);

  const updateItem = useMutation({
    mutationFn: (row: any) => {
      const payload = {
        category_id: row.category_id,
        name: row.name,
        jp_name: row.jp_name || row.name,
        description: row.description || "",
        jp_description: row.jp_description || row.description || "",
        price: String(row.price),
        featured_image_url: row.image_url || "",
        featured: row.is_featured ? 1 : 0,
        spice_level: row.is_spicy ? (row.spice_level || 1) : 0,
        sort_order: row.sort_order || 0,
        image_style: row.image_style || "square",
      };
      return api.put(`/admin/menu-items/${row.id}`, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu"] }),
    onError: (e: any) => alert(e.response?.data?.message || "Failed to update"),
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/menu-items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "menu"] }),
  });

  const addCategory = useMutation({
    mutationFn: () => {
      const slug = newCat.slug || newCat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return api.post("/admin/menu-categories", {
        title: newCat.title,
        jp_title: newCat.jp_title || newCat.title,
        slug: slug || "category-" + Date.now(),
        image_url: newCat.image_url || "",
        sort_order: 100,
      });
    },
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["admin", "menu"] });
      if (res?.data?.id) {
        setActiveTab(String(res.data.id));
      }
      setNewCat({ title: "", jp_title: "", slug: "", image_url: "" });
      setShowAddCategory(false);
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to add category"),
  });

  const updateCategory = useMutation({
    mutationFn: (cat: any) => {
      return api.put(`/admin/menu-categories/${cat.id}`, {
        title: cat.title,
        jp_title: cat.jp_title,
        slug: cat.slug,
        image_url: cat.image_url || "",
        sort_order: cat.sort_order || 100,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "menu"] });
      setEditCategory(null);
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to update category"),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/menu-categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "menu"] });
      setActiveTab(null);
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to delete category"),
  });

  const currentCat = categories?.find((c: any) => String(c.id) === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Menu Items</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your restaurant's menu categories and dishes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddItemFor(activeTab || "")}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Item
          </button>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Category tabs */}
          <div className="w-72 shrink-0 space-y-2">
            {(categories ?? []).map((cat: any) => (
              <div
                key={cat.id}
                onClick={() => setActiveTab(String(cat.id))}
                className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${activeTab === String(cat.id)
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "text-zinc-400 hover:text-zinc-200 bg-white/[0.01] border-white/[0.04] hover:bg-white/5"
                  }`}
              >
                {/* Left: Category Image */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/5 shrink-0 relative">
                  {cat.image_url ? (
                    <img
                      src={resolveImage(cat.image_url)}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-650 bg-zinc-950 font-bold uppercase">
                      N/A
                    </div>
                  )}
                </div>

                {/* Center: Category Name & Count */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{cat.title}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{cat.menu_items?.length ?? 0} items</p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddItemFor(cat.id);
                    }}
                    className="p-1 text-zinc-550 hover:text-amber-400 hover:bg-white/5 rounded-md transition-all cursor-pointer"
                    title="Add Item"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCategory(cat);
                    }}
                    className="p-1 text-zinc-550 hover:text-amber-400 hover:bg-white/5 rounded-md transition-all cursor-pointer"
                    title="Edit Category"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete the category "${cat.title}" and all its menu items? This action cannot be undone.`)) {
                        deleteCategory.mutate(cat.id);
                      }
                    }}
                    className="p-1 text-zinc-550 hover:text-red-400 hover:bg-red-500/5 rounded-md transition-all cursor-pointer"
                    title="Delete Category"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="flex-1 space-y-4">
            {currentCat && (
              <>
                {/* Category Header Card */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {currentCat.image_url ? (
                      <div className="h-12 w-20 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
                        <img
                          src={resolveImage(currentCat.image_url)}
                          className="w-full h-full object-cover"
                          alt={currentCat.title}
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-20 rounded-lg border border-dashed border-white/10 bg-zinc-950 shrink-0 flex items-center justify-center text-zinc-600 text-xs">
                        No image
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {currentCat.title}
                        {currentCat.jp_title && (
                          <span className="text-xs text-amber-400 font-medium">
                            {currentCat.jp_title}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                        Menu Category Section
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditCategory(currentCat)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Edit Category
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete the category "${currentCat.title}" and all its menu items? This action cannot be undone.`)) {
                          deleteCategory.mutate(currentCat.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Delete Category
                    </button>
                    <button
                      onClick={() => setAddItemFor(currentCat.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add Item
                    </button>
                  </div>
                </div>
                {(currentCat.menu_items ?? []).length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-white/[0.06] rounded-xl text-zinc-600 text-sm">
                    No items in this category. Add your first item.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {(currentCat.menu_items ?? []).map((item: any) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        catId={currentCat.id}
                        categoryName={currentCat.title}
                        onSave={data => updateItem.mutate(data)}
                        onDelete={() => deleteItem.mutate(item.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Add category dialog */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => {
          setShowAddCategory(false);
          setNewCat({ title: "", jp_title: "", slug: "", image_url: "" });
        }}>
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Add Category</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Category Image</label>
                <ImageUpload
                  value={newCat.image_url}
                  onChange={url => setNewCat(prev => ({ ...prev, image_url: url }))}
                  aspectRatio="aspect-video"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Title (EN)</label>
                  <input
                    value={newCat.title}
                    onChange={e => {
                      const val = e.target.value;
                      setNewCat(prev => ({
                        ...prev,
                        title: val,
                        slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                      }));
                    }}
                    placeholder="e.g. Main Course"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Title (JP)</label>
                  <input
                    value={newCat.jp_title}
                    onChange={e => setNewCat(prev => ({ ...prev, jp_title: e.target.value }))}
                    placeholder="e.g. メインコース"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Slug</label>
                <input
                  value={newCat.slug}
                  onChange={e => setNewCat(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. main-course"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => {
                setShowAddCategory(false);
                setNewCat({ title: "", jp_title: "", slug: "", image_url: "" });
              }} className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
              <button
                disabled={!newCat.title || !newCat.jp_title || addCategory.isPending}
                onClick={() => addCategory.mutate()}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-lg transition-colors"
              >
                {addCategory.isPending ? "Creating..." : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit category dialog */}
      {editCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditCategory(null)}>
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Edit Category</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Category Image</label>
                <ImageUpload
                  value={editCategory.image_url || ""}
                  onChange={url => setEditCategory((prev: any) => ({ ...prev, image_url: url }))}
                  aspectRatio="aspect-video"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Title (EN)</label>
                  <input
                    value={editCategory.title}
                    onChange={e => setEditCategory((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Title (JP)</label>
                  <input
                    value={editCategory.jp_title}
                    onChange={e => setEditCategory((prev: any) => ({ ...prev, jp_title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Slug</label>
                  <input
                    value={editCategory.slug}
                    onChange={e => setEditCategory((prev: any) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Sort Order</label>
                  <input
                    type="number"
                    value={editCategory.sort_order || 0}
                    onChange={e => setEditCategory((prev: any) => ({ ...prev, sort_order: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditCategory(null)} className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
              <button
                disabled={!editCategory.title || !editCategory.jp_title || updateCategory.isPending}
                onClick={() => updateCategory.mutate(editCategory)}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-lg transition-colors"
              >
                {updateCategory.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {addItemFor !== null && <AddItemDialog categoryId={addItemFor} categories={categories || []} onClose={() => setAddItemFor(null)} />}
    </div>
  );
}
