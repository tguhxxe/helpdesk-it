---
version: alpha
name: Helpdesk IT
description: Pusat bantuan IT dengan tampilan bersih, cahaya pastel transparan, dan pratinjau ruang penanganan tiket.
colors:
  primary: "#16211d"
  ink: "#16211d"
  background: "#f7f8f6"
  muted: "#55635d"
  aqua: "#7fd8c8"
  periwinkle: "#9db4ff"
  lilac: "#d6bfff"
  peach: "#ffcdb5"
typography:
  sans:
    fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans"), system-ui, sans-serif'
rounded:
  control: "12px"
  panel: "18px"
spacing:
  page-max: "1120px"
---

# Helpdesk IT Design System

## Overview

Landing page memperkenalkan layanan kepada pengguna dan tim IT Support dalam bahasa Indonesia. Sumber kemampuan produk: README.md dan implementasi API tiket. Tidak ada target pasar Jepang. Arah visual revisi yang disetujui: landing bersih tanpa tekstur kertas, garis horizontal buku, atau margin merah muda. Pertahankan tinta hijau gelap dan cahaya pastel transparan. Nuansa produk AI hanya arah visual, bukan klaim kemampuan AI. Login tidak diubah.

Register: `/` adalah pengenalan publik; `/login` adalah autentikasi; `/user` dan `/admin` adalah aplikasi. Landing page tetap dapat dibuka setelah login. Autentikasi dan pengalihan dashboard mengikuti implementasi yang sudah ada.

## Colors

Sumber runtime untuk identitas publik adalah `src/components/login.css`: `.login-page` memiliki `--paper`, `--ink`, `--ink-soft`, `--rule-color`, `--margin-color`, dan empat warna cahaya. `src/app/landing.css` mengimpor stylesheet tersebut; pembungkus landing memakai `.login-page` sehingga token diwarisi, bukan disalin. Logo tetap memakai kelas login yang sama. Landing menonaktifkan kedua pseudo-element tekstur buku dan memiliki komposisi sendiri. `landing.css` memiliki token tambahan `--landing-surface: #fcfdfc`, `--landing-border: #e3e9e6`, dan `--landing-accent: #336c5c` untuk permukaan, batas, serta judul hero. Token tersebut berlaku hanya untuk landing. Dokumentasi mencerminkan token runtime, tanpa generator.

Tinta hijau gelap dipakai untuk judul dan tombol, warna muted untuk isi. Pastel dipakai untuk atmosfer, latar ikon, dan aksen berkontras tinggi pada panel IT Support yang gelap. Token dashboard di `tailwind.config.js` tidak diganti. `globals.css` tetap memiliki baseline scrollbar, fokus umum, dan reduced motion; fokus landing memakai tinta login.

## Typography

Landing mengikuti font stack login yang benar-benar digunakan. `--font-jakarta` belum disediakan oleh layout dan Plus Jakarta Sans tidak dimuat; pada lingkungan tanpa font tersebut, browser memakai system-ui. Jangan menambahkan font jaringan atau mengklaim Jakarta telah dimuat. Dashboard tetap menggunakan Inter lokal.

Judul hero berbobot 500, tracking rapat, 48–88px responsif. Judul bagian 32–44px; teks isi 14–17px dengan tinggi baris 26–29px. Label pratinjau 10–12px; seluruh informasi layanan tetap dijelaskan pada bagian utama dengan ukuran baca normal.

## Layout

`landing.css` memiliki geometri landing: lebar maksimum 1120px, gutter simetris 40px desktop dan 20px ponsel, scroll dokumen alami. Navbar tidak sticky dan membungkus pada ponsel. Hero terpusat dengan judul dua baris, dua CTA, dan pratinjau ruang tiket lebar di bawahnya. Gradien dikonsentrasikan di sekitar pratinjau.

Pratinjau bertanda “Contoh tiket” dan “Ilustrasi, bukan data nyata”; tidak ada kontrol palsu. Sidebar dan status samping disembunyikan bertahap pada tablet/ponsel, detail tiket tetap terbaca. Fitur memakai grid dua kolom menjadi satu pada ponsel. Bagian IT Support menggunakan panel gelap dua kolom menjadi satu. Langkah berubah dari tiga kolom menjadi satu. Tidak ada tinggi halaman tetap.

Referensi yang ditinjau pada 2026-09-28: [Intercom Helpdesk](https://www.intercom.com/helpdesk) untuk susunan pengenalan helpdesk dan contoh produk; [Plain Product](https://www.plain.com/product) untuk pengelompokan kemampuan support. Referensi dipakai sebagai arahan penyajian; tidak menyalin aset, klaim, integrasi, metrik, atau kemampuan AI.

## Elevation & Depth

Kaca hanya digunakan pada bingkai pratinjau hero. Empat kartu fitur memakai permukaan putih solid dengan batas lembut. Panel IT Support hijau gelap memberi hierarki antarbagian. CTA penutup memiliki cahaya aqua/lilac transparan. Tidak ada tekstur kertas, pola garis, foto, atau aset eksternal.

## Shapes

Logo memakai `.login-brand-mark`. Tombol utama memiliki radius 12px (navbar 10px), kartu fitur 18px, panel besar 24px. Radius pratinjau luar 22px/dalam 12px. Nomor 01–03 hanya menunjukkan tiga langkah yang berurutan.

## Components

Landing adalah server component statis di `src/app/page.js`. Navigasi bagian menggunakan anchor native dan perpindahan halaman memakai Next Link. Semua CTA menuju `/login`. Fokus keyboard terlihat; target navigasi minimal 44px dan CTA 50px. Skip link menuju main. Ikon Lucide dekoratif memakai aria-hidden.

Formulir login tetap dimiliki `src/components/login-form.js`; tidak ada perubahan API, sesi, atau peran. Halaman statis tidak memerlukan loading, error, atau empty state aplikasi.

### Iconography

Lucide membantu mengidentifikasi tiket, lampiran, status, percakapan, dan IT Support. Identitas merek memakai tanda buku dari login, bukan ikon headphone.

### Motion

Tidak ada animasi dekoratif. Transisi hover warna saja; preferensi reduced motion ditangani oleh `globals.css`. Dekorasi tidak menerima pointer input.

### Content

Pertahankan kategori, prioritas, lampiran, status Menunggu/Diproses/Selesai, riwayat tanggapan, serta kemampuan admin mencari dan memfilter laporan. Akun diperoleh melalui administrator IT. Jangan menambahkan statistik, testimoni, janji waktu respons, atau pendaftaran mandiri.

## Do's and Don'ts

- Pertahankan palet dan logo login; landing memiliki komposisi bersih sendiri tanpa garis buku.
- Pertahankan komposisi ringan, kontras teks, ruang kosong, dan urutan baca yang jelas.
- Jangan mengubah autentikasi atau dashboard untuk perubahan landing.
- Jangan menambahkan library UI atau font baru.
