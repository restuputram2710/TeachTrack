# 📋 Panduan Instalasi — TeachTrack (Absensi Guru Pamong SMA Terbuka)

**Versi 1.1.0** · Backend: Google Apps Script (REST API) · Database: Google Sheets · Berkas: Google Drive · Frontend: GitHub Pages

Anda menerima **3 berkas**:

| Berkas | Untuk apa | Cara pakai |
|---|---|---|
| `Kode.gs` | Seluruh backend (API) | Salin-tempel ke editor Apps Script |
| `appsscript.json` | Pengaturan proyek (zona waktu WIB) | Salin-tempel ke manifest Apps Script |
| `teachtrack-frontend.zip` | Tampilan aplikasi (HTML/CSS/JS) | Ekstrak, isi `js/config.js`, unggah ke GitHub Pages |

Urutan kerja: **Backend dulu → salin URL /exec → Frontend → Mulai pakai.** Total ±30–45 menit.

---

## BAGIAN A — Backend (Google Apps Script)

> Pakai **akun Google sekolah/pemilik** yang akan menyimpan semua data. Semua spreadsheet, foto, dan PDF akan tersimpan di Drive akun ini.

### A1. Buat proyek
1. Buka **https://script.google.com** → **Proyek baru**.
2. Ganti nama proyek (kiri atas) menjadi `TeachTrack API`.
3. Hapus isi `Kode.gs` bawaan, lalu **tempel seluruh isi berkas `Kode.gs`** → tekan **Simpan** (ikon disket / Ctrl+S).

### A2. Atur manifest (zona waktu WIB)
1. Klik ⚙️ **Setelan Proyek** (ikon roda gigi, kiri).
2. Centang **"Tampilkan file manifes 'appsscript.json' di editor"**.
3. Kembali ke **Editor** → buka `appsscript.json` → ganti seluruh isinya dengan isi berkas `appsscript.json` → **Simpan**.

### A3. Jalankan setup (SEKALI)
1. Di bilah atas, pilih fungsi **`setupAppEnvironment`** → klik **▶ Jalankan**.
2. Muncul "Otorisasi diperlukan" → **Tinjau izin** → pilih akun Anda → **Lanjutan** → **Buka TeachTrack API (tidak aman)** → **Izinkan**.
   *(Peringatan "tidak aman" muncul karena skrip buatan sendiri, bukan dari Google. Ini normal.)*
3. Buka **Log eksekusi**. Anda akan melihat:

```
🚀 Setup TeachTrack v1.0.0 dimulai…
✅ Folder Drive: https://drive.google.com/drive/folders/…
👤 AKUN ADMIN PERTAMA (catat sekarang — hanya tampil sekali, wajib diganti saat login pertama)
   Username   : admin
   Kata sandi : XXXXXXXXXXXX
🔐 AKSES DARURAT (simpan di tempat aman — hanya tampil sekali)
   Halaman    : <alamat aplikasi>/#/darurat
   Username   : darurat
   Kata sandi : XXXXXXXXXXXXXXXX
✅ Trigger keepWarm (tiap 1 menit, aktif 05.00–20.00 WIB) terpasang.
✅ Setup selesai.
```

4. **📝 Catat sandi admin & sandi darurat sekarang.** Keduanya tidak akan tampil lagi.
5. Cek Google Drive: ada folder **"TeachTrack — Absensi Guru Pamong"** berisi spreadsheet `🗃️ Database — TeachTrack` dan subfolder Foto Absensi, Lampiran Izin, Identitas Aplikasi, Laporan PDF.

> ✅ `setupAppEnvironment` **aman dijalankan ulang** (misalnya setelah update kode). Rahasia, admin, dan data yang sudah ada tidak akan ditimpa atau digandakan.

**Opsional — data contoh untuk uji coba:** jalankan `isiDataContoh` untuk membuat 2 TKB, 3 guru contoh, dan jadwal. Username/sandi guru contoh tampil di log. Hapus data contoh sebelum dipakai sungguhan.

### A4. Deploy sebagai Web App
1. Klik **Terapkan (Deploy)** → **Deployment baru**.
2. Ikon ⚙️ di "Pilih jenis" → **Aplikasi web**.
3. Isi:
   - Deskripsi: `v1.0.0`
   - **Jalankan sebagai: Saya** (akun Anda)
   - **Yang memiliki akses: Siapa saja** (*Anyone*)
