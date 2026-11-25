# Handoff · Kalkulator Studio Riones

Catatan serah terima buat siapa pun (orang atau bot) yang lanjutin project ini. Status per 25 Nov 2026, versi aset `?v=29`.

## 1. Tujuan project

- Site statis buat **Studio Riones**, brand hampers gue. Isinya barang cetak 3D (Bambu A1 mini) plus kue dari **dr cookies** (punya kakak/adik gue).
- Fungsinya ngitung **modal, harga jual, dan margin** tiap paket hampers.
- Repo: https://github.com/Rindut/studioriones
- Deploy: **Vercel**, gue sendiri yang deploy (bukan GitHub Pages).
- **Status: BELUM di-push ke GitHub.** Push cuma boleh setelah gue bilang OK habis ngecek di localhost.

## 2. Cara jalanin di lokal

```bash
cd studio-riones-kalkulator
python3 -m http.server 8000
```

- Landing page: http://localhost:8000
- Detail Paket Hutan: http://localhost:8000/hutan.html (`sore.html` otomatis redirect ke sini)
- CSS/JS dipanggil pakai `?v=N` (sekarang **`?v=29`**) biar cache browser nggak nyangkut. Tiap kali `style.css`, `app.js`, `landing.js`, atau `gate.js` diubah, naikin angkanya di `index.html` **dan** `hutan.html`.
- Ada gerbang kata sandi (`gate.js`, password **1616**, disimpan di `sessionStorage` key `studio-riones-gate`) di `index.html` dan `hutan.html`. Ini cek di browser doang, bukan proteksi server.
- Kalau tampilannya masih versi lama: hard refresh `Cmd+Shift+R` (Mac) atau `Ctrl+Shift+R` (Windows).
- Data isian disimpan di `localStorage` browser (key `studio-riones-kalkulator-v1`). Tombol **Reset ke default** ngapus data itu.

## 3. Struktur file

| File | Isi |
|---|---|
| `index.html` | Landing page: 3 kartu paket (Hutan aktif; Awan & Laut "Segera hadir"). Logo Studio Riones di header (tautan ke landing). Tiap kartu punya deskripsi desain, "Cocok untuk", dan tabel ringkasan full-width. Thumbnail dan foto final di tabel landing lebih besar (56px). Tidak ada foto besar / kotak "No images" di kartu. |
| `hutan.html` | Halaman detail/kalkulator Paket Hutan: Ringkasan → Isi paket → Harga satuan cetak → Harga satuan kue → Harga satuan kemasan → Asumsi hitungan. Logo di header (tautan ke landing). Di Ringkasan, persentase margin tampil di bawah angka Modal (kolom Margin dihapus). Toggle Isi paket: **No food di kiri, Food di kanan** (default aktif tetap Food). Popup pilih barang: maks 5 cetak berbeda, maks 1 kue. Asumsi hitungan isinya Target margin, Set per bulan, plus daftar read-only tenaga kerja default (Kecil/Sedang/Besar) dan catatan tarif ±Rp30.000/jam. Iuran/kurs lisensi tidak tampil di halaman (default di `app.js`). |
| `sore.html` | Redirect kecil ke `hutan.html` (nama lama, biar bookmark lama tetap jalan). |
| `app.js` | Semua data (barang, harga default, link, isi paket), rumus, localStorage, dan render halaman detail. Fungsi `fillSummaryTable` dipakai **dua halaman** (opsi `showModal` / `showMargin`). Angka yang tampil di kedua halaman tetap dari state yang sama, tapi tabel landing hanya menampilkan thumbnail, harga jual, dan waktu. |
| `landing.js` | Ngisi tabel ringkasan di landing pakai fungsi yang sama dari `app.js`. |
| `gate.js` | Layar kata sandi `1616` sebelum landing dan halaman detail. |
| `images/logo-studio-riones.png`, `images/favicon.png`, `images/apple-touch-icon.png` | Logo brand, favicon 64px, dan ikon Apple 180px. |
| `style.css` | Semua styling. Font: **Fraunces** (judul) + **Plus Jakarta Sans** (teks, tabel, angka), dari Google Fonts. |
| `images/` | Foto barang cetak asli (`tray`, `eggcup`, `phonestand`, `clip`, `tree`, `coaster`, `set`), foto kue dr cookies (`food-*.jpg`), dan foto kemasan (`pack-*.jpg`). |
| `README.md` | Panduan run lokal, deploy Vercel, troubleshooting cache. |
| `favicon.svg`, `.nojekyll` | Ikon dan sisa setting statis. |

