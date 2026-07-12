"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, Circle } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export function NotificationMenu({ placement = "bottom" }: { placement?: "top" | "bottom" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(async () => {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (response.ok) setNotifications(await response.json());
  }, []);

  useEffect(() => {
    void loadNotifications();
    const interval = window.setInterval(loadNotifications, 15000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  async function update(action: "mark-read" | "mark-unread" | "mark-all-read", notificationId?: string) {
    const response = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notificationId }),
    });
    if (response.ok) void loadNotifications();
  }

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className="relative flex size-5 items-center justify-center text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-30 w-[360px] overflow-hidden rounded-2xl border border-white/[.1] bg-[#171a20] shadow-2xl shadow-black/45 ${placement === "top" ? "bottom-8" : "top-8"}`}>
          <div className="flex items-center justify-between border-b border-white/[.08] px-4 py-3">
            <div><p className="text-sm font-semibold text-white">Notifications</p><p className="text-[11px] text-white/45">Shared operations activity</p></div>
            <button type="button" onClick={() => update("mark-all-read")} disabled={!unread} className="inline-flex items-center gap-1 text-xs font-medium text-orange-300 disabled:opacity-40"><CheckCheck className="size-3.5" />Mark all read</button>
          </div>
          <div className="max-h-96 overflow-y-auto p-1.5">
            {notifications.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-white/45">You&apos;re all caught up.</p>
            ) : notifications.map((notification) => (
              <button key={notification.id} type="button" onClick={() => update(notification.read ? "mark-unread" : "mark-read", notification.id)} className="flex w-full gap-3 rounded-xl p-3 text-left transition hover:bg-white/[.06]">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.read ? "bg-white/20" : "bg-orange-400 shadow-[0_0_10px_#ff7a00]"}`} />
                <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="truncate text-sm font-medium text-white">{notification.title}</span><span className="shrink-0 text-[10px] text-white/35">{new Date(notification.createdAt).toLocaleDateString()}</span></span><span className="mt-1 block text-xs leading-5 text-white/50">{notification.message}</span><span className="mt-2 inline-flex items-center gap-1 text-[10px] text-white/35"><Circle className="size-2" />{notification.read ? "Mark unread" : "Mark read"}</span></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