4. **Terapkan** → salin **URL aplikasi web** (berakhiran `/exec`).
5. Tes: buka URL itu di browser. Harus muncul teks seperti `{"success":true,"app":"TeachTrack API","v":"1.0.0",…,"siap":true}`.

> ⚠️ **Setiap kali `Kode.gs` diubah**, perbarui deployment: **Terapkan → Kelola deployment → ✏️ Edit → Versi: Versi baru → Terapkan**. Jangan membuat "Deployment baru", karena URL /exec akan berubah.

---

## BAGIAN B — Frontend (GitHub Pages)

### B1. Ekstrak & isi konfigurasi
1. Ekstrak `teachtrack-frontend.zip`. Folder hasil ekstraksi **langsung berisi** `index.html`, folder `css/`, dan folder `js/`.
   **👉 Folder inilah yang nanti di-`git init` dan diunggah. Jangan naik atau turun satu level.**
2. Buka `js/config.js` dengan Notepad, ganti `GANTI_DENGAN_ID_DEPLOYMENT…` dengan URL /exec dari langkah A4:

```js
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycb.................../exec'
};
```

### B2. Unggah ke GitHub Pages (lewat terminal)
> Jangan memakai "Upload files" di situs GitHub, karena struktur folder `css/` dan `js/` bisa rusak dan halaman tampil tanpa gaya.

1. Instal Git: https://git-scm.com/download/win (pengaturan bawaan). Di Mac/Linux biasanya sudah ada.
2. Buat repository **Public** baru di https://github.com/new (misalnya `teachtrack`). **Jangan** centang README.
3. Buka folder hasil ekstraksi di File Explorer → klik bilah alamat → ketik `powershell` → Enter.
4. Pastikan Anda di folder yang benar: ketik `dir`. Harus terlihat `index.html`, `css`, dan `js`.
5. Jalankan satu per satu:

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@akun-github.com"
git init
git add .
git commit -m "Upload pertama TeachTrack"
git branch -M main
git remote add origin https://github.com/USERNAME/teachtrack.git
git push -u origin main
```

   Saat diminta *password*, tempel **Personal Access Token**, bukan sandi akun. Buat token di https://github.com/settings/tokens → *Generate new token (classic)* → centang **repo**. Saat token ditempel, layar memang tidak menampilkan apa-apa. Itu normal.
6. Di GitHub: **Settings → Pages** → Source **Deploy from a branch** → Branch **main / (root)** → **Save**. Centang **Enforce HTTPS** (wajib, karena kamera & GPS butuh HTTPS).
7. Tunggu 1–2 menit. Aplikasi aktif di `https://USERNAME.github.io/teachtrack/`.

**Update di kemudian hari:** dari folder yang sama jalankan `git add .` → `git commit -m "update"` → `git push`, lalu tekan **Ctrl+Shift+R** di browser.

---

## BAGIAN C — Mulai Pakai (Admin)

1. Buka alamat aplikasi → masuk dengan **admin** + sandi dari log → buat **sandi baru** (wajib).
2. **Pengaturan Sistem → Identitas Aplikasi**: unggah logo, nama aplikasi, sekolah induk, wilayah, warna → **Simpan**.
3. **Aturan Absen & Honor**: tarif per kehadiran (bawaan Rp 50.000), toleransi terlambat (15 menit), radius (50 m), akurasi GPS maks (100 m), nomor WA admin.
4. **Penandatangan Laporan**: nama, jabatan, dan NIP untuk kop PDF.
5. **Data TKB → Tambah TKB**: datang ke titik tengah tiap TKB → **Ambil Lokasi Saya Sekarang** (tunggu akurasi ≤ 10 m) atau klik di peta → **Simpan** → **Cetak QR** → tempel di lokasi.
6. **Data Guru → Impor CSV** (unduh template, isi 30 guru) atau **Tambah Guru** satu per satu. Sandi awal tiap guru hanya tampil **sekali**. Gunakan **Salin Semua / Unduh CSV** lalu bagikan secara pribadi.
7. **Jadwal Mengajar → Tambah Jadwal** per guru (hari, jam, TKB, mapel, kelas). Jadwal menentukan status tepat waktu, terlambat, dan alpa.
8. **Agenda**: tambahkan rapat atau kegiatan. Agenda tampil di beranda guru.
9. Uji coba 1 minggu dengan 3–5 guru, lalu gunakan untuk semua guru.

