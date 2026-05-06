# Product Requirements Document (PRD)
## Sistem Pendaftaran Lomba Habibie Robotic Competition (HRC)

---

**Versi Dokumen:** 1.0  
**Tanggal:** 14 Maret 2026  
**Status:** Draft  
**Tim Pengembang:** Damar Kandi, Muhammad Mu'adz Ibda, M Bintang Zaky Zhafran  
**Dosen Pengampu:** Jeffry, S.Kom., M.T.  
**Institusi:** Institut Teknologi Bacharuddin Jusuf Habibie

---

## 1. Overview

### 1.1 Latar Belakang

Penyelenggaraan Habibie Robotic Competition (HRC) saat ini menghadapi sejumlah kendala dalam pengelolaan informasi dan proses pendaftaran. Informasi lomba tersebar di berbagai media, pendaftaran masih dilakukan secara manual, dan pengelolaan data peserta oleh panitia kurang terstruktur. Hal ini menyebabkan ketidakefisienan baik dari sisi peserta maupun panitia.

### 1.2 Tujuan Produk

Membangun sistem terpusat berbasis web yang mampu mengelola seluruh informasi lomba dan proses pendaftaran HRC secara digital, efisien, dan terstruktur — baik untuk peserta, panitia, maupun admin sistem.

### 1.3 Ruang Lingkup

Sistem mencakup modul pendaftaran peserta, manajemen informasi lomba, pembayaran online, dan dashboard monitoring. Sistem **tidak** mencakup penilaian lomba atau sistem manajemen pertandingan.

---

## 2. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Peserta** | Mahasiswa yang ingin mendaftar sebagai peserta lomba robotik HRC |
| **Panitia** | Penyelenggara lomba yang bertugas mengelola dan memverifikasi data peserta |
| **Admin** | Pengelola sistem yang bertanggung jawab atas keseluruhan konfigurasi platform |

---

## 3. Permasalahan yang Diselesaikan

| # | Masalah | Dampak |
|---|---|---|
| 1 | Informasi lomba tersebar di berbagai media | Peserta kesulitan menemukan informasi lengkap |
| 2 | Tidak ada platform terpusat untuk pendaftaran | Proses tidak terstandarisasi |
| 3 | Pendaftaran dilakukan secara manual | Rentan kesalahan data, tidak efisien |
| 4 | Data peserta tersebar di berbagai dokumen/spreadsheet | Sulit dikelola dan dipantau panitia |
| 5 | Panitia kesulitan memantau jumlah pendaftar | Tidak ada visibilitas real-time |

---

## 4. Fitur Utama & Persyaratan Fungsional

### 4.1 Registrasi dan Login Pengguna

**Deskripsi:** Sistem autentikasi untuk semua peran pengguna.

**User Stories:**
- Sebagai peserta, saya ingin mendaftar akun baru menggunakan email dan password agar dapat mengakses sistem.
- Sebagai pengguna, saya ingin login menggunakan email dan password serta mendapatkan sesi yang aman.
- Sebagai pengguna, saya ingin me-reset password melalui email jika lupa.

**Acceptance Criteria:**
- [ ] Registrasi memerlukan: nama lengkap, email, password, nomor telepon, dan asal institusi.
- [ ] Password minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
- [ ] Email harus terverifikasi sebelum akun aktif.
- [ ] Login menggunakan JWT (JSON Web Token) dengan expiry 24 jam.
- [ ] Terdapat mekanisme refresh token.
- [ ] Role-based access control (RBAC) untuk membedakan peserta, panitia, dan admin.

---

### 4.2 Pendaftaran Tim Lomba

**Deskripsi:** Peserta dapat mendaftarkan tim untuk mengikuti sub lomba yang dipilih.

**User Stories:**
- Sebagai peserta, saya ingin membuat tim dan mengundang anggota lain agar kami bisa mendaftar bersama.
- Sebagai peserta, saya ingin memilih kategori/sub lomba yang ingin diikuti.
- Sebagai peserta, saya ingin melihat status pendaftaran tim saya secara real-time.

**Acceptance Criteria:**
- [ ] Satu tim terdiri dari minimum 1 dan maksimum N anggota (dikonfigurasi per sub lomba).
- [ ] Ketua tim dapat menambah/menghapus anggota sebelum pendaftaran dikonfirmasi.
- [ ] Setiap anggota tim harus memiliki akun terdaftar.
- [ ] Tim hanya dapat mendaftar pada sub lomba yang kuotanya belum penuh.
- [ ] Status pendaftaran: `Draft` → `Submitted` → `Payment Pending` → `Confirmed` / `Rejected`.
- [ ] Sistem mengirim notifikasi email pada setiap perubahan status.

---

### 4.3 Manajemen Informasi Lomba

**Deskripsi:** Admin dan panitia dapat mengelola seluruh informasi terkait lomba.

