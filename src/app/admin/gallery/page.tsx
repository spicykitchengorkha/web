"use client";

import { useState } from "react";
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

function GalleryCard({ row, onSave, onDelete }: { row: any; onSave: (d: any) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState(row);
  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));

  return (
    <div className={`bg-[#1C1C1C] border-2 rounded-xl overflow-hidden group transition-all duration-300 relative flex flex-col justify-between ${editing ? "border-[#AA8414]" : "border-[#AA8414]/20 hover:border-[#AA8414]"
      }`}>
      {/* Top Image area */}
      <div className="aspect-square relative overflow-hidden bg-zinc-950">
        {editing ? (
          <ImageUpload
            value={draft.image_url}
            onChange={(url) => set("image_url", url)}
            aspectRatio="aspect-square"
          />
        ) : row.image_url ? (
          <img
            src={resolveImage(row.image_url)}
            alt={row.caption || "Gallery image"}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${!row.visible ? "grayscale opacity-40" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No image</div>
        )}
        {!row.visible && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-zinc-400 backdrop-blur-sm border border-white/10">Hidden</span>
          </div>
        )}

        {/* Caption Overlay directly on image */}
        {!editing && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 z-10">
            <p className="text-[10px] text-zinc-200 font-medium truncate">
              {row.caption || <span className="italic text-zinc-500">No caption</span>}
            </p>
          </div>
        )}

        {/* 3-dot overlay button */}
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
            title="Menu"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-1 w-36 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl py-1 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onSave({ ...row, visible: !row.visible });
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                {row.visible ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Show</span>
                  </>
                )}
              </button>
              <div className="border-t border-white/[0.06] my-1" />
              <button
                onClick={() => {
                  if (confirm("Remove this image?")) onDelete();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col justify-between flex-grow">
          {/* Inputs Section */}
          <div className="p-4 space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Caption</label>
              <input
                value={draft.caption || ""}
                onChange={e => set("caption", e.target.value)}
                placeholder="Caption..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">URL or Key</label>
              <input
                value={draft.image_url || ""}
                onChange={e => set("image_url", e.target.value)}
                placeholder="URL or Key"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Sort</label>
                <input
                  type="number"
                  value={draft.sort_order || 0}
                  onChange={e => set("sort_order", Number(e.target.value))}
                  placeholder="Sort order"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Span</label>
                <input
                  value={draft.span || ""}
                  onChange={e => set("span", e.target.value)}
                  placeholder="e.g. col-span"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>
          {/* Action Row */}
          <div className="px-4 pb-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => { setDraft(row); setEditing(false); }}
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSave(draft); setEditing(false); }}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-[#AA8414] hover:bg-[#AA8414]/80 text-[#111118] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function GalleryPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newSpan, setNewSpan] = useState("");
  const [newSortOrder, setNewSortOrder] = useState<number | "">("");
  const qc = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: async () => {
      const { data } = await api.get("/admin/gallery");
      return data as any[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const update = useMutation({
    mutationFn: (row: any) => api.put(`/admin/gallery/${row.id}`, row),
    onSuccess: invalidate,
    onError: (e: any) => alert(e.response?.data?.message || "Update failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/gallery/${id}`),
    onSuccess: invalidate,
  });

  const add = useMutation({
    mutationFn: () => api.post("/admin/gallery", {
      image_url: newUrl,
      caption: newCaption,
      span: newSpan || null,
      sort_order: newSortOrder !== "" ? Number(newSortOrder) : ((images?.length ?? 0) + 1) * 10,
      visible: true,
    }),
    onSuccess: () => {
      setNewUrl("");
      setNewCaption("");
      setNewSpan("");
      setNewSortOrder("");
      setAddOpen(false);
      invalidate();
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to add"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gallery Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Curate the visual experience of your restaurant</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Image
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-xl" />)}
        </div>
      ) : (images ?? []).length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/[0.06] rounded-xl text-zinc-600 text-sm">
          <svg className="w-10 h-10 mx-auto mb-3 text-zinc-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          Your gallery is empty. Add your first image.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-start">
          {(images ?? []).map((g: any) => (
            <GalleryCard
              key={g.id}
              row={g}
              onSave={data => update.mutate(data)}
              onDelete={() => remove.mutate(g.id)}
            />
          ))}
        </div>
      )}

      {/* Add dialog */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAddOpen(false)}>
          <div
            className="bg-[#1C1C1C] border-2 border-[#AA8414] rounded-xl overflow-hidden w-full max-w-[320px] sm:max-w-[340px] shadow-2xl relative flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Image Upload Zone */}
            <div className="relative bg-zinc-950 p-2 border-b border-white/[0.06]">
              <ImageUpload value={newUrl} onChange={setNewUrl} aspectRatio="aspect-video" />
            </div>

            {/* Form body */}
            <div className="p-4 space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Caption</label>
                <input
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  placeholder="Caption..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">URL or Key</label>
                <input
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="URL or Key"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Sort</label>
                  <input
                    type="number"
                    value={newSortOrder !== "" ? newSortOrder : ""}
                    onChange={e => setNewSortOrder(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="Sort order"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest text-[#AA8414] uppercase font-bold">Span</label>
                  <input
                    value={newSpan}
                    onChange={e => setNewSpan(e.target.value)}
                    placeholder="e.g. col-span"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Bottom action row */}
            <div className="px-4 pb-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => setAddOpen(false)}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!newUrl || add.isPending}
                onClick={() => add.mutate()}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-[#AA8414] hover:bg-[#AA8414]/80 disabled:opacity-50 text-[#111118] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{add.isPending ? "Adding..." : "Add"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
