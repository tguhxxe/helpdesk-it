# Spesifikasi Kebutuhan Perangkat Lunak Helpdesk IT

Nama: Teguh Setia
NIM: 202310370311061
Tanggal: 28 September 2026
Versi dokumen: 1.0

## 1 Pendahuluan

Helpdesk IT adalah aplikasi web untuk mencatat masalah teknologi informasi dan mengelola penanganannya melalui tiket. Pengguna menyampaikan masalah, sedangkan Admin IT Support memberikan tanggapan dan memperbarui status penanganan. Dokumen ini menjelaskan kebutuhan fungsional, perjalanan pengguna, kriteria penerimaan, aturan bisnis, serta kebutuhan nonfungsional sistem.

### 1.1 Tujuan dan ruang lingkup

Sistem menyediakan satu tempat untuk pelaporan, pemantauan status, dan percakapan terkait masalah IT. Ruang lingkupnya meliputi login, logout, pembuatan tiket, lampiran, daftar dan detail tiket, pencarian, filter status, ringkasan jumlah tiket, tanggapan, serta perubahan status oleh admin.

Versi ini menggunakan akun yang telah disediakan. Pendaftaran mandiri, reset password, notifikasi email, pembagian tiket kepada teknisi, SLA otomatis, dan ekspor laporan berada di luar ruang lingkup.

### 1.2 Aktor sistem

| Aktor | Peran dan kebutuhan |
| --- | --- |
| User | Melaporkan masalah IT, melihat tiket miliknya, memantau status, dan memberikan informasi tambahan. |
| Admin IT Support | Melihat seluruh tiket, memeriksa detail, memberikan solusi, dan mengubah status penanganan. |

### 1.3 Gambaran teknis

Antarmuka menggunakan Next.js dan React. Express menangani API dan sesi login. PostgreSQL menyimpan akun, tiket, dan tanggapan; lampiran disimpan dalam folder uploads pada server. Halaman utama: /, /login, /user, dan /admin.

## 2 User Story dan Skenario Pengujian

Setiap skenario menyebutkan kondisi awal, tindakan, dan hasil yang harus diamati. Skenario utama dan pengecualian disertakan pada masing-masing user story. Kriteria ini merupakan acuan pengujian, bukan pernyataan bahwa semua jenis pengujian telah dilaksanakan.

### 2.1 Autentikasi pengguna

### US01 Login sesuai peran

User Story: Sebagai User atau Admin IT Support, saya ingin masuk menggunakan email dan password agar dapat mengakses fungsi yang sesuai dengan peran saya.

User Journey: Buka halaman login → isi email dan password → tekan Masuk → sistem memeriksa akun → dashboard sesuai peran terbuka.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: akun aktif tersedia dan belum login. | Mengirim email dan password yang benar. | Login berhasil. User diarahkan ke /user dan admin ke /admin. |
| Pengecualian: halaman login terbuka. | Mengirim password salah atau akun tidak ditemukan. | Login ditolak dan pesan ketidaksesuaian email atau password tampil. |
| Pengecualian: belum memiliki sesi. | Mengakses /user atau /admin secara langsung. | Sistem mengalihkan pengguna ke /login. |

### US02 Logout dan pengakhiran sesi

User Story: Sebagai pengguna yang sudah login, saya ingin keluar dari aplikasi agar sesi saya tidak dapat digunakan untuk mengakses dashboard setelah saya selesai.

User Journey: Buka dashboard → tekan Keluar → sesi diakhiri → halaman utama tampil.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: User atau admin sudah login. | Menekan Keluar. | Sesi berakhir dan halaman utama / ditampilkan. |
| Pengecualian: pengguna sudah logout. | Membuka kembali dashboard atau meminta API tiket. | Dashboard mengarah ke login; API terproteksi menolak akses tanpa sesi. |

## 2.2 Pelaporan masalah oleh User

### US03 Membuat tiket masalah IT

