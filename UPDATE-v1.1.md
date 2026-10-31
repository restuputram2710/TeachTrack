# 🔄 Panduan Update TeachTrack v1.0 → v1.1

**Isi update:**
1. **Jurnal Mengajar** — "Laporan Bukti Kinerja dan Dokumentasi Guru Pamong". Satu baris per akhir pekan **Sabtu–Minggu** (contoh: *Minggu Pertama, 3-4 Januari 2026*). Isinya disusun otomatis dari absensi di TKB: mata pelajaran, guru kunjung yang hadir, dan foto dokumentasi. Ada kolom catatan opsional, misalnya kehadiran murid. Hasilnya diunduh sebagai PDF siap cetak.
2. **PDF Honorarium format SMATER** — kop yayasan, kolom *Jumlah Kehadiran per TKB*, *Total Jumlah Kehadiran*, *Jumlah Honorium*, kolom tanda tangan, "Telah Lunas dibayarkan…", serta tanda tangan Pengelola, Bendahara, dan Kepala Sekolah ("Disetujui Oleh").
3. **Tanggal jurnal ditulis Sabtu–Minggu**, walaupun jadwal mengajar hanya hari Minggu. Absen pada hari Sabtu juga ikut masuk ke pekan yang sama.
4. **PDF Jadwal Pelajaran per TKB** — format *Minggu Ke I–IV · Jam Ke · Waktu · Kelas X/XI/XII (berisi kode guru) · Mata Pelajaran · Kode Guru · Nama Guru*, lengkap dengan kop dan tanda tangan.
5. **Tanda pembuat** "© 2026 TeachTrack, site by Restu Putra Mulyana" tampil di bawah halaman masuk dan semua halaman.

Tambahan penting: jadwal kini punya isian opsional **"Minggu ke"** (I–V) untuk jadwal bergilir SMATER. Tanpa isian ini, guru yang mengajar hanya di Minggu ke-II akan dihitung **alpa** di Minggu ke-I, III, dan IV. Kalau dikosongkan, jadwal berlaku **setiap minggu** seperti sebelumnya.

Fitur lain **tidak diubah**. Data lama, akun, sandi, dan URL `/exec` tetap sama.

---

## Langkah 1 — Backend (Apps Script)
1. Buka proyek Apps Script → `Kode.gs` → pilih semua (Ctrl+A) → hapus → **tempel `Kode.gs` versi baru** → **Simpan**.
2. Pilih fungsi **`setupAppEnvironment`** → ▶ **Jalankan** sekali. Langkah ini hanya menambah sheet `Jurnal` dan kolom `minggu_ke` di sheet Jadwal. Data, rahasia, dan admin **tidak ditimpa**.
3. **Terapkan → Kelola deployment → ✏️ Edit → Versi: *Versi baru* → Terapkan.**
   ⚠️ Jangan pilih "Deployment baru", karena URL /exec akan berubah.

## Langkah 2 — Frontend (GitHub → Vercel)
ZIP update ini **tidak berisi `js/config.js`**, jadi URL /exec yang sudah Anda isi tetap aman.

Buka PowerShell di folder proyek lokal Anda (folder berisi `index.html`), lalu jalankan:

```bash
git pull
```
Perintah ini mengambil perubahan `config.js` yang Anda edit lewat situs GitHub. Setelah itu:

1. Ekstrak `teachtrack-frontend-v1.1-update.zip` **ke folder yang sama**. Pilih **Timpa/Replace** untuk semua file.
2. Jalankan:
```bash
git add .
git commit -m "Update TeachTrack v1.1: jurnal, honor SMATER, jadwal TKB"
git push
```
3. Vercel otomatis deploy ulang (±30 detik). Buka aplikasi lalu tekan **Ctrl+Shift+R**.

> Gunakan terminal (bukan "Upload files" di situs GitHub) agar struktur folder `css/` dan `js/` tetap utuh.

## Langkah 3 — Pengaturan (sekali saja, oleh admin)
1. **Pengaturan → Kop & Penandatangan**: unggah **logo kop**, lalu isi baris kop, akreditasi, alamat, email, kota, dan **3 penandatangan**:
   1 = Kepala Sekolah, 2 = Bendahara, 3 = Pengelola SMA Terbuka. Tekan **Simpan**.
2. **Jadwal Mengajar**: buka tiap jadwal, isi **Kelas** dengan `X`, `XI`, atau `XII` (boleh beberapa, dipisah koma), lalu centang **Minggu ke** yang sesuai (I/II/III/IV).
3. Uji coba:
   - **Laporan → Cetak Honorarium (PDF)**;
   - **Jadwal Mengajar → Cetak Jadwal TKB**;
   - **Laporan → Jurnal Guru (PDF)**.

## Cara guru membuat jurnal
**Beranda → Menu Cepat → Jurnal** → pilih TKB dan bulan → (opsional) tulis catatan kehadiran murid per pekan → **Simpan catatan** → **Unduh Jurnal (PDF)**.
Guru juga bisa mengunduh jadwal TKB-nya di **Jadwal → Unduh Jadwal Pelajaran TKB (PDF)**.
*(Tombol "Profil" di Menu Cepat diganti "Jurnal". Profil tetap ada di navigasi bawah.)*

## Hasil pengujian v1.1
Diuji di simulator Apps Script dan browser Chromium:
- 69/69 uji lama tetap lulus;
- 36/36 uji fitur baru lulus, di antaranya:
  - label Sabtu–Minggu, termasuk lintas bulan "31 Januari - 1 Februari 2026";
  - jadwal "minggu ke" tidak memicu alpa palsu;
  - kode guru di jadwal TKB;
  - honor per TKB;
  - hak akses: guru hanya bisa membuka jurnal/jadwal miliknya;
- 46/46 uji tampilan lulus tanpa error JavaScript.
