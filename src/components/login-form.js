"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { Notice } from "./ui";
import "./login.css";

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
    <main className="login-page">
      {/* Cahaya gradien transparan di bawah kertas bergaris */}
      <div className="login-glow" aria-hidden="true">
        <span className="login-glow-a" />
        <span className="login-glow-b" />
        <span className="login-glow-c" />
        <span className="login-glow-d" />
      </div>

      <header className="login-top">
        <Link href="/" className="login-brand rounded hover:opacity-75 active:opacity-60" aria-label="Helpdesk IT — Kembali ke beranda">
          <span className="login-brand-mark" aria-hidden="true" />
          Helpdesk IT
        </Link>
      </header>

      <div className="login-stage">
        <section className="login-intro" aria-labelledby="login-heading">
          <h1 id="login-heading">Kendala IT?<br />Kami bantu.</h1>
          <p>
            Laporkan kendala, pantau progres, dan hubungi tim IT
            dari satu tempat.
          </p>
        </section>

        <section className="login-panel" aria-labelledby="login-form-heading">
          <h2 id="login-form-heading">Masuk</h2>
          <p className="login-lede">Gunakan akun kantor Anda.</p>

          <form onSubmit={login} className="login-form" aria-busy={busy}>
            <Notice>{error}</Notice>

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="login-line">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="nama@perusahaan.com"
                  required
                  disabled={busy}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Kata sandi</label>
              <div className="login-line">
                <input
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-pressed={visible}
                  className="login-reveal"
                >
                  {visible ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="login-submit">
              {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              {busy ? "Memeriksa akun..." : "Masuk"}
            </button>
          </form>

          <p className="login-note">Belum punya akun? Minta ke administrator IT.</p>
        </section>
      </div>
    </main>
  );
}
