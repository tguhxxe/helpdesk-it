"use client";

import { useState } from "react";
import { ArrowUpRight, Paperclip } from "lucide-react";
import { api, categories } from "../lib/api";
import { Button, Modal, Notice } from "./ui";

export default function CreateTicket({ open, onOpenChange, onCreated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");

  function changeOpen(value) {
    if (busy) return;
    setError("");
    setFilename("");
    onOpenChange(value);
  }

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("attachment");
    if (file?.size > 5 * 1024 * 1024) {
      setError("Ukuran lampiran maksimal 5 MB.");
      return;
    }
    if (
      file?.size &&
      !["image/png", "image/jpeg", "application/pdf"].includes(file.type)
    ) {
      setError("Lampiran hanya boleh PNG, JPG/JPEG, atau PDF.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const { ticket } = await api("/api/tickets", {
        method: "POST",
        body: form,
      });
      setFilename("");
      onCreated(ticket);
      onOpenChange(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={changeOpen}
      title="Buat tiket baru"
      description="Ceritakan kendala Anda agar tim IT dapat membantu."
    >
      <form onSubmit={submit} className="space-y-5">
        <Notice>{error}</Notice>
        <fieldset disabled={busy} className="space-y-5">
          <div>
            <label htmlFor="subject" className="label">
              Judul masalah <span className="text-zinc-400">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              className="field"
              placeholder="Contoh: Tidak dapat terhubung ke Wi-Fi kantor"
              required
              maxLength={160}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="label">
                Kategori <span className="text-zinc-400">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="field"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="label">
                Prioritas
              </label>
              <select
                id="priority"
                name="priority"
                className="field"
                defaultValue="Sedang"
              >
                {["Rendah", "Sedang", "Tinggi"].map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="label">
              Deskripsi masalah <span className="text-zinc-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="field resize-y"
              placeholder="Jelaskan kendala, kapan terjadi, dan langkah yang sudah Anda coba..."
              required
            />
          </div>
          <div>
            <label htmlFor="attachment" className="label">
              Lampiran{" "}
              <span className="font-normal text-zinc-400">(opsional)</span>
            </label>
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
                <Paperclip size={16} />
                <span>{filename || "PNG, JPG, atau PDF · Maksimal 5 MB"}</span>
              </div>
              <input
                id="attachment"
                name="attachment"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                className="block w-full text-sm text-zinc-500 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-zinc-200 file:bg-white file:px-3 file:py-2 file:font-medium file:text-zinc-700"
                onChange={(event) =>
                  setFilename(event.target.files[0]?.name || "")
                }
              />
            </div>
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => changeOpen(false)}
            disabled={busy}
          >
            Batal
          </Button>
          <Button type="submit" busy={busy}>
            Kirim tiket <ArrowUpRight size={16} />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