**Sub-fitur:**
- **Guidebook:** Upload dan tampilkan dokumen panduan lomba (PDF).
- **Lomba:** CRUD kategori lomba utama.
- **Sub Lomba:** CRUD sub kategori/cabang lomba dengan kuota dan biaya pendaftaran.

**User Stories:**
- Sebagai admin, saya ingin menambah, mengedit, dan menghapus informasi lomba agar peserta selalu mendapat info terbaru.
- Sebagai peserta, saya ingin melihat detail lomba beserta guidebook-nya sebelum mendaftar.

**Acceptance Criteria:**
- [ ] Admin dapat melakukan CRUD pada entitas Lomba dan Sub Lomba.
- [ ] Admin dapat mengupload guidebook dalam format PDF (maks. 10MB).
- [ ] Setiap sub lomba memiliki atribut: nama, deskripsi, kuota maksimal, biaya pendaftaran, dan tanggal batas pendaftaran.
- [ ] Peserta dapat melihat informasi lomba tanpa login (public view).
- [ ] Guidebook dapat diunduh oleh peserta yang sudah login.

---

### 4.4 Manajemen Data Peserta dan Tim

**Deskripsi:** Panitia dapat melihat, memverifikasi, dan mengelola seluruh data pendaftar.

**User Stories:**
- Sebagai panitia, saya ingin melihat daftar semua tim yang telah mendaftar beserta statusnya.
- Sebagai panitia, saya ingin memverifikasi atau menolak pendaftaran tim.
- Sebagai panitia, saya ingin mengekspor data peserta ke format Excel/CSV.

**Acceptance Criteria:**
- [ ] Panitia dapat melihat tabel data tim dengan filter berdasarkan sub lomba, status, dan tanggal daftar.
- [ ] Panitia dapat mengubah status pendaftaran tim (Konfirmasi/Tolak) disertai catatan.
- [ ] Fitur ekspor data ke format `.xlsx` dan `.csv`.
- [ ] Panitia dapat melihat detail profil anggota tim.
- [ ] Sistem menyimpan log aktivitas perubahan status.

---

### 4.5 Payment Gateway

**Deskripsi:** Integrasi pembayaran online untuk biaya pendaftaran lomba.

**User Stories:**
- Sebagai peserta, saya ingin membayar biaya pendaftaran secara online setelah tim terdaftar.
- Sebagai panitia, saya ingin memantau status pembayaran setiap tim.

**Acceptance Criteria:**
- [ ] Integrasi dengan payment gateway (Midtrans / Xendit).
- [ ] Mendukung metode pembayaran: transfer bank, virtual account, dan e-wallet (GoPay, OVO, DANA).
- [ ] Sistem otomatis memperbarui status pendaftaran menjadi `Confirmed` setelah pembayaran sukses (via webhook).
- [ ] Bukti pembayaran dapat diunduh dalam format PDF.
- [ ] Pendaftaran otomatis dibatalkan jika pembayaran tidak selesai dalam 1x24 jam.
- [ ] Admin dapat melakukan refund manual melalui dashboard.

---

### 4.6 Dashboard Monitoring

**Deskripsi:** Tampilan ringkasan data dan statistik untuk panitia dan admin.

**User Stories:**
- Sebagai panitia, saya ingin melihat ringkasan jumlah pendaftar per sub lomba secara real-time.
- Sebagai admin, saya ingin memantau total pendapatan dari pendaftaran.

**Acceptance Criteria:**
- [ ] Dashboard menampilkan: total pendaftar, pendaftar per sub lomba, status pembayaran (lunas/belum), dan kuota tersisa.
- [ ] Visualisasi data menggunakan grafik (bar chart / pie chart).
- [ ] Data diperbarui secara real-time atau dengan interval maksimal 60 detik.
- [ ] Admin dapat melihat laporan pendapatan berdasarkan periode waktu.

---

## 5. Persyaratan Non-Fungsional

| Kategori | Persyaratan |
|---|---|
| **Performa** | Halaman utama load dalam < 3 detik pada koneksi 4G |
| **Keamanan** | Autentikasi JWT, HTTPS, proteksi XSS & SQL Injection, enkripsi password dengan bcrypt |
| **Skalabilitas** | Sistem mampu menangani minimal 500 pengguna konkuren |
| **Ketersediaan** | Uptime minimal 99% selama periode pendaftaran aktif |
| **Usabilitas** | Antarmuka responsif (mobile-friendly), mendukung browser Chrome, Firefox, Safari versi terbaru |
| **Maintainability** | Kode mengikuti standar ESLint, terdokumentasi, dan menggunakan version control (Git) |

---

## 6. Arsitektur Teknologi