**Guru:** buka link → masuk dengan NIP + sandi awal → buat sandi baru → di TKB tekan **Scan QR** → izinkan kamera & lokasi → ambil foto → **Kirim**.
💡 Sarankan guru menambahkan aplikasi ke layar utama HP (menu browser → *Tambahkan ke layar utama*).

---

## BAGIAN D — Opsional

### D1. Login dengan Google
1. https://console.cloud.google.com/apis/credentials → **Create credentials → OAuth client ID → Web application**.
2. **Authorized JavaScript origins**: `https://USERNAME.github.io` (tanpa garis miring dan tanpa nama repo di belakang).
3. Salin Client ID → di aplikasi: **Pengaturan → Login Google** → tempel → **Simpan**.
4. Guru yang masuk dengan Google untuk pertama kali masuk antrean **Persetujuan → Akun Google Baru**. Admin bisa **menautkan** akun itu ke data guru yang sudah ada (disarankan) atau menjadikannya akun baru. Guru yang email Google-nya sudah diisi admin di Data Guru bisa langsung masuk.

### D2. Impor data dari aplikasi lama / spreadsheet lain
**Pengaturan → Impor Data** → tempel URL spreadsheet lama → **Pindai (Dry-run)** untuk melihat apa yang akan ditambah atau diperbarui (belum menulis apa pun) → **Jalankan Impor**.
- Spreadsheet lama hanya **dibaca**.
- Impor aman diulang: tidak ada baris ganda. Jalankan sekali lagi tepat sebelum pindah untuk menangkap data terbaru (*delta sync*).
- Kata sandi tidak ikut pindah. Sistem membuat sandi awal baru, yang tampil sekali di layar.
- Gunakan akun Google yang sama agar foto dan lampiran lama tetap terbaca.

---

## BAGIAN E — Keamanan & Rahasia

Semua rahasia disimpan di **Script Properties** (Apps Script → ⚙️ Setelan Proyek → *Properti skrip*), **bukan** di kode, Sheets, atau frontend.

| Kunci | Isi | Diisi oleh |
|---|---|---|
| `SESSION_SECRET` | Kunci tanda tangan token sesi | Otomatis saat setup |
| `PW_<id guru>` | Salt + hash sandi tiap pengguna (sandi asli tidak pernah disimpan) | Otomatis |
| `EMERGENCY_USER`, `EMERGENCY_SALT`, `EMERGENCY_PASS_HASH` | Akses darurat | Otomatis saat setup |
| `SPREADSHEET_ID`, `DRIVE_ROOT_FOLDER_ID`, `FOLDER_*` | Lokasi database & folder | Otomatis saat setup |
| `GOOGLE_CLIENT_ID` | Login Google | Admin, lewat menu Pengaturan |

> Catatan perbaikan dari PRD: PRD menaruh kolom `hash_sandi` dan `salt` di sheet Pengguna. Demi keamanan (spreadsheet sering dibagikan ke panitia), keduanya dipindahkan ke Script Properties. Sheet `AppConfig` hanyalah catatan baca-saja.

**Wajib dipatuhi:**
- Jangan menambah *editor* proyek Apps Script sembarangan, karena editor bisa melihat Script Properties.
- Jangan membagikan spreadsheet database ke banyak orang.
- Lupa sandi admin → jalankan `resetSandiAdmin` di editor (sandi baru tampil di log).
- Akun admin terkunci atau hilang → buka `https://alamat-aplikasi/#/darurat`, masuk dengan kredensial darurat (salah 5× = dikunci 15 menit). Buat kredensial baru dengan `resetAksesDarurat`.
- Curiga ada kebocoran → jalankan `rotasiSecretSesi` (semua orang harus masuk ulang).

---

## BAGIAN F — Performa & Kuota

- **Cache berversi:** data master di-cache di server (CacheService) dan di HP (penyimpanan lokal). Pindah menu terasa instan. Cache otomatis diperbarui setiap kali data diubah lewat aplikasi.
- **Penggabung batch:** beberapa permintaan baca di waktu yang sama digabung menjadi 1 eksekusi server.
- **Pemanasan 3 lapis:** (1) browser "membangunkan" server saat halaman masuk dibuka, (2) trigger `keepWarm` tiap 1 menit pukul 05.00–20.00 WIB, (3) data dipanaskan ulang otomatis. Ini menjaga cache tetap hangat, tetapi tidak menjamin server Google selalu dalam keadaan hangat.
- **Kuota trigger** akun Gmail biasa ±90 menit/hari. `keepWarm` memakai ±10–20 menit/hari. Untuk mematikannya, jalankan `matikanKeepWarm` (nyalakan lagi dengan `nyalakanKeepWarm`).
- `cekPerforma` di editor menampilkan status cache, trigger, dan ukuran Script Properties.
- Edit **langsung di Google Sheets** baru terlihat di aplikasi setelah cache kedaluwarsa (maks ±6 jam). Lakukan perubahan lewat menu aplikasi, atau jalankan ulang `setupAppEnvironment` (membersihkan cache tanpa mengubah data).
- Di konsol browser (F12): `Perf.table()` dan `Perf.summary()` menampilkan waktu tiap panggilan API.

