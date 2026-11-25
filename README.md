# Paket Hampers · Studio Riones

Site statis berisi landing page paket hampers Studio Riones dan kalkulator modal/harga jual **Paket Hutan** (Food / No food).
Tidak ada build step dan tidak perlu install apa-apa.

Sebelum landing dan halaman detail, ada layar kata sandi (`1616`). Pengecekan hanya di browser (situs ini statis). Logo Studio Riones tampil di layar itu, di header, dan sebagai ikon tab.

- **Landing page** (`index.html`): 3 baris ringkasan, Paket Hutan, Paket Awan, Paket Laut, disusun dari atas ke bawah. Tiap baris punya kotak gambar di kiri (setinggi tabel) dan satu tabel Kecil/Sedang/Besar di kanan yang menampilkan **Food** dan **No food** sekaligus (masing-masing Modal, Harga jual, Margin). Di HP tabelnya bisa digeser ke samping. Saat ini baru Paket Hutan yang aktif dan punya tombol **See details** di pojok kanan atas; Awan dan Laut bertanda *Segera hadir* dengan kotak *No images*.
- **Detail Paket Hutan** (`hutan.html`): kalkulator lengkap. Dulu namanya Paket Sore; `sore.html` sekarang cuma redirect ke `hutan.html`, dan data yang tersimpan di browser tetap kebaca. Ada tombol **← Semua paket** di header buat balik ke landing.
- Angka di landing dihitung dari data dan simpanan browser yang sama dengan halaman detail, jadi selalu cocok.

## Isi folder

```
index.html     landing page (ringkasan Paket Hutan, Awan, Laut)
hutan.html     detail / kalkulator Paket Hutan
sore.html      redirect lama ke hutan.html (biar bookmark lama tetap jalan)
style.css      tampilan (krem + olive, mobile-friendly), dipakai kedua halaman
app.js         data barang, rumus, dan logika kalkulator (dipakai kedua halaman)
landing.js     isi tabel ringkasan di landing page
gate.js        layar kata sandi (1616) sebelum landing dan halaman detail
images/        foto cetakan, kue, kemasan, logo, favicon, dan Apple touch icon
favicon.svg    ikon lama (tab sekarang memakai images/favicon.png)
.nojekyll      biar aman kalau suatu saat dipasang di GitHub Pages
```

## Cara hitung

- Modal cetak = (gram × harga filamen per gram; default PLA Matte Bambu Lab Rp238.000/kg, bisa diubah di kolom "Harga filamen per kg" + listrik 80 W × menit cetak × Rp1.444,70/kWh) + 10% cadangan gagal cetak.
- Lisensi Sabre (€19/bulan) dan yekta ($12/bulan) dibagi jumlah set per bulan (default 20). yekta dihitung sekali per paket kalau ada phone stand atau clip. Tiap tile cetak punya kotak centang Lisensi (centang = masuk modal); dasar harganya (iuran, kurs, set per bulan) ada di bawah tile cetak. Egg cup dan coaster myro tampil TBD sampai harga lisensinya pasti.
- Harga jual bisa manual atau pakai Target margin (dibulatkan ke angka ...9.000).
- Semua isian (barang yang dicentang, jumlah, harga satuan, harga jual, mode) **tersimpan otomatis di browser** (localStorage). Tombol **Reset ke default** menghapus simpanan dan mengembalikan angka awal.
- Simpanan ini cuma ada di browser dan perangkat yang lo pakai. Buka di HP lain atau browser lain = mulai dari default.

## 1. Coba dulu di localhost

Buka terminal di folder ini, lalu jalankan salah satu:

```bash
# Python (biasanya sudah ada di Mac/Linux)
python3 -m http.server 8000
```

```bash
# atau Node.js
npx serve .
```

Buka di browser:

- Python: http://localhost:8000 (landing), detail Paket Hutan di http://localhost:8000/hutan.html
- `npx serve`: alamat yang muncul di terminal (biasanya http://localhost:3000)

Contoh lengkap kalau zip-nya ada di folder Downloads:

```bash
cd ~/Downloads
unzip studio-riones-kalkulator.zip
cd studio-riones-kalkulator
python3 -m http.server 8000
```

Kalau muncul `python3: command not found`, pakai `python -m http.server 8000`.

Stop server pakai `Ctrl + C`. (Bisa juga klik dua kali `index.html`, tapi lebih aman lewat server lokal di atas.)

## 2. Upload ke GitHub

Repo: https://github.com/Rindut/studioriones

**Lewat website GitHub (paling gampang):**

1. Buka repo di atas, klik **Add file → Upload files**.
2. Drag semua isi folder ini (termasuk folder `images/`, `favicon.svg`, dan `.nojekyll`) ke halaman upload. Upload **isinya**, bukan foldernya, supaya `index.html` ada di root repo.
   - File `.nojekyll` tersembunyi di Mac/Windows. Kalau nggak ikut, nggak masalah buat Vercel.
3. Tulis pesan commit, misalnya `Kalkulator Paket Hutan`, lalu klik **Commit changes**.

**Lewat terminal (kalau sudah pakai git):**

```bash
cd studio-riones-kalkulator
git init
git add .
git commit -m "Kalkulator Paket Hutan"
git branch -M main
git remote add origin https://github.com/Rindut/studioriones.git
git push -u origin main
```

Kalau repo-nya sudah ada isinya (misalnya README dari GitHub), jalankan `git pull origin main --allow-unrelated-histories` dulu sebelum `git push`.

## 3. Deploy di Vercel

1. Login ke https://vercel.com pakai akun GitHub.
2. Klik **Add New… → Project**, lalu **Import** repo `Rindut/studioriones`.
3. Setting:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./` (biarkan default, karena `index.html` ada di root)
   - **Build Command:** kosongkan
   - **Output Directory:** kosongkan (atau `.`)
4. Klik **Deploy**. Setelah selesai, link-nya kurang lebih `https://studioriones.vercel.app` (nama persisnya muncul di dashboard Vercel).
5. Setiap kali lo push perubahan ke branch `main`, Vercel otomatis deploy ulang.

## Kalau tampilan berantakan

File CSS dan JS dipanggil dengan nomor versi (misalnya `style.css?v=5`) supaya browser nggak pakai versi lama dari cache. Kalau halaman masih kelihatan polos (gambar gede, tabel kepotong), pastikan `style.css` terbaru ikut ter-copy, lalu refresh paksa: `Cmd + Shift + R` (Mac) atau `Ctrl + Shift + R` (Windows). Kalau nanti ganti CSS/JS lagi, naikkan angkanya (misalnya `?v=6`) di `index.html` dan `hutan.html`.

## Ubah data

Semua barang, harga default, link toko, dan isi paket Hutan ada di bagian atas `app.js` (landing page ikut berubah otomatis):

- `PRINT_ITEMS` — barang cetak 3D (gram, menit, foto, lisensi)
- `FOOD_ITEMS` — kue (harga sudah termasuk toples PET)
- `PACK_ITEMS` — kemasan, termasuk link Tokopedia/Shopee
- `DEFAULT_SETTINGS` — harga satuan default dan asumsi lisensi
- `DEFAULT_PACKAGES` — isi default tiap paket dan harga jual

Setelah ganti angka default, klik **Reset ke default** di browser supaya simpanan lama nggak menimpa angka baru.

Teks kartu Paket Awan dan Paket Laut ada di `index.html`. Kalau paketnya sudah siap, ganti badge *Segera hadir* jadi tombol See details yang mengarah ke halaman detailnya.

## Catatan

- Kue dr cookies yang dipakai: Florentine Cookies Rp65.000, Lidah Kucing Matcha Rp65.000, Cheese Stick Cheddar Rp35.000 (semua toples 500 ml), Cheese Stick Cheddar Pouch (18×26 cm) Rp35.000. Lisensi egg cup dan izin coaster myro (CC BY-NC) masih perlu dikonfirmasi.
- Cellophane (plastik OPP 80×100) default Rp2.922/lembar (Rp73.062 isi 25). Ekstra (tissue, kartu, pita) default Rp11.700 per paket (1 bungkus crinkle 200 g Rp35.000 untuk 3 paket; kartu & pita belum termasuk). Paket default belum memasukkan item extras.
- PLA tidak food-safe; kue tetap di toples PET dr cookies.