ID internal kayak `#sore-summary`, `#card-sore` dan `window.KalkulatorSore` sengaja nggak diganti (nggak kelihatan user, dan aman buat data lama).

## 4. Rumus & model data

**Harga cetak per item** (otomatis, nggak bisa diisi manual):

```
harga = round( (gram × hargaFilamenPerKg / 1000  +  0,08 kW × menit/60 × Rp1.444,70) × 1,10 )
```

- Harga filamen per kg diisi di kanan atas card "Harga satuan cetak". Default **Rp238.000/kg** (PLA Matte Bambu Lab).
- Printer 80 W, tarif PLN Rp1.444,70/kWh, cadangan gagal cetak 10%.

**Lisensi** (baris centang "Lisensi" di bawah harga tiap tile cetak; dicentang = masuk modal):

| Item | Lisensi | Harga per set |
|---|---|---|
| Tray oval ribbed | Sabre (€19/bulan × kurs Rp18.421 ÷ 20 set) | Rp17.500 |
| Phone stand + Mini bag clip | yekta ($12/bulan × kurs Rp16.800 ÷ 20 set), **satu lisensi, dihitung sekali per paket** | Rp10.080 |
| Egg cup Linea | belum ada harga | TBD (Rp0) |
| Coaster ribbed myro | CC BY-NC, perlu izin | TBD (Rp0) |
| Pohon kerucut | CC0 | Rp0 (checkbox mati) |

"Set per bulan" (default 20) bisa diubah di card **Asumsi hitungan**. Iuran Sabre (€19/bulan), yekta ($12/bulan), dan kurs (EUR Rp18.421, USD Rp16.800) **tidak bisa diubah di halaman** — tetap dipakai di hitungan lisensi. Kalau iuran atau kurs berubah, ubah default-nya di `app.js` (`DEFAULT_SETTINGS`: `sabreEur`, `yektaUsd`, `eurIdr`, `usdIdr`). Nilai lama yang sudah tersimpan di localStorage tetap dipakai (kompatibel).

**Modal paket** = cetak + lisensi + kue + kemasan + tenaga kerja. Default tenaga kerja per paket (Food dan No food sama): **Kecil Rp10.000**, **Sedang Rp15.000**, **Besar Rp25.000**. Dasarnya ~Rp30.000/jam; kira-kira 20/30/50 menit buat rakit, finishing, dan wrapping (waktu printer jalan nggak dihitung, soalnya listriknya udah masuk modal cetak). Angkanya bisa diubah di kartu Isi paket masing-masing (bukan lagi di Asumsi hitungan). Field global lama `settings.labor` nggak dipakai lagi dan nggak dimigrasi otomatis — kalau lo pernah ubah tenaga kerja di Asumsi, isi ulang di kartu, atau klik **Reset ke default**.

**Harga jual** punya 2 mode per paket:
- **Harga manual** (default): harga tetap yang diisi.
- **Target margin**: dihitung dari modal pakai target margin (default **60%**), dibulatkan ke atas ke angka ...9.000.

Margin = (harga jual − modal) ÷ harga jual.

**Waktu cetak paket** (kolom Waktu di Ringkasan) = jumlah (menit cetak × qty) semua barang cetak di paket itu. Format: `48 m` kalau di bawah 1 jam, atau `4 j 12 m`.

## 5. Isi paket & total default

| Paket | Isi |
|---|---|
| Hutan Kecil · Food | tray, egg cup, clip, Cheese Stick Cheddar |
| Hutan Sedang · Food | tray, egg cup, clip, phone stand, pohon, Florentine Cookies |
| Hutan Besar · Food | tray, egg cup, clip, phone stand, pohon, Cheese Stick Cheddar, box Mnop JB 10 |
| Hutan Kecil · No food | 2 coaster, egg cup, clip |
| Hutan Sedang · No food | 2 coaster, egg cup, clip, phone stand, pohon |
| Hutan Besar · No food | tray, egg cup, phone stand, clip, 3 pohon, box Mnop JB 10 |

