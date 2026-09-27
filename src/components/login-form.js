"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { api } from "../lib/api";
import { Brand, Button, Notice } from "./ui";

export default function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    api("/api/auth/me", { signal: controller.signal })
      .then(({ user }) => {
        window.location.replace(user.role === "admin" ? "/admin" : "/user");
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      window.location.assign(data.redirect);
    } catch (error) {
      setError(error.message);
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden min-h-dvh flex-col justify-between bg-[#191d27] px-12 py-10 lg:flex xl:px-20">
        <Brand dark />
        <div className="max-w-md py-20">
          <p className="mb-7 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
            Pusat bantuan internal
          </p>
          <h1 className="text-[3.5rem] font-medium leading-[1.12] tracking-[-0.045em] text-white">
            Kembali fokus.
            <br />
            <span className="text-zinc-400">
              Kami bantu
              <br />
              kendala IT Anda.
            </span>
          </h1>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-zinc-400">
            Satu tempat untuk melaporkan masalah, mengikuti progres, dan
            berkomunikasi dengan tim IT.
          </p>
          <div className="mt-12 border-t border-white/15">
            {[
              ["01", "Laporkan kendala", "Ceritakan masalah yang Anda alami."],
              ["02", "Pantau penanganan", "Ikuti perkembangan tiket Anda."],
              [
                "03",
                "Temukan solusi",
                "Diskusikan langsung dengan IT Support.",
              ],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="flex gap-5 border-b border-white/10 py-5"
              >
                <span className="pt-0.5 font-mono text-xs text-zinc-500">
                  {number}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          HELPDESK IT <span className="mx-2">/</span> INTERNAL WORKSPACE
        </p>
      </section>
      <section className="flex min-h-dvh flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="hidden text-right text-sm text-zinc-400 lg:block">
          Portal layanan IT
        </div>
        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-16">
          <p className="eyebrow">Selamat datang kembali</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Masuk ke workspace
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            Gunakan akun Anda untuk mengakses layanan bantuan IT.
          </p>
          <form onSubmit={login} className="mt-9 space-y-5">
            <Notice>{error}</Notice>
            <div>
              <label htmlFor="email" className="label">
                Alamat email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="nama@perusahaan.com"
                className="field"
                required
                disabled={busy}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  className="field pr-12"
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={
                    visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                  aria-pressed={visible}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-400 hover:text-ink"
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" busy={busy} className="!mt-7 w-full">
              {busy ? "Memproses..." : "Masuk"}
              {!busy && <ArrowRight size={16} className="ml-auto" />}
            </Button>
          </form>
          <div className="mt-8 flex items-start gap-2.5 border-t border-zinc-100 pt-6 text-sm leading-relaxed text-zinc-500">
            <LockKeyhole size={16} className="mt-0.5 shrink-0" />
            <p>
              Akses khusus pengguna internal. Hubungi administrator jika Anda
              belum memiliki akun.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-400">
          Helpdesk IT · Layanan bantuan teknologi informasi
        </p>
      </section>
    </main>
  );
}
