# Panduan Pengumpulan Tugas Helpdesk IT

Nama: **Teguh Setia**  
NIM: **202310370311061**  
Bentuk spesifikasi: **User Story dalam dokumen SKPL**

## Berkas pengumpulan

1. `docs/SKPL_Helpdesk_IT_Teguh_Setia.docx`: dokumen utama untuk dikumpulkan.
2. Kode aplikasi Helpdesk IT beserta konfigurasi contoh, skema dan data demo database.
3. `README.md`: petunjuk pemasangan aplikasi dan akun demo.
4. `docs/HASIL_PENGUJIAN.md`: catatan pemeriksaan build dan integrasi.
5. `docs/SPESIFIKASI_KEBUTUHAN.md`: versi teks untuk memudahkan pembacaan spesifikasi.

Paket ZIP menyatukan berkas tersebut. Isi paket tidak menyertakan `.env` lokal, `.git`, `node_modules`, `.next`, data database aktif, atau lampiran pengguna. Database baru dapat diinisialisasi menggunakan schema dan seed yang disediakan.

Instruksi tugas meminta satu aplikasi yang sudah dibuat dan salah satu bentuk spesifikasi kebutuhannya. Paket ini menggunakan bentuk tertulis User Story; diagram use case bukan persyaratan tambahan untuk pilihan tersebut. Batas pengumpulan pada instruksi adalah Selasa, 29 September, pukul 21.00 WIB. Unggah paket melalui sarana pengumpulan yang ditentukan pengajar.

## Menjalankan aplikasi dari paket

1. Ekstrak ZIP dan buka terminal pada folder `Helpdesk_IT_Teguh_Setia_202310370311061`.
2. Siapkan Node.js 22 LTS dan Docker dengan Docker Compose.
3. Salin `.env.example` menjadi `.env`:
   - Linux/macOS: `cp .env.example .env`
   - Windows PowerShell: `Copy-Item .env.example .env`
4. Ganti nilai `SESSION_SECRET` pada `.env` dengan teks acak. Kredensial database contoh sudah sesuai dengan Docker Compose.
5. Jalankan `npm ci` untuk memasang dependensi yang dikunci dalam package-lock.
6. Jalankan `docker compose up -d`, lalu tunggu status database sehat pada `docker compose ps`.
7. Jalankan `npm run build`, kemudian `npm start`.
8. Buka `http://localhost:3000`.

Jika port database 5432 telah digunakan PostgreSQL lain, gunakan salah satu lingkungan database dan ikuti petunjuk PostgreSQL lokal pada README. Jangan menghapus volume database lama hanya untuk menjalankan demo.

## Urutan demonstrasi

1. Tampilkan halaman utama dan jelaskan tujuan aplikasi: pencatatan serta penanganan masalah IT melalui tiket.
2. Login sebagai User menggunakan `user@helpdesk.local` / `user123`.
3. Buat tiket berjudul “Tidak dapat mengakses Wi-Fi”, kategori Jaringan, prioritas Tinggi, dan deskripsi masalah. Tambahkan PNG/JPG/PDF maksimal 5 MB jika diperlukan.
4. Tunjukkan bahwa tiket baru berstatus Menunggu, lalu buka detail dan kirim informasi tambahan.
5. Logout, kemudian login sebagai Admin IT Support menggunakan `admin@helpdesk.local` / `admin123`.
6. Cari tiket tersebut, ubah status ke Diproses, dan kirim tanggapan atau solusi.
7. Ubah status ke Selesai setelah contoh penanganan dijelaskan.
8. Login kembali sebagai User untuk memperlihatkan status dan riwayat tanggapan. Muat ulang daftar jika perubahan dilakukan dari sesi lain.
9. Hubungkan demonstrasi dengan US01 sampai US08 pada dokumen SKPL.

## Pemeriksaan sebelum unggah

- Pastikan nama dan NIM pada dokumen sesuai.
- Jika sistem pengumpulan meminta kelas, mata kuliah, atau dosen, isi pada formulir pengumpulan sesuai informasi dari pengajar. Data tersebut tidak dicantumkan karena belum diberikan.
- Buka DOCX dan pastikan aplikasi dapat dijalankan menggunakan panduan di atas.
- Jika hanya dokumen diminta pada kolom unggah, gunakan DOCX; bila kode aplikasi juga diminta, unggah ZIP sesuai petunjuk pengajar.

## Batas versi

Aplikasi disiapkan untuk demonstrasi akademik. Tidak ada pendaftaran mandiri, reset password, notifikasi email, SLA otomatis, ataupun ekspor laporan. Sesi masih disimpan dalam memori proses. URL lampiran belum memeriksa kepemilikan tiket, walaupun API detail dan tanggapan sudah membatasinya. Pengujian integrasi tidak membuktikan kesiapan produksi atau kelulusan audit keamanan menyeluruh.
