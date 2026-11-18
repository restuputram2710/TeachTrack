# 🔄 Panduan Update TeachTrack v1.1 → v1.2

**Isi update: Laporan Bukti Kinerja & Dokumentasi Guru Pamong (isi manual)**

Fitur baru ini melengkapi Jurnal Mengajar yang sudah ada. Jurnal otomatis dan fitur lain **tidak diubah**. Data lama, akun, sandi, dan URL `/exec` tetap sama.

1. **Identitas laporan**: nama guru pamong, TKB, ALAMIN (opsional), SMA Induk / SMATER, dan **rentang bulan** (bulan awal s.d. bulan akhir, maksimal 12 bulan).
2. **Kegiatan** (maksimal 60 per laporan), masing-masing berisi:
   - tanggal mulai, dan *sampai tanggal* (opsional, untuk kegiatan Sabtu–Minggu);
   - uraian kegiatan pembelajaran;
   - mata pelajaran yang diajarkan (satu per baris);
   - guru kunjung yang hadir (satu nama per baris);
   - keterangan kehadiran siswa;
   - **satu foto dokumentasi**, diunggah langsung dari HP atau komputer dan dikompres otomatis.
3. **Tambah, ubah, hapus** kegiatan; **ubah identitas**; **hapus laporan**. Setiap tombol *Simpan* langsung menyimpan ke server.
4. **Unduh PDF** dengan format dokumen referensi: judul, blok identitas, baris *Bulan*, tabel **No | Hari/Tanggal | Uraian | Foto Dokumentasi**, dan blok tanda tangan (Mengetahui: Penandatangan 3; Guru Pamong).

---

## Langkah 1 — Backend (Apps Script)

1. Buka proyek Apps Script → `Kode.gs` → tekan **Ctrl+A** → hapus → **tempel isi `dist/backend/Kode.gs` versi baru** → **Simpan**.
   File ini sudah memuat modul baru (`Modul_Bukti`) dan versi 1.2.0.
2. Pilih fungsi **`setupAppEnvironment`** → ▶ **Jalankan** sekali. Langkah ini hanya menambah sheet **`BuktiLaporan`** dan **`BuktiKegiatan`**. Data, rahasia, dan admin **tidak ditimpa**.
3. **Terapkan → Kelola deployment → ✏️ Edit → Versi: *Versi baru* → Terapkan.**
   ⚠️ Jangan pilih "Deployment baru", karena URL /exec akan berubah.

## Langkah 2 — Frontend (GitHub → Vercel)

ZIP update ini **tidak berisi `js/config.js`**, jadi URL /exec yang sudah Anda isi tetap aman.

Buka PowerShell di folder proyek lokal Anda (folder berisi `index.html`), lalu jalankan:

```bash
git pull
```

1. Ekstrak `teachtrack-frontend-v1.2-update.zip` **ke folder yang sama**. Pilih **Timpa/Replace** untuk semua file.
2. Jalankan:
```bash
git add .
git commit -m "Update TeachTrack v1.2: laporan bukti kinerja & dokumentasi"
git push
```
3. Vercel otomatis deploy ulang (±30 detik). Buka aplikasi lalu tekan **Ctrl+Shift+R**.

> Gunakan terminal (bukan "Upload files" di situs GitHub) agar struktur folder `css/` dan `js/` tetap utuh.

## Langkah 3 — Pemakaian

**Guru:** Beranda → Menu Cepat → **Jurnal** → tekan banner **"Isi Bukti Kinerja Manual"** → **Buat laporan baru** → isi identitas dan bulan → **Tambah** kegiatan (beserta foto) → **Unduh PDF**.

**Admin:** tidak ada pengaturan tambahan. Kop dan penandatangan diambil dari **Pengaturan → Kop & Penandatangan** (sudah ada sejak v1.1). PDF bukti memakai **Penandatangan 3** untuk blok *Mengetahui*.

---

## Catatan penting

- **TKB dan ALAMIN diisi terpisah.** Pada foto referensi tertulis `TKB : ALAMIN`. Di aplikasi, TKB dan ALAMIN adalah dua isian. Baris ALAMIN di PDF hanya tampil bila diisi. Jika di dokumen resmi Anda cukup satu baris `TKB : ALAMIN`, isi kolom TKB dengan `ALAMIN` dan kosongkan kolom ALAMIN.
- **Laporan bersifat pribadi.** Guru hanya melihat laporannya sendiri. Admin dapat membuka laporan guru melalui sistem, tetapi belum ada menu admin khusus untuk fitur ini. Menu tersebut dapat ditambahkan bila diperlukan.
- **Foto disimpan di Google Drive** pada folder `Laporan PDF → Bukti Kinerja`. Menghapus kegiatan atau laporan memindahkan fotonya ke Sampah Drive.
- **Simpan.** Tidak ada draf terpisah. Setiap penyimpanan langsung tercatat, dan kegiatan tidak bisa berada di luar rentang bulan laporan.

## Hasil pengujian v1.2

Diuji di simulator Apps Script dan browser Chromium (HP 390×844 dan desktop 1280×860):

- Uji backend lama: **69/69** lulus.
- Uji upgrade v1.1: **36/36** lulus.
- Uji backend fitur baru (laporan, kegiatan, foto, akses, batas 60 kegiatan, rentang bulan, PDF, sampah Drive, keamanan teks): **63/63** lulus.
- Uji browser regresi (alur guru dan admin yang sudah ada): **46/46** lulus.
- Uji browser fitur baru (buat, tambah, ubah, hapus foto, validasi tanggal, unduh PDF, hapus laporan): **22/22** lulus, tanpa error JavaScript dan tanpa gulir horizontal.
- PDF dirender dan dibandingkan dengan foto referensi (judul, identitas, baris Bulan, tabel empat kolom dengan foto, tanda tangan).

Pengujian dilakukan pada simulator, bukan pada Google Apps Script langsung. Setelah deploy, periksa sekali di aplikasi asli: buat satu laporan, unggah satu foto, lalu unduh PDF.

---

**site by Restu Putra Mulyana**