Ringkasan default (kelompok **No food di kiri, Food di kanan**). Di **hutan.html** urutan sub-kolom **thumbnail isi paket (cetak + kue, tanpa kemasan), foto paket final (sudah packing), Harga jual, Modal, Margin, Waktu**. Di **landing**, kolom Modal dan Margin dihilangkan; yang tampil cuma thumbnail, foto final, Harga jual, dan Waktu. Foto final ada di kotak setinggi 2 baris thumbnail (100 px), agak portrait (80 px), di antara grid thumbnail dan pill harga. Enam slot: Kecil/Sedang/Besar × No food/Food. Field-nya `finalImage` di tiap paket (`DEFAULT_PACKAGES`); default `null` jadi placeholder "No image" (gaya sama kayak tile kemasan). Kalau fotonya sudah ada, isi path-nya, misalnya `images/final-hutan-kecil-food.jpg` (pola: `images/final-hutan-<kecil|sedang|besar>-<food|nf>.jpg`), lalu hard refresh. Nilai `finalImage` yang tersimpan di localStorage ikut kepakai. Waktu = total menit cetak (jumlah × waktu tiap barang cetak), format sama kayak di tile (`3 j 16 m` / `48 m`). Harga jual ditampilin sebagai pill hijau olive. Thumbnail: grid 2×3 kotak ~48 px; paket Food 6 slot, No food 5 slot (slot ke-6 kosong/tidak kelihatan). Popup Isi paket membatasi **maks 5 barang cetak berbeda** (kedua mode) dan **maks 1 kue** (mode Food; No food nggak ada pilihan kue). Jumlah per barang tetap bebas. Kalau sudah penuh, checkbox yang belum dicentang dimatikan (barisnya redup) plus catatan "Maks 5 barang cetak" / "Maks 1 kue". Data lama yang kelebihan dipotong waktu load, sisain yang pertama menurut urutan katalog. Qty > 1 tetap satu slot plus badge (mis. x3). Default Besar Food di v=24 sudah tanpa Florentine (cuma Cheddar). Default tenaga kerja per ukuran paket masuk modal di bawah ini (Kecil Rp10.000, Sedang Rp15.000, Besar Rp25.000). Kalau browser masih nyimpen isi paket lama (misalnya Florentine di Besar Food), klik **Reset ke default** — nggak ada migrasi otomatis buat isi paket. Tenaga kerja per paket yang belum tersimpan di localStorage ikut default baru tanpa perlu reset.

| Paket | No food: Harga jual | No food: Modal | No food: Margin | Food: Harga jual | Food: Modal | Food: Margin |
|---|---|---|---|---|---|---|
| Kecil | Rp99.000 | Rp38.794 | 60,8% | Rp199.000 | Rp93.677 | 52,9% |
| Sedang | Rp229.000 | Rp55.316 | 75,8% | Rp349.000 | Rp140.199 | 59,8% |
| Besar | Rp399.000 | Rp156.081 | 60,9% | Rp499.000 | Rp176.099 | 64,7% |

## 6. Barang & link

**Cetak 3D** (harga @Rp238.000/kg):

| Item | Gram · waktu | Harga | MakerWorld |
|---|---|---|---|
| Tray oval ribbed | 51 g · 1j37m | Rp13.557 | https://makerworld.com/en/models/2419531 |
| Egg cup Linea | 22 g · 1j21m | Rp5.931 | https://makerworld.com/en/models/1926863 |
| Phone stand C-shape | 15 g · 49m | Rp4.031 | https://makerworld.com/en/models/2823737 |
| Mini bag clip | 6 g · 18m | Rp1.609 | https://makerworld.com/en/models/2346974 |
| Pohon kerucut | 28 g · 1j16m | Rp7.491 | https://makerworld.com/en/models/1940296 |
| Coaster ribbed myro | 21 g · 42m | Rp5.587 | https://makerworld.com/en/models/2445744 |

**Kue dr cookies** (semua toples 500 ml, toples udah termasuk harga, nggak pakai link):
- Florentine Cookies: Rp65.000 (toples 500 ml)
- Lidah Kucing Matcha: Rp65.000 (toples 500 ml; topping coklat atau polos)
- Cheese Stick Cheddar: Rp35.000 (toples 500 ml; nggak ada di poster menu)
- Cheese Stick Cheddar Pouch 18×26 cm: Rp35.000

**Kemasan** (harga bisa diedit di halaman):

