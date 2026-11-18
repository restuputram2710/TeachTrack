# 🔄 Panduan Update TeachTrack v1.1 → v1.2

**Isi update:**
- **Laporan Bukti Kinerja & Dokumentasi Guru Pamong** (fitur baru, isi manual per pekan).
- **Halaman Jadwal Mengajar**: strip "Pilih Hari Mengajar" kini hanya menampilkan **Sabtu dan Minggu**, sesuai jadwal TKB yang berlangsung dua hari dalam sepekan. Panah ‹ › berpindah pekan.

Fitur bukti melengkapi Jurnal Mengajar yang sudah ada. Jurnal otomatis dan fitur lain **tidak diubah**. Data lama, akun, sandi, dan URL `/exec` tetap sama.

1. **Identitas laporan**: nama guru pamong, TKB, ALAMIN (opsional), SMA Induk / SMATER, dan **bulan awal s.d. bulan akhir** (maksimal 12 bulan).
2. **Pekan otomatis.** Setiap **Sabtu dan Minggu** dalam bulan yang dipilih langsung tampil sebagai satu pekan, lengkap dengan tanggalnya (misalnya *Minggu Pertama, 3-4 Oktober 2026*). Guru **tidak perlu mengetik tanggal**.
3. **Isi tiap pekan**: uraian kegiatan pembelajaran, mata pelajaran yang diajarkan (satu per baris), guru kunjung yang hadir (satu nama per baris), keterangan kehadiran siswa, dan **satu foto dokumentasi** (dikompres otomatis dari HP atau komputer).
4. **Ubah** isi pekan, **hapus foto**, atau **kosongkan** pekan (baris pekannya tetap ada). **Ubah identitas** dan **hapus laporan** juga tersedia. Setiap tombol *Simpan* langsung menyimpan ke server.
5. **Unduh PDF** dengan format dokumen referensi: judul, blok identitas, baris *Bulan*, tabel **No | Hari/Tanggal | Uraian | Foto Dokumentasi** (satu baris per pekan), dan blok tanda tangan (Mengetahui: Penandatangan 3; Guru Pamong).

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
git commit -m "Update TeachTrack v1.2: laporan bukti kinerja per pekan"
git push
```
3. Vercel otomatis deploy ulang (±30 detik). Buka aplikasi lalu tekan **Ctrl+Shift+R**.

> Gunakan terminal (bukan "Upload files" di situs GitHub) agar struktur folder `css/` dan `js/` tetap utuh.

## Langkah 3 — Pemakaian

**Guru, jadwal:** menu **Jadwal** → strip *Pilih Hari Mengajar* menampilkan Sabtu dan Minggu pekan ini. Panah ‹ › untuk pekan sebelum atau sesudahnya. Tekan hari untuk melihat sesinya. Hari kerja Senin–Jumat tidak lagi tampil di strip ini. Sesi yang sudah tersimpan pada hari kerja tetap ada di data, hanya tidak ditampilkan di strip.

**Guru, bukti kinerja:** Beranda → Menu Cepat → **Jurnal** → tekan banner **"Isi Bukti Kinerja Manual"** → **Buat laporan baru** → isi identitas dan bulan → pilih pekan → **Isi** (uraian, mapel, guru kunjung, kehadiran, foto) → **Simpan pekan** → **Unduh PDF**.

**Admin:** tidak ada pengaturan tambahan. Kop dan penandatangan diambil dari **Pengaturan → Kop & Penandatangan** (sudah ada sejak v1.1). PDF bukti memakai **Penandatangan 3** untuk blok *Mengetahui*.

---

## Catatan penting

- **TKB dan ALAMIN diisi terpisah.** Pada foto referensi tertulis `TKB : ALAMIN`. Di aplikasi, TKB dan ALAMIN adalah dua isian. Baris ALAMIN di PDF hanya tampil bila diisi. Jika di dokumen resmi Anda cukup satu baris `TKB : ALAMIN`, isi kolom TKB dengan `ALAMIN` dan kosongkan kolom ALAMIN.
- **Pekan dihitung dari hari Minggu**, sama seperti jurnal otomatis. Sabtu 31 Januari dan Minggu 1 Februari masuk ke pekan bulan Februari.
- **Pekan yang belum diisi tetap tercetak** di PDF sebagai baris kosong, sesuai jumlah pekan dalam bulan laporan.
- **Laporan bersifat pribadi.** Guru hanya melihat laporannya sendiri. Admin dapat membuka laporan guru melalui sistem, tetapi belum ada menu admin khusus untuk fitur ini.
- **Foto disimpan di Google Drive** pada folder `Laporan PDF → Bukti Kinerja`. Mengosongkan atau menghapus laporan memindahkan fotonya ke Sampah Drive.
- **Simpan.** Tidak ada draf terpisah. Setiap penyimpanan langsung tercatat. Bulan laporan tidak bisa dipersempit bila ada pekan yang sudah diisi di luar rentang baru; kosongkan pekan tersebut dulu.

## Hasil pengujian v1.2

Diuji di simulator Apps Script dan browser Chromium (HP 390×844 dan desktop 1280×860):

- Uji backend lama: **69/69** lulus.
- Uji upgrade v1.1: **36/36** lulus.
- Uji backend fitur baru (pekan otomatis Sabtu–Minggu, isi & foto per pekan, akses, batas 12 bulan, PDF, sampah Drive, keamanan teks): **75/75** lulus.
- Uji browser regresi (alur guru dan admin yang sudah ada): **46/46** lulus.
- Uji browser fitur bukti (buat laporan, 9 pekan otomatis, isi, ubah, hapus foto, kosongkan pekan, validasi, unduh PDF, hapus laporan): **30/30** lulus, tanpa error JavaScript dan tanpa gulir horizontal.
- Uji browser jadwal (strip hanya Sabtu & Minggu, panah pindah pekan, pilihan hari, tanpa gulir horizontal di HP): **11/11** lulus.
- PDF dirender dan dibandingkan dengan foto referensi (judul, identitas, baris Bulan, tabel per pekan dengan foto, tanda tangan).

Pengujian dilakukan pada simulator, bukan pada Google Apps Script langsung. Setelah deploy, periksa sekali di aplikasi asli: buat satu laporan, isi satu pekan dengan foto, lalu unduh PDF.

---

**site by Restu Putra Mulyana**
