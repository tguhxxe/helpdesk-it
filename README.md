# Website Helpdesk IT — JavaScript + Express + PostgreSQL

Project ini merupakan website Helpdesk IT full-stack yang sesuai dengan dokumen SKPL/User Story. Sistem memiliki dua aktor: **User** dan **Admin IT Support**.

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
- Frontend: HTML5, CSS3, Vanilla JavaScript (Fetch API)
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
├── public/
│   ├── css/style.css
│   ├── js/
│   │   ├── common.js
│   │   ├── login.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── index.html
│   ├── user.html
│   └── admin.html
├── src/
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
├── package.json
└── README.md
```

## Cara Menjalankan — Cara Paling Mudah (Docker untuk PostgreSQL)

### 1. Install kebutuhan
- Node.js 18 atau lebih baru
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
- Project ini sengaja menggunakan JavaScript/Express agar ringan dan mudah dijalankan untuk demonstrasi tugas.
- Data tiket, user, dan tanggapan tersimpan di PostgreSQL, bukan `localStorage`.
- Folder `uploads/` menyimpan lampiran tiket pada server lokal.
