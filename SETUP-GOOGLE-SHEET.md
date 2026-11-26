# Setup Google Sheet buat data bersama

Pakai panduan ini sekali aja, sekitar 5–10 menit. Habis itu lo sama adik lo bisa buka https://studioriones.vercel.app/ dan lihat isian paket yang sama.

**Penting:** buka dulu site-nya di browser yang isiannya udah lo atur (yang kemarin dipakai di Vercel), *sebelum* orang lain buka site versi baru. Kalau Sheet-nya masih kosong, isian di browser itu yang otomatis diunggah jadi data bersama. Kalau orang lain keburu buka lebih dulu dengan data default, default-nya yang ikut keunggah.

## 1. Bikin Google Sheet

1. Buka [Google Sheets](https://sheets.google.com) pake akun Google lo.
2. Klik **Blank spreadsheet** (spreadsheet kosong).
3. Kasih nama, misalnya `Studio Riones · Data bersama`.

## 2. Pasang skripnya

1. Di Sheet itu, menu **Extensions** (Ekstensi) > **Apps Script**.
2. Editor skrip bakal kebuka di tab baru. Hapus isi file `Code.gs` yang default (fungsi `myFunction` kosong).
3. Salin semua isi file `apps-script/Code.gs` dari folder project ini, lalu tempel ke editor.
4. Klik ikon disket **Save project** (atau Ctrl/Cmd+S). Kasih nama project kalau diminta, misalnya `Studio Riones sync`.

## 3. Bikin tab dan izinkan akses

1. Di editor, pastikan fungsi yang dipilih di dropdown atas adalah **`setupSheets`**.
2. Klik **Run**.
3. Kalau muncul **Authorization required** / **Review permissions**, klik itu, pilih akun Google lo, lalu **Allow** (Izinkan). Google kadang nulis “Google hasn’t verified this app” — klik **Advanced** (Lanjutan), lalu **Go to Studio Riones sync (unsafe)** karena ini skrip punya lo sendiri.
4. Kalau sukses, di Sheet bakal ada tab **data** dan **history**. Tab data masih kosong, itu wajar.

## 4. Set token rahasia

1. Di editor Apps Script, di panel kiri, klik **Project Settings** (ikon gerigi).
2. Scroll ke bagian **Script Properties**.
3. Klik **Add script property**.
4. Di **Property**, isi: `SYNC_TOKEN`
5. Di **Value**, isi token acak yang panjang (boleh campur huruf dan angka, misalnya hasil dari password manager). Jangan pakai spasi di ujung.
6. Klik **Save script properties**.

Simpan token ini sementara, nanti lo tempel juga di `config.js`.

## 5. Deploy jadi Web app

1. Kembali ke editor kode (ikon `<>` di panel kiri).
2. Di kanan atas, klik **Deploy** > **New deployment**.
3. Di samping **Select type**, klik ikon gerigi, lalu pilih **Web app**.
4. Isi **Description** kalau mau, misalnya `v1`.
5. **Execute as**: pilih **Me** (akun lo).
6. **Who has access**: pilih **Anyone**. (Bukan “Anyone with a Google account”. Pilih **Anyone** supaya site-nya bisa baca/tulis tanpa login Google di browser.)
7. Klik **Deploy**.
8. Kalau diminta izin lagi, izinkan seperti di langkah 3.
9. Salin **Web app URL**-nya. Bentuknya kira-kira:
   `https://script.google.com/macros/s/XXXXXXXX/exec`

Pakai URL `/exec` itu, jangan yang `/dev`.

## 6. Isi `config.js` di project

Buka file `config.js` di folder project, lalu isi URL dan token. Contoh:

```js
window.SR_CONFIG = window.SR_CONFIG || {};
if (window.SR_CONFIG.SYNC_URL == null) window.SR_CONFIG.SYNC_URL = "";
if (window.SR_CONFIG.SYNC_TOKEN == null) window.SR_CONFIG.SYNC_TOKEN = "";
window.SR_CONFIG.SYNC_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
window.SR_CONFIG.SYNC_TOKEN = "tempel-token-yang-sama-dengan-script-property";
```

Atau lebih ringkas, ganti dua string kosong `""` di file itu jadi URL dan token lo.

Commit dan push, lalu deploy ke Vercel seperti biasa (atau biar Vercel yang auto-deploy dari GitHub).

## 7. Cek apakah sudah nyambung

1. Hard refresh site (Cmd+Shift+R / Ctrl+Shift+R).
2. Login password seperti biasa.
3. Di halaman Hutan, dekat tombol Reset, harusnya muncul status **Tersimpan ke Google Sheet**.
4. Ubah satu harga atau isi paket, tunggu sekitar 2 detik, statusnya **Menyimpan…** lalu kembali **Tersimpan ke Google Sheet**.
5. Buka tab **data** di Sheet: sel A1 ada JSON, B1 ada waktu, C1 ada id perangkat.
6. Buka site di browser lain (atau minta adik lo buka). Habis refresh, isiannya harus sama.

Kalau statusnya **Gagal sinkron, data tersimpan lokal**, cek URL `/exec`, token di `config.js` harus *persis* sama dengan Script Property, dan deployment-nya **Who has access: Anyone**.

## Kalau lo ubah `Code.gs` lagi nanti

URL deploy nggak otomatis ikut kode baru. Di editor:

1. **Deploy** > **Manage deployments**.
2. Klik ikon pensil di deployment Web app yang aktif.
3. Di **Version**, pilih **New version**.
4. Klik **Deploy**.

URL-nya biasanya tetap, jadi `config.js` nggak perlu diganti.

## Yang perlu lo tahu

- Token ada di `config.js`, jadi ikut ke GitHub/Vercel dan bisa dilihat di source browser. Ini cukup buat lo berdua, tapi siapa pun yang punya URL **dan** token bisa baca/ubah data. Jangan sebarluaskan.
- **Reset ke default** di halaman Hutan akan mereset data bersama untuk semua orang. Nanti ada konfirmasi khusus soal ini.
- Data lama tetap ada di tab **history** (tiap simpan nambah baris). Boleh hapus baris lama kalau sheet-nya sudah terlalu panjang; jangan hapus tab-nya.
- Kunci localStorage (`studio-riones-kalkulator-v1`) tetap dipakai sebagai cadangan kalau lagi offline atau sinkron gagal.