| Item | Harga | Toko |
|---|---|---|
| Mnop Kotak Kado JB 10 (43×33×16) | Rp55.900 | https://www.tokopedia.com/mnop/kotak-kado-jb-10-ukuran-43x33x16-cm-giftbox-jumbo-mnop-store-1731195569874437789-1736520859896350365 |
| Gracia Box Hard Box Exclusive (30×25×12) | Rp90.422 | https://www.tokopedia.com/graciabox/hard-box-exclusive-ukuran-30-cm-x-25-cm-x12-cm-hitam-b8c37 |
| Gracia Box Hardbox Jendela (25×20×12) | Rp60.745 | https://www.tokopedia.com/graciabox/box-hamper-hardbox-kotak-kado-ukuran-25-cm-x-20-cm-x-12-cm-merah |
| B1B Clear Cube Bloom Box 12×12×12 | Rp10.150 | https://shopee.co.id/Best-One-Clear-Cube-Bloom-Box-Flower-Bag-Tas-Mika-Souvenir-Serbaguna-Gift-Bag-Hampers-i.1506650416.53921934687 |
| B1B Clear Square Bloom Box 20×9×20 / 25×10×25 | Rp13.400 / Rp18.800 | https://shopee.co.id/Best-One-Clear-Square-Bloom-Box-Flower-Bag-Tas-Mika-Souvenir-Serbaguna-Gift-Bag-Hampers-i.1506650416.43086940955 |
| B1B Square Clear Gift Bag 20×20×20 | Rp11.600 (harga lama, belum dicek ulang di Shopee) | https://shopee.co.id/Best-One-Square-Clear-Gift-Bag-Goodie-Bag-Visible-Tas-Hadiah-Hampers-Souvenir-i.1506650416.54770053205 |
| B1B Blurry Round Handle Large 23×13×27 | Rp14.700 (harga lama, belum dicek ulang di Shopee) | https://shopee.co.id/Best-One-Blurry-Gift-Bag-Round-Handle-Tas-Hadiah-Hampers-Goodie-Bag-Souvenir-i.1506650416.49069778231 |
| Cellophane (plastik OPP 80×100) | Rp2.922/lembar (Rp73.062 isi 25, Berlian 90) | https://www.tokopedia.com/berlian90/plastik-parcel-polos-80x100-cm-plastik-bening-parsel-pastik-opp-parcel |
| Kraft pouch 18×26 (window ziplock) | Rp1.150/pcs | https://www.tokopedia.com/nusantarapacking/standing-pouch-kraft-paper-window-ziplock-premium-18-x-26-cm |
| Window box 25×25×12 (Felice, min. 5, incl. pita+kartu) | Rp14.720/pcs | https://www.tokopedia.com/felice-cakebox/kode-bmt012-paket-hardbox-mika-pita-kado-panjang-thank-you-card-25x25x12 |
| Premium magnetic box 25×20×8 (Luxe Box) | Rp45.500/pcs | https://www.tokopedia.com/luxe-box/hardbox-flat-box-magnet-packaging-kotak-kado-gift-box-buka-tutup-magnet-uk-25-x-20-x-8-cm-1736086569164244382-1736086728044807582 |
| Tote bag (paper bag kraft R6 20×10×25, Lestari Jaya) | Rp1.625/pcs (Rp19.500 isi 12) | https://www.tokopedia.com/lestarisby-/paper-bag-polos-kantong-souvenir-dan-kue-r6-20x10x25-cm |
| Ekstra (tissue, kartu, pita) | **Rp11.700 per paket** (1 bungkus crinkle cream 200 g Rp35.000 untuk 3 paket; kartu & pita belum termasuk). Link tile ke listing crinkle. | https://www.tokopedia.com/payperinkbsd/200-gr-shredded-paper-kertas-potong-cream-natural-crinkle-cut |

## 7. Preferensi gue (penting buat yang lanjutin)

- Bahasa Indonesia santai (gue/lo).
- Gue orangnya **visual**: selalu kirim screenshot hasilnya.
- Kirim **cuma file yang berubah**, jangan zip seluruh project (kecuali file baru kayak foto).
- Cek dulu di localhost, **jangan push** sebelum gue OK.
- Ganti nama: **Paket Hutan** (dulu Paket Sore). Deskripsi: "Olive · fluting halus", desain kalem dan teduh; cocok buat rekan kerja, atasan, klien, teman yang suka dekorasi minimalis.
- **Paket Awan** (rib tebal membulat, lembut dan playful; cocok buat sahabat, pasangan, adik, kado ultah) dan **Paket Laut** (lengkung ombak organik, tenang dan artsy; cocok buat yang suka desain unik, housewarming, ucapan terima kasih) masih "Segera hadir".
- Tampilan tile: foto di atas, keterangan + harga di bawah, 6 kolom di desktop, 3 di tablet, 2 di HP.
- Hal-hal yang udah gue minta hapus jangan dibalikin: kotak kuning catatan, foto besar di Isi paket, foto di Ringkasan halaman detail, foto di kartu landing (termasuk kotak "No images" di Awan & Laut), kolom Modal dan Margin di tabel ringkasan landing (di halaman detail, Modal tetap ada; persentase margin di bawah angka modal, tanpa kolom Margin terpisah), h1/lead di header, caption "harga bisa diubah manual", subtitle tile kue "di luar poster menu" dan "topping coklat/polos", kalimat "Bisa lo ubah kalau harganya berubah." di deskripsi Harga satuan kue, kalimat "Isinya tray oval ribbed, egg cup, bag clip, phone stand, pohon kerucut, dan kue dr cookies dalam toples." di deskripsi kartu Paket Hutan di landing. Baris "Dasar harga lisensi per set" di bawah tile cetak (input Sabre euro/bulan, Kurs EUR, yekta USD/bulan, Kurs USD) — "Set per bulan" pindah ke Asumsi hitungan.

