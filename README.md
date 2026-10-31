# TeachTrack — Absensi Guru Pamong SMA Terbuka

Frontend statis (HTML/CSS/JS murni) untuk aplikasi presensi guru pamong berbasis **QR + GPS + foto**.
Backend: Google Apps Script (REST API JSON) + Google Sheets + Google Drive.

- Satu-satunya yang perlu diisi: `js/config.js` → `GAS_URL` (URL /exec Web App).
- Deploy: GitHub Pages (Settings → Pages → main / root, Enforce HTTPS).
- Panduan lengkap: `PANDUAN-INSTALASI.md`.

Struktur:
```
index.html
css/style.css
js/config.js   ← isi GAS_URL
js/icons.js · core.js · charts.js · app.js · guru.js · scan.js · admin.js · admin2.js
```
