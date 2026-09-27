# Helpdesk IT — Next.js + Express + PostgreSQL

Website Helpdesk IT dengan antarmuka React yang minimalis dan responsif. Sistem memiliki dua aktor: **User** dan **Admin IT Support**. Frontend menggunakan Next.js App Router dan Tailwind CSS, sedangkan API Express, sesi login, dan database PostgreSQL berjalan dalam aplikasi yang sama.

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
│   ├── app/                 # Halaman Next.js: /, /user, /admin
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
npm install
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

### Halaman

- `/` — login
- `/user` — dashboard dan tiket pengguna
- `/admin` — dashboard serta penanganan tiket IT Support

Tautan lama `/index.html`, `/user.html`, dan `/admin.html` otomatis diarahkan ke halaman baru. Akses dashboard diperiksa melalui sesi Express, dan API tetap memvalidasi peran serta kepemilikan tiket.

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
