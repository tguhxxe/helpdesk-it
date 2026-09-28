# Hasil Pengujian Helpdesk IT

Tanggal pelaksanaan: **28 September 2026**  
Pemilik tugas: **Teguh Setia — 202310370311061**

## Ringkasan

- `npm run build`: **LULUS**, build produksi Next.js berhasil dan semua halaman dihasilkan.
- Koneksi PostgreSQL lokal: **LULUS**, kueri `SELECT 1` berhasil.
- `npm run test:submission`: **LULUS**, seluruh **17 kelompok pemeriksaan integrasi** berhasil.

Pengujian menjalankan server Express dan Next.js dalam mode produksi pada port 3107 dengan PostgreSQL lokal yang tersedia. Akun uji, tiket, dan lampiran uji dibuat sementara. Skrip membersihkannya serta menghentikan server khusus ketika selesai. Kredensial akun lokal tidak dicantumkan pada laporan.

## Hasil integrasi

### Pemeriksaan ulang error kompilasi development

- Sebelum perbaikan, `GET /` pada port 3000 menghasilkan HTTP 500 dengan `ENOENT ... .next/server/app/page.js`.
- Folder kompilasi development dipisahkan ke `.next-dev/`; produksi tetap memakai `.next/`.
- Setelah restart, `/` dan `/login` menghasilkan HTTP 200. Build produksi berhasil saat development berjalan, dan halaman development tetap menghasilkan HTTP 200 setelah build.
- Server development (3000) dan produksi (3100) berhasil menyajikan seluruh aset Next.js yang dirujuk halaman utama. Dashboard tanpa sesi menghasilkan redirect ke `/login`; `/api/health` menghasilkan HTTP 200.
- Pengujian integrasi dijalankan ulang setelah perbaikan: seluruh 17 kelompok pemeriksaan di bawah lulus. Verifikasi ulang ini berbasis HTTP, bukan interaksi browser otomatis.

| No | Pemeriksaan | Kebutuhan terkait | Hasil |
|---|---|---|---|
| 1 | Halaman publik dan login memberikan respons berhasil | US01 | Lulus |
| 2 | Dashboard tanpa sesi dialihkan ke login | US01 | Lulus |
| 3 | API tiket tanpa sesi ditolak | US01, NFR01 | Lulus |
| 4 | Login kosong dan password salah ditolak | US01 | Lulus |
| 5 | Login User dan admin menghasilkan tujuan sesuai peran | US01 | Lulus |
| 6 | User ditolak ketika meminta API admin | US07, NFR01 | Lulus |
| 7 | Kolom wajib dan prioritas tiket divalidasi | US03 | Lulus |
| 8 | Tiket baru tersimpan dengan status Menunggu | US03 | Lulus |
| 9 | Admin tidak dapat membuat tiket atas alur User | BR01 | Lulus |
| 10 | Daftar pribadi, detail, dan tanggapan membatasi kepemilikan | US05, US06 | Lulus |
| 11 | Tanggapan User dan admin tersimpan berurutan; pesan kosong ditolak | US06 | Lulus |
| 12 | Filter status dan pencarian tiket admin bekerja melalui API | US07 | Lulus |
| 13 | Perubahan status berhasil dan status tidak valid ditolak | US08 | Lulus |
| 14 | Jumlah total statistik sama dengan penjumlahan tiga status | US07 | Lulus |
| 15 | Lampiran dengan MIME PDF berhasil diunggah dan URL dapat diakses | US04 | Lulus |
| 16 | Jenis lampiran terlarang dan ukuran di atas 5 MB ditolak | US04 | Lulus |
| 17 | Logout mengakhiri sesi; pemeriksaan sesi berikutnya ditolak | US02 | Lulus |

## Cara mengulang

Siapkan database sesuai README, pastikan port 3107 kosong, kemudian jalankan:

```bash
npm run build
npm run test:submission
```

Keluaran yang diharapkan pada akhir pengujian: `SUCCESS 17 kelompok pemeriksaan lulus.`

## Batas pengujian

Pengujian ini memeriksa respons HTTP, aturan akses, dan penyimpanan data melalui server aplikasi. Belum mencakup interaksi browser otomatis, semua skenario dalam SKPL, pemeriksaan responsif 375/1440 px, navigasi keyboard, pengujian beban, serta audit keamanan menyeluruh. Berkas PDF uji berfungsi sebagai fixture unggah ber-MIME PDF, bukan uji kemampuan menampilkan isi PDF. Klaim lulus terbatas pada pemeriksaan yang tercantum di atas.

Validasi jenis lampiran berdasarkan MIME tidak membuktikan pemeriksaan isi berkas. Akses langsung ke URL lampiran belum dibatasi per pemilik tiket; pengujian kepemilikan pada nomor 10 berlaku pada API detail dan tanggapan. Hal ini dicatat sebagai batas versi akademik pada dokumen SKPL dan panduan pengumpulan.
