"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
} from "lucide-react";
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
      <div className="login-shell">
        <header className="login-header">
          <div className="login-brand">
            <span className="login-brand-icon"><Headphones size={22} strokeWidth={1.7} /></span>
            <span>Helpdesk <span className="login-brand-suffix">IT</span></span>
          </div>
          <span className="login-header-label">Portal internal</span>
        </header>

        <div className="login-content">
          <section className="login-intro" aria-labelledby="login-heading">
            <h1 id="login-heading">Kendala IT?<br /><span>Kami bantu.</span></h1>
            <p className="login-description">
              Laporkan kendala, pantau progres, dan terhubung
              dengan tim IT. Semua dalam satu tempat.
            </p>
          </section>

          <section className="login-form-area" aria-labelledby="login-form-heading">
            <div className="login-card">
              <h2 id="login-form-heading">Selamat datang.</h2>
              <p className="login-card-description">Masuk untuk mengakses layanan IT.</p>

              <form onSubmit={login} className="login-form" aria-busy={busy}>
                <Notice>{error}</Notice>
                <div className="login-field-group">
                  <label htmlFor="email">Alamat email</label>
                  <div className="login-input-wrap">
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
                <div className="login-field-group">
                  <label htmlFor="password">Kata sandi</label>
                  <div className="login-input-wrap">
                    <input
                      id="password"
                      name="password"
                      type={visible ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Masukkan kata sandi"
                      required
                      disabled={busy}
                    />
                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      aria-pressed={visible}
                      className="login-password-toggle"
                    >
                      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={busy} className="login-submit">
                  <span>{busy ? "Memproses..." : "Masuk ke workspace"}</span>
                  <span className="login-submit-icon">
                    {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  </span>
                </button>
              </form>

              <p className="login-account-note">
                Belum punya akun? <span>Hubungi administrator.</span>
              </p>
            </div>
          </section>
        </div>

        <footer className="login-footer">
          <span>Helpdesk IT · Internal workspace</span>
        </footer>
      </div>
    </main>
  );
}
