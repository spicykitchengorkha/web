"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AmbiencePage() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ["admin", "site_content"],
    queryFn: async () => {
      const { data } = await api.get("/site-content");
      return data as Record<string, string>;
    },
  });

  useEffect(() => {
    if (content) setDraft(content);
  }, [content]);

  const update = useMutation({
    mutationFn: (payload: Record<string, string>) => api.post("/admin/site-content", { content: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_content"] });
      qc.invalidateQueries({ queryKey: ["admin", "site_content"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to save"),
  });

  const handleChange = (key: string, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const val = (key: string) => draft[key] ?? "";
  const isDirty = JSON.stringify(draft) !== JSON.stringify(content);

  let slides: any[] = [];
  try {
    slides = draft["ambience.slides"]
      ? JSON.parse(draft["ambience.slides"])
      : [
          { image: "/assets/interior.jpg", label_en: "MAIN DINING ROOM", label_jp: "メインダイニング" },
          { image: "/assets/menu-set.jpg", label_en: "TRADITIONAL SPECIAL THALI SET", label_jp: "伝統的なヒマラヤ御膳セット" },
          { image: "/assets/menu-tandoori.jpg", label_en: "FRESH COOKED TANDOORI MEATS", label_jp: "炭火タンドリー窯での調理" },
          { image: "/assets/menu-drinks.jpg", label_en: "SIGNATURE HIMALAYAN DRINKS", label_jp: "ヒマラヤン特製カクテル" },
          { image: "/assets/spices.jpg", label_en: "HANDGROUND ORGANIC SPICES", label_jp: "手挽きした有機スパイス" },
        ];
  } catch (e) {
    slides = [];
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ambience Slider Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage the image slideshow, headers, and descriptions for the "Moments & Memories" section</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDraft(content ?? {})}
            disabled={!isDirty || update.isPending}
            className="px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-200 disabled:opacity-40 border border-white/10 hover:border-white/20 rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset
          </button>
          <button
            onClick={() => update.mutate(draft)}
            disabled={!isDirty || update.isPending}
            className="px-5 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                </svg>
                {update.isPending ? "Saving..." : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 space-y-6">
        {/* Texts section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white mb-2">Ambiance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Section Title</label>
              <input
                type="text"
                value={val("ambiance.title")}
                onChange={e => handleChange("ambiance.title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                placeholder="e.g. Moments & Memories"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Signature Quote</label>
              <input
                type="text"
                value={val("quote.text")}
                onChange={e => handleChange("quote.text", e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                placeholder="e.g. Cooking is a language that speaks of where we come from..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Body Description</label>
            <textarea
              value={val("ambiance.body")}
              onChange={e => handleChange("ambiance.body", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              placeholder="Description..."
            />
          </div>
        </div>

        {/* Slides section */}
        <div className="border-t border-white/[0.06] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ambience Slideshow Slides</h3>
            <button
              type="button"
              onClick={() => {
                const newSlides = [...slides, { image: "", label_en: "New Slide", label_jp: "新しいスライド" }];
                handleChange("ambience.slides", JSON.stringify(newSlides));
              }}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((slide, idx) => {
              const updateSlide = (key: string, valStr: string) => {
                const newSlides = slides.map((s, i) => i === idx ? { ...s, [key]: valStr } : s);
                handleChange("ambience.slides", JSON.stringify(newSlides));
              };

              const removeSlide = () => {
                const newSlides = slides.filter((_, i) => i !== idx);
                handleChange("ambience.slides", JSON.stringify(newSlides));
              };

              const moveSlide = (dir: "up" | "down") => {
                const newSlides = [...slides];
                const targetIdx = dir === "up" ? idx - 1 : idx + 1;
                if (targetIdx < 0 || targetIdx >= newSlides.length) return;
                // Swap items
                const temp = newSlides[idx];
                newSlides[idx] = newSlides[targetIdx];
                newSlides[targetIdx] = temp;
                handleChange("ambience.slides", JSON.stringify(newSlides));
              };

              return (
                <div key={idx} className="flex gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl items-start">
                  {/* Slide Image Uploader */}
                  <div className="w-32 shrink-0">
                    <ImageUpload
                      value={slide.image}
                      onChange={(url) => updateSlide("image", url)}
                      aspectRatio="aspect-square"
                    />
                  </div>

                  {/* Slide Fields */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Label (EN)</label>
                        <input
                          type="text"
                          value={slide.label_en || ""}
                          onChange={(e) => updateSlide("label_en", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                          placeholder="e.g. MAIN DINING ROOM"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Label (JP)</label>
                        <input
                          type="text"
                          value={slide.label_jp || ""}
                          onChange={(e) => updateSlide("label_jp", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                          placeholder="例: メインダイニング"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Reordering actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveSlide("up")}
                          disabled={idx === 0}
                          className="p-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide("down")}
                          disabled={idx === slides.length - 1}
                          className="p-1 rounded-md bg-white/5 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={removeSlide}
                        className="px-2.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {slides.length === 0 && (
              <p className="text-xs text-zinc-600 text-center py-4 italic border border-dashed border-white/5 rounded-xl">
                No slides added yet. Click "Add Slide" to begin.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
