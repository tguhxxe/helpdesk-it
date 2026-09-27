"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, MessageSquare, Paperclip, Send } from "lucide-react";
import { api, formatDate, initials, statuses } from "../lib/api";
import { Button, Loading, Modal, Notice, Priority, StatusBadge } from "./ui";

export default function TicketDetail({
  ticketId,
  onClose,
  isAdmin,
  onUpdated,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(
    async (signal) => {
      const data = await api(`/api/tickets/${ticketId}`, { signal });
      setDetail(data);
      setStatus(data.ticket.status);
    },
    [ticketId],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal)
      .catch((error) => {
        if (error.name !== "AbortError") setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [load]);

  async function update(kind, event) {
    event.preventDefault();
    if (kind === "reply" && !message.trim()) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api(
        kind === "reply"
          ? `/api/tickets/${ticketId}/replies`
          : `/api/admin/tickets/${ticketId}/status`,
        {
          method: kind === "reply" ? "POST" : "PATCH",
          body: JSON.stringify(
            kind === "reply" ? { message: message.trim() } : { status },
          ),
        },
      );
      if (kind === "reply") setMessage("");
      setSuccess(
        kind === "reply"
          ? "Tanggapan berhasil dikirim."
          : "Status tiket berhasil diperbarui.",
      );
      onUpdated();
      await load();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  const ticket = detail?.ticket;
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      title="Detail tiket"
      description={
        ticket?.ticket_code || "Informasi dan riwayat penanganan tiket"
      }
      drawer
    >
      <div className="space-y-5">
        <Notice>{error}</Notice>
        <Notice success>{success}</Notice>
        {loading ? (
          <Loading label="Memuat detail tiket..." />
        ) : !ticket ? (
          <Button
            variant="secondary"
            onClick={() => {
              setLoading(true);
              setError("");
              load()
                .catch((error) => setError(error.message))
                .finally(() => setLoading(false));
            }}
          >
            Coba lagi
          </Button>
        ) : (
          <>
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <StatusBadge status={ticket.status} />
                <Priority value={ticket.priority} />
              </div>
              <h2 className="break-words text-2xl font-semibold leading-snug tracking-tight">
                {ticket.subject}
              </h2>
              <p className="mt-3 text-sm text-zinc-500">
                Dibuat {formatDate(ticket.created_at, true)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
              <div>
                <dt className="text-zinc-500">Pelapor</dt>
                <dd className="mt-1 break-words font-medium">
                  {ticket.user_name}
                </dd>
                <dd className="mt-1 break-all text-xs text-zinc-500">
                  {ticket.user_email}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Kategori</dt>
                <dd className="mt-1 font-medium">{ticket.category}</dd>
              </div>
            </dl>
            <section>
              <h3 className="mb-3 text-sm font-semibold">Deskripsi masalah</h3>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-600">
                {ticket.description}
              </p>
              {ticket.attachment_path?.startsWith("/uploads/") && (
                <a
                  href={ticket.attachment_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <Paperclip size={16} />
                  Buka lampiran
                  <ArrowUpRight size={16} className="ml-auto" />
                </a>
              )}
            </section>
            {isAdmin && (
              <form
                onSubmit={(event) => update("status", event)}
                className="border-t border-zinc-200 pt-5"
              >
                <label htmlFor="ticket-status" className="label">
                  Status penanganan
                </label>
                <div className="flex flex-wrap gap-2">
                  <select
                    id="ticket-status"
                    className="field min-w-0 flex-1"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    disabled={busy}
                  >
                    {statuses.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={busy || status === ticket.status}
                  >
                    Simpan status
                  </Button>
                </div>
              </form>
            )}
            <section className="border-t border-zinc-200 pt-5">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold">
                <MessageSquare size={16} />
                Percakapan{" "}
                <span className="font-normal text-zinc-400">
                  ({detail.replies.length})
                </span>
              </h3>
              <div className="space-y-5">
                {detail.replies.length ? (
                  detail.replies.map((reply) => (
                    <article key={reply.id} className="flex gap-3">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium ${reply.role === "admin" ? "bg-ink text-white" : "bg-zinc-100 text-zinc-600"}`}
                      >
                        {initials(reply.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{reply.name}</p>
                          {reply.role === "admin" && (
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                              IT Support
                            </span>
                          )}
                        </div>
                        <time className="mt-1 block text-xs text-zinc-400">
                          {formatDate(reply.created_at, true)}
                        </time>
                        <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-600">
                          {reply.message}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-zinc-200 p-5 text-center text-sm text-zinc-500">
                    Belum ada tanggapan pada tiket ini.
                  </p>
                )}
              </div>
            </section>
            <form
              onSubmit={(event) => update("reply", event)}
              className="border-t border-zinc-200 pt-5"
            >
              <label htmlFor="reply" className="label">
                {isAdmin ? "Tanggapan atau solusi" : "Tambahkan tanggapan"}
              </label>
              <textarea
                id="reply"
                rows={4}
                required
                className="field resize-y"
                placeholder={
                  isAdmin
                    ? "Tuliskan hasil pemeriksaan atau solusi..."
                    : "Tambahkan informasi atau pertanyaan..."
                }
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={busy}
              />
              <div className="mt-3 flex justify-end">
                <Button type="submit" busy={busy} disabled={!message.trim()}>
                  <Send size={15} />
                  Kirim tanggapan
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