User Story: Sebagai User, saya ingin membuat tiket dengan judul, kategori, deskripsi, dan prioritas agar tim IT mengetahui masalah yang perlu ditangani.

User Journey: Login → pilih Buat tiket → lengkapi formulir → tekan Kirim tiket → tiket muncul pada daftar.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: User sudah login dan formulir terbuka. | Mengisi kolom wajib, memilih prioritas, lalu mengirim. | Tiket disimpan dengan kode unik, pemilik sesuai sesi, dan status awal Menunggu. |
| Pengecualian: formulir belum lengkap. | Mengirim tanpa judul, kategori, atau deskripsi. | Pengiriman ditolak; pengguna diminta melengkapi kolom wajib. |
| Pengecualian: permintaan berisi prioritas tidak valid. | Mengirim prioritas selain Rendah, Sedang, atau Tinggi. | API menolak permintaan dan tidak menyimpan tiket. |

### US04 Menyertakan lampiran tiket

User Story: Sebagai User, saya ingin menyertakan gambar atau PDF saat membuat tiket agar tim IT dapat memahami bukti masalah yang saya alami.

User Journey: Isi formulir tiket → pilih lampiran opsional → kirim tiket → buka detail untuk mengakses lampiran.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: formulir tiket valid. | Mengunggah satu PNG, JPG/JPEG, atau PDF berukuran maksimal 5 MB. | Tiket tersimpan dan tautan lampiran tersedia pada detail tiket. |
| Pengecualian: lampiran lebih besar dari 5 MB. | Mencoba mengirim formulir. | Pengunggahan ditolak dan batas ukuran dijelaskan. |
| Pengecualian: jenis MIME lampiran tidak diizinkan. | Mengunggah berkas selain PNG, JPEG, atau PDF. | Pengunggahan ditolak dengan pesan format yang diizinkan. |

Lampiran tidak wajib. Tiket dengan data wajib yang lengkap tetap dapat dibuat tanpa lampiran. Validasi jenis berkas pada versi ini menggunakan informasi MIME; pemeriksaan antivirus dan isi biner berkas tidak termasuk cakupan.

## 2.3 Pemantauan dan komunikasi tiket

### US05 Melihat tiket milik sendiri

User Story: Sebagai User, saya ingin melihat, mencari, dan memfilter tiket milik saya serta membuka detailnya agar dapat memantau perkembangan penanganan.

User Journey: Login → buka daftar tiket → gunakan pencarian atau filter → pilih tiket → baca status dan riwayat tanggapan.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: User mempunyai beberapa tiket. | Membuka dashboard, memilih status, atau mengetik kata kunci. | Daftar hanya berisi tiket miliknya yang cocok dengan filter dan pencarian. |
| Utama: tiket yang dipilih adalah milik User. | Membuka detail tiket. | Judul, kategori, prioritas, deskripsi, status, lampiran jika ada, dan tanggapan ditampilkan. |
| Pengecualian: tiket milik pengguna lain. | Meminta detail tiket melalui API. | Akses ditolak. |
| Pengecualian: kata kunci tidak cocok dengan tiket milik User. | Melakukan pencarian pada daftar pribadi. | Daftar menampilkan keadaan kosong tanpa tiket yang tidak relevan. |

### US06 Mengirim dan membaca tanggapan

User Story: Sebagai User pemilik tiket atau Admin IT Support, saya ingin mengirim tanggapan dan membaca percakapan agar informasi tambahan dan solusi tercatat pada tiket yang sama.

User Journey: Buka detail tiket → baca percakapan → ketik informasi atau solusi → kirim → riwayat diperbarui.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: pemilik tiket atau admin membuka detail. | Mengirim pesan yang tidak kosong. | Pesan tersimpan beserta pengirim dan waktu; riwayat diurutkan dari yang paling awal. |
| Pengecualian: kolom pesan kosong atau hanya spasi. | Mencoba mengirim tanggapan. | Tanggapan tidak disimpan; API menolak pesan kosong. |
| Pengecualian: User bukan pemilik tiket. | Mengirim tanggapan pada tiket tersebut. | API menolak akses dan tidak menambahkan tanggapan. |

