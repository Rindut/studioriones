/* Gerbang kata sandi sisi klien. Bukan proteksi server: cukup untuk menahan kunjungan iseng. */
(function () {
  "use strict";
  var KEY = "studio-riones-gate";
  var PIN = "1616";

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function unlock() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  }
  if (unlocked()) return;

  document.documentElement.classList.add("gate-lock");

  function build() {
    if (document.getElementById("site-gate")) return;
    var gate = document.createElement("div");
    gate.id = "site-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "gate-title");
    gate.innerHTML =
      '<div class="gate-card">' +
        '<img class="gate-logo" src="images/logo-studio-riones.png" width="140" height="140" alt="Studio Riones">' +
        '<h1 id="gate-title" class="gate-title">Ruang Racik</h1>' +
        '<p class="gate-lead">Masukkan kata sandi untuk membuka kalkulator paket.</p>' +
        '<form id="gate-form" action="#" method="post" autocomplete="off">' +
          '<label for="gate-pass">Kata sandi</label>' +
          '<input id="gate-pass" name="password" type="password" inputmode="numeric" autocomplete="current-password" required>' +
          '<p class="gate-err" id="gate-err" hidden>Kata sandi tidak sesuai.</p>' +
          '<button type="submit" class="btn">Masuk</button>' +
        '</form>' +
      "</div>";
    document.body.appendChild(gate);
    var input = document.getElementById("gate-pass");
    var err = document.getElementById("gate-err");
    document.getElementById("gate-form").addEventListener("submit", function (e) {
      e.preventDefault();
      if ((input.value || "").trim() === PIN) {
        unlock();
        document.documentElement.classList.remove("gate-lock");
        if (gate.parentNode) gate.parentNode.removeChild(gate);
      } else {
        err.hidden = false;
        input.value = "";
        input.focus();
      }
    });
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 0);
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
