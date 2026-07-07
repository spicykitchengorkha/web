"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { resolveImage } from "@/lib/asset-map";

function BannerForm({ onSave, onCancel, isPending, initialData }: { onSave: (d: any) => void; onCancel: () => void; isPending: boolean; initialData?: any }) {
  const [data, setData] = useState(initialData ? {
    ...initialData,
    jp_title: initialData.jp_title || "",
    jp_kicker: initialData.jp_kicker || "",
    jp_subtitle: initialData.jp_subtitle || "",
    buttons: initialData.buttons || [],
  } : {
    title: "", jp_title: "", kicker: "", jp_kicker: "", subtitle: "", jp_subtitle: "",
    image_url: "", buttons: [], sort_order: 0, active: true,
  });
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const addButton = () => setData((d: any) => ({
    ...d,
    buttons: [...(d.buttons || []), { label: "Learn More", jp_label: "詳細はこちら", link: "/", style: "primary" }],
  }));

  const removeButton = (idx: number) => setData((d: any) => ({
    ...d,
    buttons: d.buttons.filter((_: any, i: number) => i !== idx),
  }));

  const updateButton = (idx: number, key: string, val: string) => setData((d: any) => ({
    ...d,
    buttons: d.buttons.map((btn: any, i: number) => i === idx ? { ...btn, [key]: val } : btn),
  }));

  return (
    <div className="space-y-5">
      <ImageUpload value={data.image_url} onChange={url => set("image_url", url)} aspectRatio="aspect-video" />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Image URL</label>
          <input value={data.image_url} onChange={e => set("image_url", e.target.value)} placeholder="URL..." className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Sort Order</label>
          <input type="number" value={data.sort_order} onChange={e => set("sort_order", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Kicker (EN)</label>
          <input value={data.kicker} onChange={e => set("kicker", e.target.value)} placeholder="e.g. Authentic Flavors" className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Kicker (JP)</label>
          <input value={data.jp_kicker} onChange={e => set("jp_kicker", e.target.value)} placeholder="例: 本場の味" className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Main Title (EN)</label>
          <input value={data.title} onChange={e => set("title", e.target.value)} placeholder="e.g. NAMASTE & WELCOME" className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Main Title (JP)</label>
          <input value={data.jp_title} onChange={e => set("jp_title", e.target.value)} placeholder="ヒマラヤの味..." className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Subtitle (EN)</label>
          <textarea value={data.subtitle} onChange={e => set("subtitle", e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Subtitle (JP)</label>
          <textarea value={data.jp_subtitle} onChange={e => set("jp_subtitle", e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Action Buttons</label>
          <button type="button" onClick={addButton} className="text-xs text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Button
          </button>
        </div>
        {(data.buttons ?? []).map((btn: any, idx: number) => (
          <div key={idx} className="grid grid-cols-4 gap-2 bg-white/[0.02] rounded-lg p-3 border border-white/[0.06]">
            <input value={btn.label} onChange={e => updateButton(idx, "label", e.target.value)} placeholder="Label (EN)" className="bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30" />
            <input value={btn.jp_label || ""} onChange={e => updateButton(idx, "jp_label", e.target.value)} placeholder="ラベル (JP)" className="bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30" />
            <input value={btn.link} onChange={e => updateButton(idx, "link", e.target.value)} placeholder="Link" className="bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30" />
            <div className="flex gap-2">
              <select value={btn.style} onChange={e => updateButton(idx, "style", e.target.value)} className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                <option value="primary">Gold</option>
                <option value="outline">Outline</option>
              </select>
              <button onClick={() => removeButton(idx)} className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {(!data.buttons || data.buttons.length === 0) && (
          <p className="text-xs text-zinc-700 text-center italic py-2">No buttons added to this slide</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
        <button
          disabled={!data.title || !data.image_url || isPending}
          onClick={() => onSave(data)}
          className="px-5 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-xl transition-colors"
        >
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Slide"}
        </button>
      </div>
    </div>
  );
}

function BannerCard({ banner, onSave, onDelete }: { banner: any; onSave: (d: any) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    setImgSrc(resolveImage(banner.image_url));
  }, [banner.image_url]);

  const handleImageError = () => {
    setImgSrc("/assets/hero-curry.jpg");
  };

  return (
    <div className={`bg-[#181820] border rounded-xl overflow-hidden transition-all ${editing ? "border-amber-500/30" : "border-white/[0.06] hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/[0.01]"} ${!banner.active ? "opacity-60" : ""}`}>
      {!editing ? (
        <div className="flex h-40">
          <div className="w-1/3 shrink-0 relative bg-zinc-900 overflow-hidden border-r border-white/[0.04]">
            <img
              src={imgSrc}
              onError={handleImageError}
              alt={banner.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className={`absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider select-none ${banner.active ? "text-amber-400" : "text-zinc-500"}`}>
              {banner.active ? "★★★★★" : "INACTIVE"}
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center z-10">
              <span className="text-zinc-300 text-[9px] font-bold">#{banner.sort_order}</span>
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between min-w-0 font-sans">
            <div>
              <p className="text-[9px] uppercase font-bold text-amber-500/80 tracking-wider truncate mb-1">
                {banner.kicker || "Hero Banner"}
              </p>
              <div className="flex items-start justify-between gap-2">
                <h4
                  className="text-sm font-semibold text-white truncate flex-1 leading-snug"
                  dangerouslySetInnerHTML={{ __html: banner.title || "" }}
                />
                <span className={`text-sm font-bold shrink-0 ${banner.active ? "text-amber-400" : "text-zinc-500"}`}>
                  {banner.active ? "Active" : "Inactive"}
                </span>
              </div>
              {banner.jp_title && banner.jp_title !== banner.title && (
                <p
                  className="text-[10px] text-zinc-550 mt-0.5 truncate leading-tight font-jp"
                  dangerouslySetInnerHTML={{ __html: banner.jp_title }}
                />
              )}
              <p className="text-xs text-zinc-500 mt-2 line-clamp-1 italic leading-relaxed">
                {banner.subtitle || "No description provided."}
              </p>

              {/* Button badge previews */}
              {banner.buttons && banner.buttons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {banner.buttons.map((btn: any, i: number) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-bold select-none ${
                        btn.style === "primary"
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-zinc-400 bg-white/5 border-white/10"
                      }`}
                    >
                      {btn.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

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
                onClick={() => { if (confirm("Delete this slide?")) onDelete(); }}
                className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 rounded-md transition-colors cursor-pointer"
                title="Delete Slide"
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
          <BannerForm
            initialData={banner}
            onSave={d => { onSave(d); setEditing(false); }}
            onCancel={() => setEditing(false)}
            isPending={false}
          />
        </div>
      )}
    </div>
  );
}

export default function BannersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const qc = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const { data } = await api.get("/admin/banners");
      return data as any[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "banners"] });

  const add = useMutation({
    mutationFn: (payload: any) => api.post("/admin/banners", payload),
    onSuccess: () => { setAddOpen(false); invalidate(); },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to add"),
  });

  const update = useMutation({
    mutationFn: (row: any) => api.put(`/admin/banners/${row.id}`, row),
    onSuccess: invalidate,
    onError: (e: any) => alert(e.response?.data?.message || "Update failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/banners/${id}`),
    onSuccess: invalidate,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Hero Banners</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage the sliding images on your homepage</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Slide
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-xl" />)}
        </div>
      ) : (banners ?? []).length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/[0.06] rounded-xl text-zinc-600 text-sm">
          No hero slides found. Add your first slide.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(banners ?? []).map((b: any) => (
            <BannerCard
              key={b.id}
              banner={b}
              onSave={data => update.mutate(data)}
              onDelete={() => remove.mutate(b.id)}
            />
          ))}
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAddOpen(false)}>
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-5">Add New Slide</h3>
            <BannerForm
              onSave={d => add.mutate(d)}
              onCancel={() => setAddOpen(false)}
              isPending={add.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
