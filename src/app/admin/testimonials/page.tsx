"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const qc = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data } = await api.get("/admin/testimonials");
      return data as any[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    qc.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const setApproved = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      api.put(`/admin/testimonials/${id}`, { approved }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: invalidate,
  });

  const create = useMutation({
    mutationFn: () => api.post("/admin/testimonials", { author, text, rating, approved: true }),
    onSuccess: () => {
      setAuthor(""); setText(""); setRating(5); setAddOpen(false);
      invalidate();
    },
    onError: (e: any) => alert(e.response?.data?.message || "Failed to add"),
  });

  const filtered = (testimonials ?? []).filter(
    (t: any) =>
      t.author?.toLowerCase().includes(search.toLowerCase()) ||
      t.text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Testimonials</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage customer feedback and reviews</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Filter reviews..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111118] border border-white/10 text-white placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-44 bg-white/5 animate-pulse rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/[0.06] rounded-xl text-zinc-600 text-sm">
            No testimonials found.
          </div>
        ) : (
          filtered.map((t: any) => (
            <div
              key={t.id}
              className={`bg-[#111118] border rounded-xl p-5 flex flex-col gap-3 ${
                !t.approved ? "border-amber-500/20" : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.author}</p>
                    <StarRating rating={t.rating} />
                  </div>
                </div>
                {!t.approved && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20 shrink-0">
                    Pending
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-500 italic flex-1 line-clamp-4">"{t.text}"</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <button
                  onClick={() => { if (confirm("Delete this review?")) remove.mutate(t.id); }}
                  className="text-xs text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
                {t.approved ? (
                  <button
                    onClick={() => setApproved.mutate({ id: t.id, approved: false })}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 01-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.75 2.25 2.25 0 0011.75 22l3-6m-7.252-6.75h-.008v.008h.008V15.5z" />
                    </svg>
                    Unapprove
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved.mutate({ id: t.id, approved: true })}
                    className="text-xs text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:bg-amber-500/10 px-2 py-1 rounded-md transition-all flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.898M14.25 9h2.25M5.898 15H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 01-.068-1.285c0-2.848.992-5.464 2.649-7.521" />
                    </svg>
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add dialog */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAddOpen(false)}>
          <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-4">Add Testimonial</h3>
            <div className="space-y-3">
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Customer Name"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Rating:</span>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="transition-colors">
                    <svg className={`w-5 h-5 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                ))}
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What did the customer say?"
                rows={4}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
              <button
                disabled={!author || !text || create.isPending}
                onClick={() => create.mutate()}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-lg transition-colors"
              >
                {create.isPending ? "Adding..." : "Add Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