## 2.4 Penanganan oleh Admin IT Support

### US07 Memantau dan mencari seluruh tiket

User Story: Sebagai Admin IT Support, saya ingin melihat jumlah dan daftar seluruh tiket, menggunakan filter status, serta mencari laporan agar dapat menentukan tiket yang perlu ditangani.

User Journey: Login sebagai admin → lihat ringkasan jumlah tiket → cari atau filter → buka detail tiket.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: admin sudah login. | Membuka dashboard admin. | Daftar seluruh tiket dan ringkasan total, Menunggu, Diproses, serta Selesai tersedia. |
| Utama: tersedia tiket dengan kode, judul, atau nama pelapor tertentu. | Mencari kata kunci dan memilih filter status. | Hanya tiket yang memenuhi pencarian dan status yang ditampilkan. |
| Pengecualian: akun memiliki peran User. | Mengakses API daftar atau statistik admin. | Permintaan ditolak karena fungsi tersebut khusus admin. |

### US08 Memperbarui status penanganan

User Story: Sebagai Admin IT Support, saya ingin mengubah status tiket agar pelapor mengetahui apakah laporannya menunggu, sedang diproses, atau sudah selesai.

User Journey: Buka detail tiket → pilih status → tekan Simpan status → status diperbarui → berikan tanggapan bila diperlukan.

| Kondisi awal (Given) | Tindakan (When) | Hasil yang diharapkan (Then) |
| --- | --- | --- |
| Utama: admin membuka tiket yang tersedia. | Memilih Diproses atau Selesai lalu menyimpan. | Status dan waktu pembaruan tiket tersimpan; tampilan diperbarui setelah data dimuat ulang. |
| Pengecualian: permintaan berisi status tidak dikenal. | Mengirim status selain tiga nilai yang ditetapkan. | API menolak perubahan dan status lama tetap berlaku. |
| Pengecualian: tiket tidak ditemukan. | Mencoba menyimpan perubahan status. | API mengembalikan pesan bahwa tiket tidak ditemukan. |

Alur operasional yang umum adalah Menunggu → Diproses → Selesai. Sistem saat ini mengizinkan admin memilih kembali salah satu dari ketiga status; transisi satu arah dan kewajiban mengisi solusi sebelum menutup tiket tidak diberlakukan.

## 3 Aturan Bisnis dan Data Sistem

### BR01 Pembagian hak akses

Hanya User yang dapat membuat tiket. Admin dapat melihat seluruh tiket dan memperbarui status. API detail dan tanggapan hanya dapat diakses oleh pemilik tiket atau admin.

### BR02 Data wajib tiket

Kategori, judul, dan deskripsi wajib diisi. Formulir membatasi judul sampai 160 karakter. Pilihan kategori pada antarmuka adalah Jaringan, Perangkat Keras, Perangkat Lunak, Akun & Akses, dan Lainnya.

### BR03 Prioritas

Nilai prioritas adalah Rendah, Sedang, atau Tinggi. Nilai bawaan adalah Sedang. Prioritas tidak otomatis menetapkan batas waktu layanan.

### BR04 Status tiket

Tiket baru berstatus Menunggu. Hanya admin dapat menggantinya menjadi Menunggu, Diproses, atau Selesai. Pengiriman tanggapan tidak otomatis mengubah status.

### BR05 Lampiran

Satu lampiran opsional dapat dikirim ketika tiket dibuat. Batasnya 5 MB dengan jenis MIME PNG, JPEG, atau PDF. Penggantian dan penambahan lampiran setelah tiket dibuat tidak disediakan.

### BR06 Riwayat tanggapan

Pesan harus berisi teks selain spasi. Sistem menyimpan identitas pengirim dan waktu pengiriman. Percakapan tetap tersedia ketika status tiket Selesai; status tersebut tidak mengunci balasan.

### BR07 Sesi dan akun