---

## BAGIAN G — Kendala Umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| Layar "Konfigurasi belum lengkap" | `GAS_URL` belum diisi | Isi `js/config.js`, lalu `git push` ulang |
| "Tidak dapat terhubung ke server" | Deploy belum "Siapa saja" / URL salah | Ulangi A4. Pastikan URL berakhiran `/exec` |
| "Server mengirim balasan tidak dikenal" | Akses Web App bukan *Anyone* | Kelola deployment → akses **Siapa saja** |
| GitHub Pages 404 | Yang di-push folder induk, bukan folder berisi `index.html` | Push ulang dari folder yang benar (`git push --force`) |
| Halaman tanpa warna/gaya | Folder `css/` atau `js/` rusak | Jangan pakai "Upload files". Push via terminal |
| Kamera tidak muncul | Izin kamera ditolak / bukan HTTPS | Izinkan kamera di pengaturan situs. Aktifkan *Enforce HTTPS* |
| "Akurasi GPS terlalu rendah" | Di dalam ruangan / mode hemat baterai | Aktifkan lokasi **akurasi tinggi**, ke area terbuka, tekan **Segarkan GPS** |
| "Anda berada ±X m dari TKB" | Di luar radius / titik TKB kurang tepat | Mendekat. Admin bisa memperbaiki titik TKB atau memperbesar radius |
| "QR tidak berlaku" | QR sudah dibuat ulang | Cetak dan tempel QR terbaru dari menu TKB |
| Tombol Google tidak berfungsi | Origin belum didaftarkan | Tambahkan `https://USERNAME.github.io` di OAuth client |
| PDF lambat | Rentang panjang + lampiran rincian | Normal ±5–15 detik. Kurangi rentang atau matikan lampiran |
| Tampilan versi lama setelah update | Cache browser | Ctrl+Shift+R / buka mode Incognito |

---

## BAGIAN H — Hasil Pengujian (sebelum diserahkan)

Diuji dengan **simulator Google Apps Script** (Node.js) yang menjalankan `Kode.gs` asli, plus **browser Chromium** dengan kamera & GPS tiruan:

- **Backend 69/69 lulus**, mencakup semua skenario PRD 8.2:
  - tepat waktu, terlambat 20 menit, ditolak di luar radius (±200 m), akurasi GPS buruk ditolak, absen ganda ditolak;
  - QR lama ditolak setelah dibuat ulang, izin disetujui memblokir absen, alpa otomatis, filter hari Sabtu;
  - honorarium = kehadiran terverifikasi × tarif + terbilang, PDF rekap & honor;
  - setup idempoten, rahasia tidak bocor ke Sheets/log, guru tidak bisa membuka API admin;
  - login Google + persetujuan & penautan akun, impor dry-run & idempoten.
- **UI 35/35 lulus** tanpa error JavaScript:
  - alur guru penuh (login → beranda → scan QR → GPS → foto → kirim → status berubah);
  - semua halaman admin, cetak PDF, verifikasi, persetujuan, tambah guru, cetak QR, ganti tema;
  - tampilan HP tanpa scroll horizontal.

Pengujian dilakukan di simulator, bukan di server Google yang sebenarnya. Lakukan uji coba lapangan 1 minggu di 2 TKB sebelum dipakai seluruh guru.


---

## BAGIAN I — Fitur v1.1

Jurnal Mengajar (PDF Sabtu–Minggu), PDF Honorarium format SMATER, PDF Jadwal Pelajaran per TKB, isian "Minggu ke" pada jadwal, serta Pengaturan → **Kop & Penandatangan** (3 penandatangan + logo kop). Langkah update dari v1.0 ada di `UPDATE-v1.1.md`.

*site by Restu Putra Mulyana*
