"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: async () => {
      const { data } = await api.get("/admin/reservations");
      return data as any[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/admin/reservations/${id}`, { status });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/reservations/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reservations"] }),
  });

  const filtered = (reservations ?? []).filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
      pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    };
    return map[status] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reservations</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and track all table bookings</p>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            id="reservations-search"
            type="text"
            placeholder="Search reservations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111118] border border-white/10 text-white placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Customer</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Booking</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Status</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-8 bg-white/5 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-zinc-600">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{r.name}</p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          {r.email}
                        </span>
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                          {r.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className="text-sm">{r.reservation_date} at {r.reservation_time}</span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1">Party of {r.party_size}</p>
                      {r.notes && <p className="text-xs text-zinc-700 mt-1 italic">"{r.notes}"</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => setStatus.mutate({ id: r.id, status: "confirmed" })}
                              className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors"
                              title="Confirm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setStatus.mutate({ id: r.id, status: "cancelled" })}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                              title="Cancel"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { if (confirm("Delete this reservation?")) remove.mutate(r.id); }}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-zinc-600 hover:text-red-400 flex items-center justify-center transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
