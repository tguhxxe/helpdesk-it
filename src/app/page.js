import Link from "next/link";
import { ArrowDown, ArrowRight, Check, CheckCheck, Circle, Clock3, Headphones, Ticket, Paperclip, MessagesSquare, ListChecks, Search, SlidersHorizontal, Wifi, Monitor, KeyRound } from "lucide-react";
import "./landing.css";

const features = [
  { icon: Ticket, title: "Ceritakan kendalanya.", description: "Buat tiket untuk masalah jaringan, perangkat keras, perangkat lunak, atau akun dan akses. Tentukan kategori dan prioritas agar laporan lebih jelas.", detail: "Kategori & prioritas", tone: "mint" },
  { icon: Paperclip, title: "Lengkapi dengan konteks.", description: "Tambahkan gambar atau dokumen pendukung. Bantu tim IT memahami apa yang terjadi melalui lampiran di tiket Anda.", detail: "Gambar & dokumen", tone: "peach" },
  { icon: ListChecks, title: "Tahu sampai mana.", description: "Pantau status Menunggu, Diproses, hingga Selesai dari dashboard. Perkembangan penanganan tetap tercatat bersama laporan Anda.", detail: "Status penanganan", tone: "blue" },
  { icon: MessagesSquare, title: "Tetap terhubung.", description: "Baca tanggapan tim IT dan kirim informasi tambahan dalam satu percakapan. Riwayatnya tersimpan di setiap tiket.", detail: "Riwayat percakapan", tone: "lilac" },
];
const steps = [
  { title: "Login", description: "Masuk dengan akun yang diberikan administrator IT." },
  { title: "Buat tiket", description: "Ceritakan masalah, pilih kategori dan prioritas, lalu tambahkan lampiran jika perlu." },
  { title: "Pantau penanganan", description: "Lihat status dan lanjutkan percakapan dengan tim IT melalui dashboard." },
];

function Brand() {
  return <span className="login-brand"><span className="login-brand-mark" aria-hidden="true" />Helpdesk IT</span>;
}

function TicketPreview() {
  return (
    <figure className="landing-preview" aria-labelledby="preview-caption">
      <figcaption id="preview-caption" className="preview-caption"><span>Contoh tiket</span><span>Ilustrasi, bukan data nyata</span></figcaption>
      <div className="preview-window">
        <div className="preview-toolbar"><Brand /><span className="preview-workspace">Ruang bantuan Anda</span><span className="preview-avatar" aria-hidden="true">A</span></div>
        <div className="preview-layout">
          <aside className="preview-sidebar" aria-label="Contoh daftar tiket">
            <p className="preview-label">TIKET SAYA</p>
            <div className="preview-ticket-selected"><span className="preview-ticket-icon"><Wifi size={18} aria-hidden="true" /></span><div><strong>Wi-Fi tidak terhubung</strong><span>Jaringan · Diproses</span></div></div>
            <div className="preview-side-note"><MessagesSquare size={18} aria-hidden="true" /><p>Detail, lampiran, dan tanggapan berada dalam satu tiket.</p></div>
          </aside>
          <div className="preview-detail">
            <div className="flex flex-wrap items-center justify-between gap-3"><span className="preview-label">TIKET BANTUAN / CONTOH</span><span className="preview-status"><Clock3 size={13} aria-hidden="true" />Diproses</span></div>
            <h2>Tidak dapat terhubung ke Wi-Fi kantor</h2>
            <p className="preview-description">Laptop saya belum bisa tersambung ke jaringan kantor sejak pagi ini.</p>
            <div className="preview-tags"><span><Wifi size={13} aria-hidden="true" />Jaringan</span><span>Prioritas sedang</span><span><Paperclip size={13} aria-hidden="true" />tangkapan-layar.png</span></div>
            <div className="preview-conversation"><span className="preview-agent"><Headphones size={18} aria-hidden="true" /></span><div><strong>IT Support</strong><p>Kami sedang memeriksa koneksi jaringan. Informasi berikutnya akan kami sampaikan di tiket ini.</p></div></div>
            <p className="preview-receipt"><CheckCheck size={15} aria-hidden="true" />Tanggapan tersimpan dalam riwayat tiket</p>
          </div>
          <div className="preview-progress"><p className="preview-label">PENANGANAN</p><ol><li className="is-complete"><Check size={14} aria-hidden="true" /><span>Menunggu</span></li><li className="is-current"><Clock3 size={14} aria-hidden="true" /><span>Diproses</span></li><li><Circle size={14} aria-hidden="true" /><span>Selesai</span></li></ol><p>Ikuti perkembangannya dari dashboard Anda.</p></div>
        </div>
      </div>
    </figure>
  );
}

