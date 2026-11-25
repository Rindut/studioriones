/* Landing page: ringkasan Paket Hutan. Tabel diisi oleh core.fillSummaryTable (fungsi yang sama dipakai hutan.html).
   Landing cuma tampilkan thumbnail, harga jual, dan waktu; modal & margin tetap di halaman detail. */
(function () {
  "use strict";
  var core = window.KalkulatorSore;
  if (!core) return;
  var state = core.loadState();
  core.fillSummaryTable(document.querySelector("#sore-summary tbody"), state, { showModal: false, showMargin: false });

  var saved = false;
  try { saved = !!localStorage.getItem(core.STORAGE_KEY); } catch (e) {}
  document.getElementById("sore-note").textContent = saved
    ? "Angka mengikuti isian terakhir di halaman detail (tersimpan di browser ini)."
    : "Angka default. Ubah isi dan harga di halaman detail.";
})();
