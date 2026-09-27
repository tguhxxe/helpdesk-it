"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CircleCheck,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
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
          <span className="login-header-label"><span /> Portal layanan internal</span>
        </header>

        <div className="login-content">
          <section className="login-intro" aria-labelledby="login-heading">
            <div className="login-eyebrow"><Sparkles size={14} /> YOUR EVERYDAY IT SUPPORT</div>
            <h1 id="login-heading">Kendala IT?<br /><span>Kami bantu.</span></h1>
            <p className="login-description">
              Lebih sedikit kendala, lebih banyak hal bermakna.
              Laporkan masalah dan terhubung dengan tim IT,
              dalam satu workspace.
            </p>

            <div className="login-art" aria-hidden="true">
              <div className="login-art-glow" />
              <div className="login-orbit login-orbit-back" />
              <div className="login-sphere">
                <div className="login-sphere-core"><Headphones size={66} strokeWidth={1.15} /></div>
              </div>
              <div className="login-orbit login-orbit-front" />
              <div className="login-art-spark login-art-spark-one"><Sparkles size={24} strokeWidth={1.4} /></div>
              <div className="login-art-spark login-art-spark-two" />
              <div className="login-floating-note login-note-ticket">
                <span className="login-note-icon"><CircleCheck size={19} /></span>
                <div><strong>Solusi lebih dekat</strong><span>Bersama tim IT Anda</span></div>
              </div>
              <div className="login-floating-note login-note-support">
                <span className="login-note-icon"><Headphones size={17} /></span>
                <strong>Let’s make IT easy.</strong>
              </div>
            </div>

            <div className="login-steps" aria-label="Layanan helpdesk">
              <span><span>01</span> Laporkan</span>
              <span className="login-step-line" aria-hidden="true" />
              <span><span>02</span> Pantau</span>
              <span className="login-step-line" aria-hidden="true" />
              <span><span>03</span> Selesaikan</span>
            </div>
          </section>

          <section className="login-form-area" aria-labelledby="login-form-heading">
            <div className="login-card">
              <div className="login-card-icon"><LockKeyhole size={23} strokeWidth={1.5} /></div>
              <p className="login-card-eyebrow">SELAMAT DATANG KEMBALI</p>
              <h2 id="login-form-heading">Masuk ke workspace</h2>
              <p className="login-card-description">Satu langkah untuk hari kerja yang lebih lancar.</p>

              <form onSubmit={login} className="login-form" aria-busy={busy}>
                <Notice>{error}</Notice>
                <div className="login-field-group">
                  <label htmlFor="email">Alamat email</label>
                  <div className="login-input-wrap">
                    <Mail size={18} aria-hidden="true" />
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
                    <LockKeyhole size={18} aria-hidden="true" />
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

              <div className="login-account-note">
                <span>Belum memiliki akun?</span>
                <p>Hubungi administrator untuk mendapatkan akses.</p>
              </div>
              <div className="login-security-note"><LockKeyhole size={13} /> Akses khusus pengguna internal</div>
            </div>
            <p className="login-form-caption">Ruang kerja Anda. Dukungan dari kami.</p>
          </section>
        </div>

        <footer className="login-footer">
          <span>Helpdesk IT · Layanan bantuan teknologi informasi</span>
          <span className="login-footer-tag">A little support. A better workday.<Sparkles size={13} /></span>
        </footer>
      </div>
    </main>
  );
}