export default function HomePage() {
  return (
    <div className="login-page landing-page">
      <a href="#konten-utama" className="landing-skip">Lewati ke konten utama</a>
      <header className="landing-shell">
        <nav aria-label="Navigasi utama" className="landing-nav">
          <Link href="/" aria-label="Helpdesk IT — Beranda" className="landing-brand-link"><Brand /></Link>
          <div className="landing-nav-sections"><a href="#fitur">Fitur</a><a href="#cara-kerja">Cara kerja</a></div>
          <Link href="/login" className="landing-button landing-nav-login">Login <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
      </header>
      <main id="konten-utama" tabIndex={-1}>
        <section aria-labelledby="intro-heading" className="landing-hero">
          <div className="hero-aura" aria-hidden="true" />
          <div className="landing-shell">
            <div className="landing-hero-copy">
              <p className="hero-eyebrow"><Headphones size={15} aria-hidden="true" />Bantuan IT, dalam satu tempat</p>
              <h1 id="intro-heading">Kendala IT?<br /><span>Kami bantu.</span></h1>
              <p className="landing-intro">Dari laporan pertama hingga solusi. Buat tiket, pantau penanganan, dan terhubung dengan tim IT Support tanpa kehilangan riwayat percakapan.</p>
              <div className="landing-hero-actions"><Link href="/login" className="landing-button">Login untuk mulai <ArrowRight size={17} aria-hidden="true" /></Link><a href="#cara-kerja" className="landing-secondary">Lihat cara kerja <ArrowDown size={16} aria-hidden="true" /></a></div>
              <p className="landing-account-note">Gunakan akun dari administrator IT Anda.</p>
            </div>
            <TicketPreview />
            <div className="landing-categories" aria-label="Kategori kendala"><span>Untuk kendala sehari-hari</span><span><Wifi size={16} aria-hidden="true" />Jaringan</span><span><Monitor size={16} aria-hidden="true" />Perangkat</span><span><KeyRound size={16} aria-hidden="true" />Akun & akses</span></div>
          </div>
        </section>

        <section id="fitur" aria-labelledby="fitur-heading" className="landing-shell landing-section">
          <div className="landing-section-header"><div><p className="landing-kicker">Dukungan yang terhubung</p><h2 id="fitur-heading" className="landing-heading">Satu tiket.<br />Konteks yang lengkap.</h2></div><p>Semua yang Anda perlukan untuk melaporkan kendala dan mengikuti penanganannya, dari awal sampai selesai.</p></div>
          <div className="landing-feature-grid">
            {features.map(({ icon: Icon, title, description, detail, tone }) => (
              <article key={title} className={`landing-feature feature-${tone}`}><div className="feature-top"><span className="feature-icon"><Icon size={23} strokeWidth={1.6} aria-hidden="true" /></span><span className="feature-detail">{detail}</span></div><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section className="landing-shell landing-support-section" aria-labelledby="support-heading">
          <div className="landing-support">
            <div className="support-copy"><p className="landing-kicker">Untuk tim IT Support</p><h2 id="support-heading" className="landing-heading">Laporan tertata.<br />Penanganan terarah.</h2><p>Kelola ringkasan dan seluruh tiket melalui dashboard admin. Temukan laporan yang perlu ditangani, berikan solusi, dan perbarui statusnya.</p><a href="/login" className="support-link">Masuk sebagai admin <ArrowRight size={17} aria-hidden="true" /></a></div>
            <ul className="support-capabilities"><li><Search size={21} aria-hidden="true" /><div><h3>Temukan laporan</h3><p>Cari tiket dan filter berdasarkan status.</p></div></li><li><MessagesSquare size={21} aria-hidden="true" /><div><h3>Berikan tanggapan</h3><p>Diskusikan kendala dan sampaikan solusi.</p></div></li><li><SlidersHorizontal size={21} aria-hidden="true" /><div><h3>Perbarui penanganan</h3><p>Sesuaikan status dengan perkembangan tiket.</p></div></li></ul>
          </div>
        </section>

        <section id="cara-kerja" aria-labelledby="cara-kerja-heading" className="landing-shell landing-section landing-how">
          <p className="landing-kicker">Cara kerja</p><h2 id="cara-kerja-heading" className="landing-heading">Langkah kecil menuju solusi.</h2>
          <ol className="landing-steps">{steps.map((step, index) => <li key={step.title}><div className="step-track"><span aria-hidden="true">0{index + 1}</span>{index < 2 && <ArrowRight size={18} aria-hidden="true" />}</div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
        </section>

        <section className="landing-shell landing-cta-section" aria-labelledby="mulai-heading"><div className="landing-cta"><span className="cta-icon"><Ticket size={25} aria-hidden="true" /></span><h2 id="mulai-heading" className="landing-heading">Kendala Anda,<br />mulai ditangani dari sini.</h2><p>Ceritakan masalahnya. Tim IT Support membantu Anda<br className="hidden sm:block" /> melanjutkan langkah berikutnya.</p><Link href="/login" className="landing-button">Login ke Helpdesk IT <ArrowRight size={17} aria-hidden="true" /></Link><p className="cta-account">Belum punya akun? Hubungi administrator IT.</p></div></section>
      </main>
      <footer className="landing-shell landing-footer"><Brand /><p>Pusat pelaporan dan penanganan kendala IT.</p><a href="#konten-utama">Kembali ke atas ↑</a></footer>
    </div>
  );
}