## 8. Testing

- Script headless Chrome (playwright-core) ada di `/workspace/srk-notes/` (di box, bukan di repo).
- Jalanin server dulu di port **8765**: `cd studio-riones-kalkulator && python3 -m http.server 8765`
- Terus: `cd /workspace/srk-notes && for t in redir22 test10 test12 test-popup test-sore test-landing2 links13 align16 tiles17 lic17; do node $t.js; done`
- Cakupannya: angka default Ringkasan, sinkron landing ↔ detail, harga filamen per kg, popup pilih barang, simpan & reset, tile kue/kemasan + link, checkbox lisensi, redirect `sore.html`, migrasi data lama, gerbang kata sandi, dan nggak ada overflow di HP.
- Tes harus unlock gerbang dulu (`sessionStorage` `studio-riones-gate` = `1` lewat `addInitScript`). Jangan anggap lulus kalau tes masih ketahan di layar password.
- Status terakhir: **semua lulus** (v=29). v29 juga: bahasa formal di semua teks menghadap user, logo+favicon, thumbnail landing 56px, margin di bawah modal, gerbang password 1616, dan tampilan HP dirapikan.

## 9. Yang masih terbuka

1. ~~**Foto kue dr cookies**~~: **selesai di v=23.** Foto dipotong dari poster menu (Florentine, Lidah Kucing Matcha, Cheese Stick Cheddar toples, Cheese Stick Cheddar pouch) dan dipasang di tile "Harga satuan kue". Poster sumbernya agak rendah resolusinya, jadi fotonya ~180–191 px (nggak di-upscale). Foto cheddar 500 ml pakai foto toples yang ada di poster (ukuran di poster 1,3 L / 3,8 L, bukan 500 ml).
2. ~~**Foto kemasan yang sebelumnya "No image"**~~: **selesai di v=26.** Foto B1B Gift Bag dan Blurry diambil dari `og:image` Shopee (harga tile tetap Rp11.600 / Rp14.700, belum bisa dicek ulang karena API Shopee 403). Kraft pouch, window box, magnetic box, tote paper bag, cellophane OPP, dan ekstra sudah ada foto, link Tokopedia, dan harga per pcs (dicek 25 Nov 2026). Ekstra di v=26 masih Rp0; **di v=29 jadi Rp11.700 per paket** (Rp35.000 / 3). Paket default masih belum memasukkan item extras (cuma box Mnop di Besar), jadi angka Ringkasan default tidak berubah karena harga ekstra ini.
3. **Lisensi egg cup & coaster myro**: masih TBD (Rp0 di modal). Kalau udah pasti, harga perlu dimasukin (inputnya udah dihapus dari halaman, jadi ubah default `eggLicense` / `myroLicense` di `app.js`, atau tambahin input lagi).
4. **Margin Food Kecil (52,9%) dan Food Sedang (59,8%) masih di bawah 60%**, setelah tenaga kerja default masuk modal. Saran harga biar ≥60%: Kecil **Rp239.000**, Sedang **Rp359.000**. Food Besar **64,7%** (modal Rp176.099, harga jual tetap Rp499.000), masih di atas target.
5. **Foto paket final di Ringkasan** masih placeholder "No image" di 6 slot. Taruh file `images/final-hutan-<kecil|sedang|besar>-<food|nf>.jpg` lalu isi `finalImage` di `DEFAULT_PACKAGES` (lihat bagian 5).
6. **Push ke GitHub** (`Rindut/studioriones`) masih pending sampai gue OK localhost. Setelah itu gue deploy sendiri di Vercel.
