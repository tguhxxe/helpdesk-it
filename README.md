# Helpdesk IT — Next.js + Express + PostgreSQL

Website Helpdesk IT dengan antarmuka React yang minimalis dan responsif. Sistem memiliki dua aktor: **User** dan **Admin IT Support**. Frontend menggunakan Next.js App Router dan Tailwind CSS, sedangkan API Express, sesi login, dan database PostgreSQL berjalan dalam aplikasi yang sama.

## Dokumen tugas

- Identitas: **Teguh Setia — 202310370311061**.
- Dokumen utama: [SKPL Helpdesk IT](docs/SKPL_Helpdesk_IT_Teguh_Setia.docx).
- Versi teks: [Spesifikasi kebutuhan](docs/SPESIFIKASI_KEBUTUHAN.md).
- [Panduan pengumpulan dan demonstrasi](PENGUMPULAN.md).
- [Hasil pengujian](docs/HASIL_PENGUJIAN.md).

Format yang dipilih adalah **User Story** sebagai spesifikasi kebutuhan tertulis. Karena tugas meminta salah satu bentuk spesifikasi, use case diagram tidak diperlukan untuk pilihan ini.

## Fitur

### User
- Login
- Membuat tiket masalah IT
- Memilih kategori dan prioritas
- Menulis deskripsi masalah
- Upload lampiran PNG/JPG/PDF maksimal 5 MB
- Melihat status tiket: Menunggu, Diproses, Selesai
- Melihat detail dan riwayat tanggapan
- Mengirim tanggapan tambahan

### Admin IT Support
- Login khusus admin
- Dashboard statistik tiket
- Melihat semua tiket
- Filter berdasarkan status
- Pencarian kode tiket, judul, dan nama user
- Melihat detail dan lampiran
- Mengubah status tiket
- Memberikan tanggapan/solusi

## Teknologi
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS 3
- Komponen dialog: Radix UI (focus trap, Escape, dan navigasi keyboard)
- Tipografi dan ikon: Inter (font lokal) + Lucide React
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: Express Session + bcrypt
- Upload file: Multer

## Struktur Project

```text
helpdesk_it_postgresql/
├── db/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── app/                 # Halaman Next.js: /, /login, /user, /admin
│   ├── components/          # Login, dashboard, formulir, detail tiket
│   ├── lib/api.js           # Fetch API dan format data frontend
│   ├── middleware/auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tickets.js
│   │   └── admin.js
│   ├── db.js
│   └── server.js
├── uploads/
├── .env.example
├── docker-compose.yml
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Cara Menjalankan — Cara Paling Mudah (Docker untuk PostgreSQL)

### 1. Install kebutuhan
- Node.js 22 LTS direkomendasikan (minimum 18.18)
- Docker Desktop

### 2. Salin konfigurasi environment
Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

### 3. Install dependency Node.js

```bash
npm ci
```

### 4. Jalankan PostgreSQL

```bash
docker compose up -d
```

`schema.sql` dan `seed.sql` akan dijalankan otomatis saat database pertama kali dibuat.

### 5. Jalankan website

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

`npm run dev` menjalankan Express dan Next.js dalam mode pengembangan, termasuk pembaruan otomatis komponen React. Tidak perlu menjalankan server frontend terpisah. Database tetap dijalankan melalui Docker atau instalasi PostgreSQL lokal.

### Build dan menjalankan mode produksi

```bash
npm run build
npm start
```

Jalankan ulang build setelah mengubah frontend. `npm start` memerlukan hasil build di `.next/`. Build tidak membutuhkan koneksi database; login dan operasi tiket memerlukannya.

Mode development menggunakan `.next-dev/`, sedangkan build produksi menggunakan `.next/`, agar `npm run build` tidak menimpa kompilasi server development yang sedang berjalan. Hentikan server produksi sebelum membangun ulang, lalu jalankan kembali setelah build selesai. Jika development dan produksi dijalankan bersamaan, gunakan port berbeda.

Jika muncul error `ENOENT ... .next/server/app/page.js` pada server development lama, hentikan dengan `Ctrl+C`, lalu jalankan ulang `npm run dev` dan muat ulang browser. Server akan membuat kompilasi development di folder terpisah.

### Halaman

- `/` — landing page pengenalan Helpdesk IT, fitur, dan cara kerja
- `/login` — login pengguna dan admin
- `/user` — dashboard dan tiket pengguna
- `/admin` — dashboard serta penanganan tiket IT Support

Tautan lama `/index.html`, `/user.html`, dan `/admin.html` otomatis diarahkan ke halaman baru. Akses dashboard diperiksa melalui sesi Express, dan API tetap memvalidasi peran serta kepemilikan tiket.

Pengunjung yang belum login diarahkan ke `/login` saat membuka dashboard. Setelah login, pengguna masuk ke dashboard sesuai perannya. Logout mengembalikan pengguna ke landing page.

## Akun Demo

User:
- Email: `user@helpdesk.local`
- Password: `user123`

Admin IT Support:
- Email: `admin@helpdesk.local`
- Password: `admin123`

## Jika PostgreSQL Sudah Terinstall Tanpa Docker

Buat database dan user sesuai `.env`, kemudian jalankan:

```bash
psql -U helpdesk -d helpdesk_it -f db/schema.sql
psql -U helpdesk -d helpdesk_it -f db/seed.sql
```

Sesuaikan `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, dan `DB_PASSWORD` pada `.env`.

`.env.example` disesuaikan dengan akun database pada Docker Compose. Untuk PostgreSQL lokal yang telah memiliki kredensial berbeda, gunakan kredensial database tersebut. Ganti `SESSION_SECRET` dengan nilai acak milik lingkungan Anda.

## Pemeriksaan integrasi

Setelah database siap dan `npm run build` berhasil, jalankan:

```bash
npm run test:submission
```

Skrip menjalankan server produksi khusus pada port 3107 dan menguji autentikasi, akses peran, kepemilikan tiket, pembuatan tiket, tanggapan, status, statistik, serta lampiran. Port 3107 harus kosong. Akun, tiket, dan lampiran uji dibuat sementara lalu dibersihkan ketika skrip selesai secara normal, termasuk jika pemeriksaan gagal. Jangan menghentikan proses secara paksa selama pengujian.

## Reset Database Docker

Jika ingin mengulang database dari awal:

```bash
docker compose down -v
docker compose up -d
```

## Catatan
- Next.js disajikan melalui custom server Express agar API, sesi login, dan upload tetap menggunakan satu origin. Gunakan `npm start`, bukan `next start`, untuk menjalankan seluruh aplikasi. Pola integrasi: [dokumentasi Next.js](https://nextjs.org/docs/15/app/guides/custom-server).
- Styling menggunakan utility Tailwind dan komponen React; halaman HTML, CSS, dan skrip DOM lama telah digantikan.
- Font di-host lokal bersama aplikasi, sehingga tampilan tidak memerlukan akses Google Fonts.
- Data tiket, user, dan tanggapan tersimpan di PostgreSQL, bukan `localStorage`.
- Folder `uploads/` menyimpan lampiran tiket pada server lokal.