### 6.1 Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React.js + React Router |
| **Backend** | REST API (Node.js / framework lain) |
| **Autentikasi** | JWT (JSON Web Token) |
| **Database** | Relational Database (MySQL / PostgreSQL) |
| **Payment** | Midtrans / Xendit |
| **Deployment** | Vercel (Frontend), Railway / Render (Backend) |

### 6.2 Entitas Data Utama

```
User
├── id, nama, email, password_hash, role, no_telepon, institusi, created_at

Lomba
├── id, nama, deskripsi, banner_url, created_at

SubLomba
├── id, lomba_id (FK), nama, deskripsi, kuota, biaya, deadline_daftar, guidebook_url

Tim
├── id, nama_tim, sublomba_id (FK), ketua_id (FK), status, created_at

AnggotaTim
├── id, tim_id (FK), user_id (FK), peran

Pembayaran
├── id, tim_id (FK), jumlah, metode, status, payment_ref, created_at
```

---

## 7. User Flow

### 7.1 Alur Pendaftaran Peserta

```
Buka Website → Lihat Info Lomba → Register Akun → Verifikasi Email
    → Login → Buat Tim → Pilih Sub Lomba → Isi Data Tim & Anggota
    → Submit Pendaftaran → Pembayaran → Konfirmasi Pendaftaran
```

### 7.2 Alur Verifikasi Panitia

```
Login (Panitia) → Dashboard → Lihat Daftar Tim → Review Data Tim
    → Konfirmasi / Tolak Pendaftaran → Notifikasi Email ke Peserta
```

---

## 8. Matriks Hak Akses

| Fitur | Peserta | Panitia | Admin |
|---|:---:|:---:|:---:|
| Lihat info lomba | ✅ | ✅ | ✅ |
| Download guidebook | ✅ | ✅ | ✅ |
| Daftar & kelola tim | ✅ | ❌ | ❌ |
| Bayar pendaftaran | ✅ | ❌ | ❌ |
| Lihat semua data peserta | ❌ | ✅ | ✅ |
| Verifikasi pendaftaran | ❌ | ✅ | ✅ |
| Ekspor data peserta | ❌ | ✅ | ✅ |
| CRUD info lomba & sub lomba | ❌ | ❌ | ✅ |
| Akses dashboard monitoring | ❌ | ✅ | ✅ |
| Manajemen user | ❌ | ❌ | ✅ |
| Kelola payment & refund | ❌ | ❌ | ✅ |

---

## 9. Milestones & Timeline

| Fase | Kegiatan | Estimasi Durasi |
|---|---|---|
| **Fase 1** | Setup project, desain UI/UX, arsitektur database | 1 minggu |
| **Fase 2** | Implementasi autentikasi & manajemen user | 1 minggu |
| **Fase 3** | CRUD lomba, sub lomba, guidebook | 1 minggu |
| **Fase 4** | Pendaftaran tim & manajemen data peserta | 2 minggu |
| **Fase 5** | Integrasi payment gateway | 1 minggu |
| **Fase 6** | Dashboard monitoring & laporan | 1 minggu |
| **Fase 7** | Testing, bug fixing, deployment ke Vercel | 1 minggu |
| **Total** | | **~8 minggu** |

---

## 10. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| Integrasi payment gateway gagal | Sedang | Tinggi | Siapkan sandbox testing sejak awal, gunakan dokumentasi resmi |
| Data peserta hilang/korup | Rendah | Tinggi | Backup database terjadwal, validasi input ketat |
| Sistem down saat pendaftaran ramai | Sedang | Tinggi | Load testing sebelum go-live, monitoring uptime |
| Fitur tidak selesai tepat waktu | Sedang | Sedang | Prioritaskan fitur inti (MVP), fitur tambahan di iterasi berikutnya |

---

## 11. Kriteria Keberhasilan (Success Metrics)

- 100% proses pendaftaran dapat dilakukan secara online tanpa perlu kontak manual.
- Tidak ada downtime > 1 jam selama periode pendaftaran aktif.
- Panitia dapat mengakses data peserta real-time tanpa harus membuka spreadsheet manual.
- Tingkat error pembayaran < 1% dari total transaksi.
- Waktu proses pendaftaran per tim < 10 menit.

---

## 12. Glosarium

| Istilah | Definisi |
|---|---|
| HRC | Habibie Robotic Competition |
| JWT | JSON Web Token — standar autentikasi berbasis token |
| CRUD | Create, Read, Update, Delete — operasi dasar database |
| REST API | Arsitektur komunikasi berbasis HTTP antara frontend dan backend |
| RBAC | Role-Based Access Control — kontrol akses berdasarkan peran pengguna |
| Webhook | Mekanisme notifikasi otomatis dari payment gateway ke sistem |
| MVP | Minimum Viable Product — versi minimum produk yang siap digunakan |

---

*Dokumen ini merupakan living document yang dapat diperbarui seiring perkembangan proyek.*