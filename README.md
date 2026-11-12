# Web Dinas Kebudayaan dan Pariwisata Kalimantan Selatan — Base v0.2 (demo)

## Cara pakai
1. Ekstrak zip, buka `index.html` di browser (atau upload ke GitHub Pages / hosting).
2. Panel admin: buka `admin.html`  ->  login demo: **admin / admin123**
3. Perubahan di admin langsung tampil di situs publik (sama-sama di browser yang sama).

## Isi v0.2
- Publik: Beranda, Destinasi (+keterangan), Direktori (Penginapan, Kuliner, Travel Agen, Pokdarwis), Ekraf, Inovasi/Program Kerja (+detail), Berita, Agenda, Data Kunjungan (grafik + tabel), Tentang.
- Admin: kelola semua menu di atas + Data Kunjungan bulanan + Pengaturan Situs (kontak footer).

## Struktur
- index / destinasi / detail / berita / artikel / agenda / tentang .html  -> halaman publik
- admin.html + assets/admin.js                                        -> panel admin
- assets/data.js    -> LAPISAN DATA (DB.*). Saat ini localStorage. Tahap 2: ganti isinya ke API PHP + MySQL.
- assets/site.js    -> render halaman publik + utilitas
- assets/style.css, assets/scenes.js (ilustrasi placeholder)

## Catatan
- Data demo tersimpan di browser (batas +-5 MB). Foto otomatis diperkecil.
- Semua konten (destinasi, berita, agenda) adalah CONTOH. Login demo hanya untuk demo.
- Login saat ini BUKAN keamanan sungguhan; di tahap 2 diganti login server (PHP session + password hash).
- Dibangun oleh @ur.chillguy
