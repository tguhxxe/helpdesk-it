"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { api, formatDate, initials, statuses } from "../lib/api";
import { Brand, Button, Loading, Notice, Priority, StatusBadge } from "./ui";
import CreateTicket from "./create-ticket";
import TicketDetail from "./ticket-detail";

const pageSize = 8;
const statItems = [
  {
    label: "Total tiket",
    key: "total",
    icon: Ticket,
    caption: "Seluruh laporan",
    color: "text-zinc-500",
  },
  {
    label: "Menunggu",
    key: "Menunggu",
    icon: Clock3,
    caption: "Menunggu penanganan",
    color: "text-amber-600",
  },
  {
    label: "Diproses",
    key: "Diproses",
    icon: Loader2,
    caption: "Dalam penanganan tim IT",
    color: "text-blue-600",
  },
  {
    label: "Selesai",
    key: "Selesai",
    icon: CircleCheck,
    caption: "Kendala telah diselesaikan",
    color: "text-emerald-600",
  },
];

export default function Dashboard({ role }) {
  const isAdmin = role === "admin";
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("overview");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const activeRequest = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    api("/api/auth/me", { signal: controller.signal })
      .then(({ user }) => {
        if (user.role !== role) {
          window.location.replace(user.role === "admin" ? "/admin" : "/user");
          return;
        }
        setUser(user);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setAuthError(error.message);
      });
    return () => controller.abort();
  }, [role]);

  const loadTickets = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError("");
    try {
      const { tickets } = await api(
        isAdmin ? "/api/admin/tickets" : "/api/tickets/my",
        { signal: controller.signal },
      );
      setTickets(tickets);
      setLoaded(true);
    } catch (error) {
      if (error.name !== "AbortError") setError(error.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (user) loadTickets();
    return () => activeRequest.current?.abort();
  }, [user, loadTickets]);

  const stats = useMemo(
    () =>
      tickets.reduce(
        (result, ticket) => {
          result.total += 1;
          result[ticket.status] += 1;
          return result;
        },
        { total: 0, Menunggu: 0, Diproses: 0, Selesai: 0 },
      ),
    [tickets],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    return tickets.filter(
      (ticket) =>
        (!status || ticket.status === status) &&
        `${ticket.ticket_code} ${ticket.subject} ${ticket.user_name} ${ticket.category}`
          .toLocaleLowerCase("id-ID")
          .includes(query),
    );
  }, [tickets, status, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visibleTickets = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function selectStatus(value) {
    setStatus(value);
    setPage(1);
  }
  function navigate(value) {
    setView(value);
    setMenuOpen(false);
  }
  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      await api("/api/auth/logout", { method: "POST" });
      window.location.assign("/");
    } catch (error) {
      setError(error.message);
      setLoggingOut(false);
    }
  }

  if (!user)
    return (
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <Brand />
          </div>
          {authError ? (
            <div className="mt-8 space-y-4">
              <Notice>{authError}</Notice>
              <Button onClick={() => window.location.reload()}>
                Coba lagi
              </Button>
            </div>
          ) : (
            <Loading label="Menyiapkan workspace..." />
          )}
        </div>
      </main>
    );

  const navigation = (
    <>
      <div className="px-6 pb-9 pt-8">
        <Brand />
      </div>
      <div className="mx-4 mb-8 flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="grid size-8 place-items-center rounded-md border border-zinc-200 text-zinc-500">
          <LayoutDashboard size={16} />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isAdmin ? "IT Support" : "Employee workspace"}
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">Helpdesk internal</p>
        </div>
      </div>
      <p className="eyebrow px-6 pb-3">Workspace</p>
      <nav aria-label="Navigasi utama" className="space-y-1 px-3">
        {[
          { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
          {
            id: "tickets",
            label: isAdmin ? "Semua tiket" : "Tiket saya",
            icon: Ticket,
          },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            aria-current={view === id ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${view === id ? "bg-zinc-200/60 font-medium text-ink" : "text-zinc-500 hover:bg-zinc-100 hover:text-ink"}`}
          >
            <Icon size={18} strokeWidth={1.7} />
            {label}
            {id === "tickets" && loaded && (
              <span className="ml-auto rounded border border-zinc-200 bg-white px-1.5 text-xs leading-5 text-zinc-500">
                {stats.total}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-auto p-5">
        <div className="mb-5 border-b border-zinc-200 pb-5">
          <p className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <MessageSquare size={16} />
            {isAdmin ? "Setiap kendala, ditangani." : "Butuh bantuan IT?"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {isAdmin
              ? "Tinjau laporan dan berikan solusi melalui percakapan tiket."
              : "Buat tiket dan diskusikan kendala Anda dengan tim IT Support."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-xs font-medium">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-zinc-400" title={user.email}>
              {user.email}
            </p>
          </div>
          <button
            onClick={logout}
            disabled={loggingOut}
            aria-label="Keluar dari akun"
            title="Keluar"
            className="rounded-md p-2 text-zinc-400 hover:bg-zinc-200 hover:text-ink"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten utama
      </a>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-zinc-200 bg-[#f8f9fb] lg:flex">
        {navigation}
      </aside>
      {menuOpen && (
        <div className="fixed inset-x-0 top-[65px] z-30 flex max-h-[calc(100dvh-65px)] flex-col overflow-y-auto border-b border-zinc-200 bg-[#f8f9fb] shadow-xl lg:hidden">
          {navigation}
        </div>
      )}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex min-h-[65px] items-center justify-between gap-3 border-b border-zinc-200 bg-white/95 px-5 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-md p-1 text-zinc-500 lg:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="hidden text-sm text-zinc-400 sm:inline">
              Workspace
            </span>
            <ChevronRight size={14} className="hidden text-zinc-300 sm:block" />
            <span className="text-sm font-medium">
              {view === "overview"
                ? "Ringkasan"
                : isAdmin
                  ? "Semua tiket"
                  : "Tiket saya"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">
              {isAdmin ? "Admin IT Support" : "Pengguna"}
            </span>
            <span
              className="grid size-8 place-items-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600"
              aria-label={user.name}
            >
              {initials(user.name)}
            </span>
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="eyebrow mb-2.5">
                {isAdmin ? "Service desk" : "Layanan bantuan IT"}
              </p>
              <h1 className="text-[1.75rem] font-semibold tracking-[-0.035em] sm:text-3xl">
                {view === "tickets"
                  ? isAdmin
                    ? "Semua tiket"
                    : "Tiket saya"
                  : isAdmin
                    ? "Ringkasan helpdesk"
                    : `Halo, ${user.name.split(" ")[0]}.`}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {isAdmin
                  ? "Pantau laporan masuk dan kelola penanganan dalam satu tempat."
                  : "Laporkan kendala dan pantau perkembangan tiket Anda."}
              </p>
            </div>
            {!isAdmin && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus size={17} />
                Buat tiket baru
              </Button>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <Notice>{error}</Notice>
            <Notice success>{success}</Notice>
          </div>
          {view === "overview" && (
            <section
              aria-label="Statistik tiket"
              className="mb-9 grid grid-cols-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-panel xl:grid-cols-4"
            >
              {statItems.map(
                ({ label, key, icon: Icon, caption, color }, index) => (
                  <div
                    key={key}
                    className={`border-zinc-200 p-5 sm:p-6 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b xl:border-b-0" : ""} ${index === 1 ? "xl:border-r" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-zinc-500">{label}</p>
                      <Icon size={17} strokeWidth={1.6} className={color} />
                    </div>
                    <p className="mb-2 mt-5 text-4xl font-medium tracking-tight tabular-nums">
                      {loaded ? stats[key] : "—"}
                    </p>
                    <p className="text-xs text-zinc-400">{caption}</p>
                  </div>
                ),
              )}
            </section>
          )}
          <section
            aria-labelledby="tickets-title"
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-panel"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 pt-6 sm:px-6">
              <div className="flex items-center gap-3">
                <h2 id="tickets-title" className="text-base font-semibold">
                  {isAdmin ? "Daftar tiket" : "Tiket saya"}
                </h2>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500">
                  {loaded ? tickets.length : "—"}
                </span>
              </div>
              <Button
                variant="ghost"
                className="!min-h-8 !p-1.5"
                onClick={loadTickets}
                disabled={loading}
                aria-label="Muat ulang tiket"
                title="Muat ulang tiket"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-5 pb-5 sm:px-6">
              <div
                className="flex max-w-full gap-1 overflow-x-auto"
                aria-label="Filter status"
              >
                {["", ...statuses].map((value) => (
                  <button
                    key={value}
                    onClick={() => selectStatus(value)}
                    aria-pressed={status === value}
                    className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${status === value ? "bg-ink font-medium text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
                  >
                    {value || "Semua"}
                    <span
                      className={`ml-2 text-xs ${status === value ? "text-zinc-300" : "text-zinc-400"}`}
                    >
                      {loaded ? stats[value || "total"] : "—"}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="search"
                  aria-label="Cari tiket"
                  placeholder={
                    isAdmin ? "Cari tiket atau pelapor..." : "Cari tiket..."
                  }
                  className="field !py-2.5 !pl-9"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
            {loading && !loaded ? (
              <Loading label="Memuat daftar tiket..." />
            ) : !loaded && error ? (
              <div className="p-12 text-center">
                <p className="mb-4 text-sm text-zinc-500">
                  Daftar tiket belum dapat dimuat.
                </p>
                <Button variant="secondary" onClick={loadTickets}>
                  Coba lagi
                </Button>
              </div>
            ) : !filtered.length ? (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                  <Inbox size={23} strokeWidth={1.5} />
                </span>
                <h3 className="text-base font-medium">
                  {status || search
                    ? "Tidak ada tiket yang cocok"
                    : "Belum ada tiket"}
                </h3>
                <p className="mx-auto mb-5 mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                  {status || search
                    ? "Coba kata kunci lain atau tampilkan semua status."
                    : isAdmin
                      ? "Tiket yang dibuat pengguna akan muncul di sini."
                      : "Ada kendala perangkat, jaringan, atau akun? Kirim laporan pertama Anda."}
                </p>
                {status || search ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      selectStatus("");
                      setSearch("");
                    }}
                  >
                    Hapus filter
                  </Button>
                ) : (
                  !isAdmin && (
                    <Button
                      variant="secondary"
                      onClick={() => setCreateOpen(true)}
                    >
                      <Plus size={15} />
                      Buat tiket
                    </Button>
                  )
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">
                      Daftar tiket {isAdmin ? "seluruh pengguna" : "Anda"}, buka
                      judul untuk melihat detail.
                    </caption>
                    <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-medium text-zinc-500">
                      <tr>
                        <th
                          scope="col"
                          className="px-5 py-3 font-medium sm:px-6"
                        >
                          Tiket
                        </th>
                        {isAdmin && (
                          <th
                            scope="col"
                            className="hidden px-4 py-3 font-medium xl:table-cell"
                          >
                            Pelapor
                          </th>
                        )}
                        <th
                          scope="col"
                          className="hidden px-4 py-3 font-medium md:table-cell"
                        >
                          Prioritas
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                          Status
                        </th>
                        <th
                          scope="col"
                          className="hidden px-4 py-3 font-medium 2xl:table-cell"
                        >
                          Dibuat
                        </th>
                        <th scope="col" className="w-12 px-5 py-3">
                          <span className="sr-only">Tanggapan</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {visibleTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="group transition-colors hover:bg-zinc-50/80"
                        >
                          <td className="min-w-[190px] max-w-[420px] px-5 py-5 sm:px-6">
                            <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                              <span className="font-mono">
                                {ticket.ticket_code}
                              </span>
                              <span aria-hidden="true">/</span>
                              <span>{ticket.category}</span>
                            </div>
                            <button
                              onClick={() => setSelectedId(ticket.id)}
                              className="rounded-sm text-left font-medium leading-relaxed text-zinc-800 hover:text-accent"
                            >
                              {ticket.subject}
                            </button>
                            <p className="mt-1 text-xs text-zinc-400 2xl:hidden">
                              {formatDate(ticket.created_at)}
                            </p>
                          </td>
                          {isAdmin && (
                            <td className="hidden px-4 py-5 xl:table-cell">
                              <div className="flex items-center gap-2.5">
                                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs text-zinc-600">
                                  {initials(ticket.user_name)}
                                </span>
                                <span className="max-w-[150px] truncate text-zinc-600">
                                  {ticket.user_name}
                                </span>
                              </div>
                            </td>
                          )}
                          <td className="hidden px-4 py-5 md:table-cell">
                            <Priority value={ticket.priority} />
                          </td>
                          <td className="px-4 py-5">
                            <StatusBadge status={ticket.status} />
                          </td>
                          <td className="hidden whitespace-nowrap px-4 py-5 text-zinc-500 2xl:table-cell">
                            {formatDate(ticket.created_at)}
                          </td>
                          <td className="px-5 py-5">
                            <button
                              onClick={() => setSelectedId(ticket.id)}
                              aria-label={`Buka ${ticket.ticket_code}, ${ticket.reply_count} tanggapan`}
                              className="flex items-center gap-1.5 rounded-md p-1 text-xs text-zinc-400 hover:text-accent"
                            >
                              <MessageSquare size={15} />
                              <span>{ticket.reply_count}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-5 py-4 sm:px-6">
                  <p className="text-xs text-zinc-500">
                    Menampilkan {(currentPage - 1) * pageSize + 1}–
                    {Math.min(currentPage * pageSize, filtered.length)} dari{" "}
                    {filtered.length} tiket
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      className="!min-h-8 !p-1.5"
                      aria-label="Halaman sebelumnya"
                      disabled={currentPage === 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="text-xs text-zinc-500">
                      {currentPage} / {pages}
                    </span>
                    <Button
                      variant="secondary"
                      className="!min-h-8 !p-1.5"
                      aria-label="Halaman berikutnya"
                      disabled={currentPage === pages}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span>
              Helpdesk IT <span className="mx-2 text-zinc-300">/</span>{" "}
              {isAdmin ? "IT Support workspace" : "Employee workspace"}
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowDownLeft size={13} />
              Klik judul tiket untuk membuka percakapan
            </span>
          </footer>
        </main>
      </div>
      {!isAdmin && (
        <CreateTicket
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={(ticket) => {
            setSuccess(`Tiket ${ticket.ticket_code} berhasil dibuat.`);
            selectStatus("");
            setSearch("");
            loadTickets();
          }}
        />
      )}
      {selectedId && (
        <TicketDetail
          key={selectedId}
          ticketId={selectedId}
          isAdmin={isAdmin}
          onClose={() => setSelectedId(null)}
          onUpdated={loadTickets}
        />
      )}
    </div>
  );
}