Email menjadi pengenal akun yang unik. Password disimpan sebagai hash bcrypt. Sesi login memiliki konfigurasi masa berlaku cookie delapan jam dan dihapus saat logout. Akun demo disediakan melalui seed database.

### BR08 Penyimpanan

Tiket, akun, dan tanggapan disimpan pada PostgreSQL. Lampiran disimpan pada server lokal. Penghapusan atau penyuntingan isi tiket oleh pengguna tidak disediakan dalam versi ini.

### 3.1 Data utama

| Entitas | Informasi yang disimpan |
| --- | --- |
| users | Nama, email unik, hash password, peran, dan waktu dibuat. |
| tickets | Kode unik, pemilik, kategori, judul, deskripsi, prioritas, status, lokasi lampiran, serta waktu dibuat dan diperbarui. |
| ticket_replies | Referensi tiket, pengirim, isi pesan, dan waktu dibuat. |

## 4 Kebutuhan Nonfungsional dan Keterlacakan

| ID | Kebutuhan dan kriteria pemeriksaan |
| --- | --- |
| NFR01 | Kontrol akses: API tiket memerlukan sesi; detail dan tanggapan memeriksa pemilik atau admin. Uji akses tanpa sesi, lintas pemilik, dan akses User ke API admin. |
| NFR02 | Integritas data: relasi tiket, pemilik, dan tanggapan dijaga database; kode tiket serta email harus unik. Periksa foreign key dan constraint pada schema.sql. |
| NFR03 | Kegunaan: formulir memiliki label, status pengiriman, dan pesan kesalahan. Periksa pengisian data valid, data kosong, pencarian tanpa hasil, serta kegagalan permintaan. |
| NFR04 | Tampilan responsif: halaman harus dapat digunakan pada ponsel dan desktop. Kriteria pemeriksaan visual: uji pada lebar 375 px dan 1440 px untuk formulir, daftar, dan dialog detail. |
| NFR05 | Aksesibilitas dasar: navigasi keyboard, fokus terlihat, label formulir, dan dialog yang dapat ditutup dengan Escape. Periksa urutan Tab dan pengembalian fokus dari dialog. |
| NFR06 | Kemudahan pemasangan: tersedia package-lock.json, .env.example, schema, seed, Docker Compose, serta petunjuk instalasi. npm run build harus berhasil sebelum menjalankan mode produksi. |

Batas operasional: sesi masih disimpan dalam memori proses dan hilang ketika server dimulai ulang. Lampiran dilayani melalui URL berkas; pembatasan akses per pemilik pada URL lampiran belum diterapkan. Pengujian beban, jaminan waktu respons, pencadangan otomatis, dan kesiapan produksi tidak termasuk cakupan versi akademik ini.

### 4.1 Keterlacakan kebutuhan terhadap implementasi

| Kebutuhan | Komponen utama |
| --- | --- |
| US01–US02 | src/routes/auth.js; src/components/login-form.js; src/server.js |
| US03–US04 | src/routes/tickets.js; src/components/create-ticket.js |
| US05–US06 | src/routes/tickets.js; src/components/dashboard.js; src/components/ticket-detail.js |
| US07–US08 | src/routes/admin.js; src/components/dashboard.js; src/components/ticket-detail.js |
| BR01–BR08 | src/middleware/auth.js; src/routes; db/schema.sql; db/seed.sql |

### 4.2 Verifikasi dan referensi

Pemeriksaan integrasi tersedia melalui npm run test:submission setelah build dan database siap. Hasil pelaksanaan dicatat terpisah dalam docs/HASIL_PENGUJIAN.md. Pemeriksaan integrasi tidak menggantikan pemeriksaan visual dan aksesibilitas manual.

Referensi penyusunan: instruksi tugas spesifikasi kebutuhan, Contoh User Story.docx sebagai acuan struktur, serta implementasi dan README proyek Helpdesk IT. Petunjuk pemasangan dan demonstrasi tersedia dalam README.md dan PENGUMPULAN.md.
