/* ==========================================================================
   TeachTrack — bukti.js  (v1.2)
   Laporan Bukti Kinerja & Dokumentasi Guru Pamong — isi manual per pekan.
   Setiap Sabtu & Minggu dalam bulan terpilih otomatis menjadi satu pekan.
   Guru cukup mengisi uraian, mapel, guru kunjung, kehadiran, dan foto per pekan.
   Berdiri sendiri: tidak mengubah layar Jurnal Otomatis.
   ========================================================================== */
(function () {
  'use strict';
  const T = TT, esc = T.esc, $ = T.$, App = window.App;
  const MAKS_FOTO_PX = 1280;
  const GIF_KOSONG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  /** Tombol kecil di halaman Jurnal yang membuka laporan manual. */
  App.bannerBukti = function () {
    return '<a class="card card-pad" href="#/bukti" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;text-decoration:none;color:inherit">' +
      '<span class="itile itile-sm t-violet">' + ic('camera', 18) + '</span>' +
      '<div style="flex:1;min-width:0"><b>Isi Bukti Kinerja Manual</b><div class="small muted">Laporan per bulan, satu baris per pekan Sabtu–Minggu, dengan foto</div></div>' +
      ic('chevronRight', 18) + '</a>';
  };

  // ------------------------------------------------------------------------
  //  Pembantu
  // ------------------------------------------------------------------------
  function bulanIni() { return T.nowWib().tgl.slice(0, 7); }
  function rentangBulan(d) { return d.bulan_dari === d.bulan_sampai ? T.bulanLabel(d.bulan_dari) : T.bulanLabel(d.bulan_dari) + ' – ' + T.bulanLabel(d.bulan_sampai); }
  function baris(s) { return String(s || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function nilai(root, sel) { const el = $(sel, root); return el ? el.value : ''; }

  // ------------------------------------------------------------------------
  //  Halaman
  // ------------------------------------------------------------------------
  App.reg('bukti', { shell: 'guru', guru: true, nav: '', title: 'Bukti Kinerja', sub: 'Laporan & dokumentasi pekan', back: 'jurnal', render: function (el) {
    el.innerHTML = '<div id="bkBox"></div>';
    const box = $('#bkBox', el);
    let daftarData = null;     // { laporan, default, tkbList, maks }
    let aktifId = null;        // laporan yang sedang dibuka (null = daftar)
    let detail = null;         // { laporan, pekan, maks }

    const skel = '<div class="skel" style="height:180px"></div>';
    const galat = function (msg) {
      return '<div class="card card-pad"><div class="empty"><div class="itile">' + ic('alert', 24) + '</div><b>Belum dapat dimuat</b>' + esc(msg) + '</div></div>';
    };

    // ---------- DAFTAR LAPORAN ----------
    async function tampilDaftar() {
      aktifId = null; detail = null;
      box.innerHTML = skel;
      const r = await T.api('bukti.daftar', {});
      if (!el.isConnected) return;
      if (!r.success) { box.innerHTML = galat(r.message); return; }
      daftarData = r.data;
      const L = daftarData.laporan;
      box.innerHTML = '<div class="card card-pad"><div class="row" style="gap:12px;align-items:flex-start"><span class="itile">' + ic('camera', 22) + '</span><div>' +
        '<h3 style="font-size:16.5px">Bukti Kinerja &amp; Dokumentasi</h3>' +
        '<p class="small muted mt-4">Pilih bulan, lalu isi tiap pekan Sabtu–Minggu. Tanggalnya diambil otomatis. PDF disusun mengikuti format dokumen resmi.</p></div></div>' +
        '<button class="btn btn-primary btn-block mt-16" id="bkBaru">' + ic('plus', 18) + ' Buat laporan baru</button></div>' +
        '<div class="sec-title"><h3>Laporan saya</h3><span class="chip chip-p chip-sm">' + L.length + ' laporan</span></div>' +
        (L.length ? '<div class="col gap-12">' + L.map(function (l) {
          return '<div class="card card-pad jr-card" data-buka="' + esc(l.id) + '" style="cursor:pointer">' +
            '<div class="row-b"><div style="min-width:0"><span class="mono xs muted">' + esc(l.id) + '</span><h4 style="margin:2px 0">' + esc(l.nama_guru) + '</h4>' +
            '<div class="small" style="color:var(--p);font-weight:600">' + esc(rentangBulan(l)) + '</div>' +
            '<div class="small muted">TKB ' + esc(l.tkb) + (l.alamin ? ' · ALAMIN ' + esc(l.alamin) : '') + '</div></div>' +
            '<span class="chip chip-slate chip-sm">' + l.pekan_terisi + ' / ' + l.pekan_total + ' pekan</span></div></div>';
        }).join('') + '</div>' : '<div class="card card-pad"><div class="empty"><div class="itile">' + ic('camera', 24) + '</div><b>Belum ada laporan</b>Tekan “Buat laporan baru” untuk memulai.</div></div>');
    }

    // ---------- DETAIL LAPORAN ----------
    async function tampilDetail(id) {
      aktifId = id;
      box.innerHTML = skel;
      const r = await T.api('bukti.ambil', { id_laporan: id });
      if (!el.isConnected || aktifId !== id) return;
      if (!r.success) { box.innerHTML = galat(r.message) + '<button class="btn btn-tonal btn-block mt-12" id="bkKembali">' + ic('arrowLeft', 18) + ' Kembali ke daftar</button>'; return; }
      detail = r.data;
      const L = detail.laporan, P = detail.pekan;
      box.innerHTML = '<button class="btn btn-tonal btn-xs" id="bkKembali">' + ic('arrowLeft', 14) + ' Daftar laporan</button>' +
        '<div class="card card-pad mt-12"><div class="row-b" style="align-items:flex-start;gap:12px">' +
        '<div style="min-width:0"><span class="eyebrow">Identitas laporan</span><h3 style="font-size:16px;margin:4px 0">' + esc(L.nama_guru) + '</h3>' +
        '<div class="small muted">TKB : ' + esc(L.tkb) + (L.alamin ? ' · ALAMIN : ' + esc(L.alamin) : '') + '</div>' +
        '<div class="small muted">SMA Induk SMATER : ' + esc(L.smater || '-') + '</div>' +
        '<div class="small" style="color:var(--p);font-weight:600">Bulan : ' + esc(rentangBulan(L)) + '</div></div>' +
        '<button class="icon-btn" id="bkUbah" aria-label="Ubah identitas">' + ic('edit', 18) + '</button></div></div>' +
        '<button class="btn btn-primary btn-block mt-12" id="bkPdf">' + ic('download', 18) + ' Unduh PDF</button>' +
        '<div class="row-b mt-20"><span class="eyebrow">Pekan Sabtu–Minggu</span><span class="chip chip-p chip-sm">' + L.pekan_terisi + ' / ' + L.pekan_total + ' terisi</span></div>' +
        '<p class="xs muted mt-4">Setiap Sabtu dan Minggu dalam bulan laporan tampil otomatis. Cukup isi pekan yang sudah dikerjakan.</p>' +
        '<div class="col gap-12 mt-8">' + P.map(kartuPekan).join('') + '</div>' +
        '<div class="center mt-20"><button class="btn btn-outline btn-sm" id="bkHapusLap">' + ic('trash', 16) + ' Hapus laporan ini</button></div>';
      P.filter(function (p) { return p.ada_foto; }).forEach(muatFoto);
    }

    function kartuPekan(p, i) {
      const terisi = p.terisi;
      const isi = !terisi ? '<div class="small muted mt-12">Belum diisi. Tekan “Isi” untuk menambahkan uraian dan foto.</div>' :
        '<div class="small mt-12" style="white-space:pre-wrap">' + esc(p.kegiatan) + '</div>' +
        (p.mapel.length ? '<div class="row mt-8" style="flex-wrap:wrap;gap:6px">' + p.mapel.map(function (m) { return '<span class="chip chip-slate chip-sm">' + esc(m) + '</span>'; }).join('') + '</div>' : '') +
        (p.guru_kunjung.length ? '<div class="small muted mt-8"><b>Guru kunjung yang hadir :</b> ' + p.guru_kunjung.map(esc).join(', ') + '</div>' : '') +
        (p.kehadiran_siswa ? '<div class="small muted mt-4"><b>Kehadiran siswa :</b> ' + esc(p.kehadiran_siswa) + '</div>' : '');
      const foto = p.ada_foto ? '<img class="bk-thumb mt-12" id="bkf-' + esc(p.id) + '" alt="Foto dokumentasi" src="' + GIF_KOSONG + '">' : '';
      return '<div class="card card-pad jr-card">' +
        '<div class="row-b" style="align-items:flex-start;gap:10px"><div style="min-width:0"><span class="mono xs muted">Pekan ' + (i + 1) + '</span>' +
        '<h4 style="margin:2px 0">Minggu ' + esc(p.ke) + '</h4>' +
        '<div class="small" style="color:var(--p);font-weight:600">' + esc(p.label) + '</div></div>' +
        '<div class="col" style="align-items:flex-end;gap:6px;flex:none">' +
        '<span class="chip ' + (terisi ? 'chip-ok' : 'chip-slate') + ' chip-sm">' + (terisi ? 'Terisi' : 'Belum diisi') + '</span>' +
        '<div class="row" style="gap:4px"><button class="btn btn-tonal btn-xs" data-edit="' + esc(p.key) + '">' + (terisi ? 'Ubah' : 'Isi') + '</button>' +
        (terisi ? '<button class="icon-btn" data-kosongkan="' + esc(p.id) + '" aria-label="Kosongkan pekan">' + ic('trash', 17) + '</button>' : '') + '</div></div></div>' +
        foto + isi + '</div>';
    }

    async function muatFoto(p) {
      const r = await T.api('bukti.fotoLihat', { id_kegiatan: p.id });
      const img = $('#bkf-' + p.id, box);
      if (!img || !r.success || !r.data.dataUrl) { if (img) img.outerHTML = '<div class="small muted mt-12">' + ic('camera', 14) + ' Foto tidak dapat dimuat</div>'; return; }
      img.src = r.data.dataUrl;
    }

    // ---------- FORMULIR IDENTITAS ----------
    function formLaporan(L) {
      const d = daftarData.default, tkbs = daftarData.tkbList || [];
      const v = L || { nama_guru: d.nama_guru, tkb: tkbs[0] ? tkbs[0].nama : '', alamin: '', smater: d.smater, bulan_dari: bulanIni(), bulan_sampai: bulanIni() };
      const body = '<div class="field"><label class="label" for="bkNama">Nama guru pamong</label><input class="input" id="bkNama" value="' + esc(v.nama_guru) + '" maxlength="120" autocomplete="off"></div>' +
        '<div class="grid2 mt-12"><div class="field"><label class="label" for="bkTkb">TKB</label><input class="input" id="bkTkb" list="bkTkbList" value="' + esc(v.tkb) + '" maxlength="120" autocomplete="off">' +
        '<datalist id="bkTkbList">' + tkbs.map(function (t) { return '<option value="' + esc(t.nama) + '">'; }).join('') + '</datalist></div>' +
        '<div class="field"><label class="label" for="bkAlamin">ALAMIN <span class="muted" style="font-weight:400">(opsional)</span></label><input class="input" id="bkAlamin" value="' + esc(v.alamin || '') + '" maxlength="120" autocomplete="off"></div></div>' +
        '<div class="field mt-12"><label class="label" for="bkSmater">SMA Induk / SMATER</label><input class="input" id="bkSmater" value="' + esc(v.smater || '') + '" maxlength="160" autocomplete="off"></div>' +
        '<div class="grid2 mt-12"><div class="field"><label class="label" for="bkDari">Bulan awal</label><input class="input input-sm" type="month" id="bkDari" value="' + esc(v.bulan_dari) + '"></div>' +
        '<div class="field"><label class="label" for="bkSampai">Bulan akhir</label><input class="input input-sm" type="month" id="bkSampai" value="' + esc(v.bulan_sampai) + '"></div></div>' +
        '<p class="xs muted mt-8">Bisa mencakup beberapa bulan (maks. ' + daftarData.maks.bulan + ' bulan). Setiap Sabtu dan Minggu dalam rentang ini otomatis menjadi satu pekan.</p>';
      T.modal({ title: L ? 'Ubah identitas laporan' : 'Laporan baru', sub: 'Identitas ini tampil di kop dokumen PDF', body: body, wide: true,
        actions: [{ label: 'Batal' }, { label: ic('check', 17) + ' Simpan', cls: 'btn-primary', onClick: function (close, root, b) { simpanLaporan(root, b, close, L); return false; } }] });
    }

    async function simpanLaporan(root, btn, close, L) {
      const data = { id_laporan: L ? L.id : '', nama_guru: nilai(root, '#bkNama').trim(), tkb: nilai(root, '#bkTkb').trim(),
        alamin: nilai(root, '#bkAlamin').trim(), smater: nilai(root, '#bkSmater').trim(), bulan_dari: nilai(root, '#bkDari'), bulan_sampai: nilai(root, '#bkSampai') };
      if (!data.nama_guru) return T.toast('Isi nama guru pamong.', 'warn');
      if (!data.tkb) return T.toast('Isi TKB.', 'warn');
      if (!data.bulan_dari || !data.bulan_sampai) return T.toast('Pilih bulan awal dan bulan akhir.', 'warn');
      const r = await T.withBtn(btn, function () { return T.api('bukti.simpan', data); });
      if (!r.success) return T.toast(r.message, 'err', 6000);
      T.toast(r.message, 'ok'); close();
      tampilDetail(L ? L.id : r.data.id);
    }

    // ---------- FORMULIR PEKAN ----------
    function formPekan(p) {
      const L = detail.laporan;
      const body = '<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><span class="chip chip-p">Minggu ' + esc(p.ke) + '</span><b>' + esc(p.label) + '</b></div>' +
        '<p class="xs muted mt-4">Tanggal Sabtu dan Minggu diambil otomatis dari bulan laporan.</p>' +
        '<div class="field mt-12"><label class="label" for="bkUraian">Uraian kegiatan pembelajaran</label><textarea class="textarea" id="bkUraian" maxlength="1500" rows="3" placeholder="Contoh: Pendampingan pembelajaran tatap muka di kelas XI">' + esc(p.kegiatan) + '</textarea></div>' +
        '<div class="grid2 mt-12"><div class="field"><label class="label" for="bkMapel">Mata pelajaran yang diajarkan</label><textarea class="textarea" id="bkMapel" rows="3" placeholder="Satu mata pelajaran per baris">' + esc(p.mapel.join('\n')) + '</textarea></div>' +
        '<div class="field"><label class="label" for="bkGuru">Guru kunjung yang hadir</label><textarea class="textarea" id="bkGuru" rows="3" placeholder="Satu nama per baris">' + esc(p.guru_kunjung.join('\n')) + '</textarea></div></div>' +
        '<div class="field mt-12"><label class="label" for="bkHadir">Keterangan kehadiran siswa</label><textarea class="textarea" id="bkHadir" rows="2" maxlength="600" placeholder="Contoh: Hadir 28 dari 30 siswa">' + esc(p.kehadiran_siswa) + '</textarea></div>' +
        '<div class="field mt-12"><label class="label" for="bkFile">Foto dokumentasi</label>' +
        '<input class="input" type="file" id="bkFile" accept="image/*">' +
        '<div id="bkPrevBox" class="mt-8">' + (p.ada_foto ? '<div class="small muted">Foto tersimpan. Pilih berkas baru untuk menggantinya.</div><img class="bk-thumb mt-8" id="bkPrev" alt="Foto tersimpan">' : '') + '</div>' +
        (p.ada_foto ? '<label class="row mt-8" style="gap:8px;font-size:13.5px"><input type="checkbox" id="bkHapusFoto"> Hapus foto ini</label>' : '') + '</div>';
      T.modal({ title: p.terisi ? 'Ubah pekan' : 'Isi pekan', sub: esc(L.nama_guru), body: body, wide: true,
        actions: [{ label: 'Batal' }, { label: ic('check', 17) + ' Simpan pekan', cls: 'btn-primary', onClick: function (close, root, b) { simpanPekan(root, b, close, p); return false; } }] });
      if (p.ada_foto) {
        T.api('bukti.fotoLihat', { id_kegiatan: p.id }).then(function (r) { const img = $('#bkPrev'); if (img && r.success && r.data.dataUrl) img.src = r.data.dataUrl; });
      }
      const pilih = $('#bkFile');
      if (pilih) pilih.onchange = function () {
        const f = pilih.files && pilih.files[0]; const box2 = $('#bkPrevBox');
        if (!f || !box2) return;
        if (!/^image\//.test(f.type)) { T.toast('Pilih berkas gambar (JPG, PNG, atau WebP).', 'warn'); pilih.value = ''; return; }
        T.fileToDataUrl(f).then(function (u) { box2.innerHTML = '<div class="small muted">Foto baru dipilih.</div><img class="bk-thumb mt-8" src="' + u + '" alt="Pratinjau foto">'; });
      };
    }

    async function simpanPekan(root, btn, close, p) {
      const L = detail.laporan;
      const uraian = nilai(root, '#bkUraian').trim();
      if (!uraian) return T.toast('Uraian kegiatan wajib diisi.', 'warn');
      const file = $('#bkFile', root) && $('#bkFile', root).files[0];
      if (file && !/^image\//.test(file.type)) return T.toast('Pilih berkas gambar (JPG, PNG, atau WebP).', 'warn');
      const data = { id_laporan: L.id, sabtu: p.key,
        kegiatan: uraian, mapel: baris(nilai(root, '#bkMapel')).join('\n'), guru_kunjung: baris(nilai(root, '#bkGuru')).join('\n'),
        kehadiran_siswa: nilai(root, '#bkHadir').trim(), hapus_foto: !!($('#bkHapusFoto', root) && $('#bkHapusFoto', root).checked) };
      const r = await T.withBtn(btn, async function () {
        if (file) data.foto = await T.compressImage(await T.fileToDataUrl(file), MAKS_FOTO_PX, .72);
        return T.api('bukti.kegiatanSimpan', data);
      });
      if (!r.success) return T.toast(r.message, 'err', 6000);
      T.toast(r.message, 'ok'); close();
      tampilDetail(L.id);
    }

    // ---------- AKSI ----------
    T.on(box, 'click', '[data-buka]', function (e, t) { tampilDetail(t.getAttribute('data-buka')); });
    T.on(box, 'click', '[data-edit]', function (e, t) {
      const key = t.getAttribute('data-edit');
      const p = detail.pekan.filter(function (x) { return x.key === key; })[0];
      if (p) formPekan(p);
    });
    T.on(box, 'click', '[data-kosongkan]', async function (e, t) {
      const id = t.getAttribute('data-kosongkan');
      const yes = await T.confirm({ title: 'Kosongkan pekan ini?', body: 'Uraian, mapel, guru kunjung, keterangan, dan foto pekan ini akan dihapus. Baris pekannya tetap ada.', ok: 'Ya, kosongkan', danger: true });
      if (!yes) return;
      const r = await T.api('bukti.kegiatanHapus', { id_kegiatan: id });
      if (!r.success) return T.toast(r.message, 'err');
      T.toast(r.message, 'ok'); tampilDetail(detail.laporan.id);
    });
    box.addEventListener('click', async function (e) {
      const t = e.target.closest('#bkBaru, #bkKembali, #bkUbah, #bkPdf, #bkHapusLap');
      if (!t || !box.contains(t)) return;
      if (t.id === 'bkBaru') return formLaporan(null);
      if (t.id === 'bkKembali') return tampilDaftar();
      if (t.id === 'bkUbah') return formLaporan(detail.laporan);
      if (t.id === 'bkPdf') return App.unduhPdf('bukti.pdf', { id_laporan: detail.laporan.id }, t);
      if (t.id === 'bkHapusLap') {
        const L = detail.laporan;
        const yes = await T.confirm({ title: 'Hapus laporan ini?', body: 'Seluruh isi pekan dan foto dokumentasi di dalam laporan <b>' + esc(rentangBulan(L)) + '</b> akan dihapus. Tindakan ini tidak dapat dibatalkan.', ok: 'Ya, hapus laporan', danger: true });
        if (!yes) return;
        const r = await T.withBtn(t, function () { return T.api('bukti.hapus', { id_laporan: L.id }); });
        if (!r.success) return T.toast(r.message, 'err');
        T.toast(r.message, 'ok'); tampilDaftar();
      }
    });

    // ---------- MULAI ----------
    tampilDaftar();
  } });
})();
