"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

const statCards = [
  {
    label: "Reservations",
    key: "reservations",
    pending: "pendingReservations",
    pendingLabel: "pending",
    href: "/admin/reservations",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "Menu Items",
    key: "menu",
    href: "/admin/menu",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0M3 16.5v-1.5m0 1.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5m-18 0h18" />
      </svg>
    ),
  },
  {
    label: "Testimonials",
    key: "testimonials",
    pending: "pendingTestimonials",
    pendingLabel: "to approve",
    href: "/admin/testimonials",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    key: "gallery",
    href: "/admin/gallery",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
];

const quickActions = [
  { label: "Manage Menu", href: "/admin/menu", icon: "🍛" },
  { label: "Upload Gallery Image", href: "/admin/gallery", icon: "📷" },
  { label: "Review Testimonials", href: "/admin/testimonials", icon: "💬" },
  { label: "Edit Hero Banners", href: "/admin/banners", icon: "🎨" },
];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    },
  });

  const { data: reservations, isLoading: resLoading } = useQuery({
    queryKey: ["admin", "reservations", "recent"],
    queryFn: async () => {
      const { data } = await api.get("/admin/reservations");
      return (data as any[]).slice(0, 5);
    },
  });

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Overview of your restaurant operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const value = stats?.[s.key] ?? "—";
          const pendingCount = s.pending ? stats?.[s.pending] : null;
          return (
            <Link key={s.label} href={s.href}>
              <div className={`bg-[#111118] border ${s.border} rounded-xl p-5 hover:bg-white/[0.02] transition-all duration-200 group cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{s.label}</p>
                  <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                </div>
                <div className={`text-3xl font-bold ${s.color}`}>
                  {statsLoading ? (
                    <div className="h-8 w-12 bg-white/5 animate-pulse rounded" />
                  ) : (
                    value
                  )}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  {pendingCount && pendingCount > 0 ? (
                    <span className="text-amber-500">{pendingCount} {s.pendingLabel}</span>
                  ) : (
                    "All up to date"
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Reservations */}
        <div className="lg:col-span-4 bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Reservations</h2>
              <p className="text-xs text-zinc-600 mt-0.5">Latest bookings from customers</p>
            </div>
            <Link href="/admin/reservations" className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
              View all
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {resLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4">
                  <div className="h-4 bg-white/5 animate-pulse rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 animate-pulse rounded w-1/2" />
                </div>
              ))
            ) : (reservations ?? []).length === 0 ? (
              <div className="px-6 py-12 text-center text-zinc-600 text-sm">No reservations yet.</div>
            ) : (
              (reservations ?? []).map((res: any) => (
                <div key={res.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{res.name}</p>
                      <p className="text-xs text-zinc-600">
                        {res.reservation_date} at {res.reservation_time} · {res.party_size} guests
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${
                    res.status === "confirmed"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : res.status === "cancelled"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}>
                    {res.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-3 bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
            <p className="text-xs text-zinc-600 mt-0.5">Common management tasks</p>
          </div>
          <div className="p-4 grid gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-amber-500/20 text-sm text-zinc-400 hover:text-white transition-all duration-150 group"
              >
                <span className="text-base">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
                <svg className="w-4 h-4 ml-auto text-zinc-700 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
