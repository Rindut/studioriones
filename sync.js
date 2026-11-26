/* Sinkronisasi isian ke Google Sheet (lewat Apps Script). Nonaktif jika config kosong. */
(function () {
  "use strict";
  var cfg = window.SR_CONFIG || {};
  var url = (cfg.SYNC_URL || "").replace(/\/$/, "");
  var token = cfg.SYNC_TOKEN || "";
  var enabled = !!(url && token);

  var DEVICE_KEY = "studio-riones-sync-id";
  var pushTimer = null;
  var loadedUpdatedAt = "";
  var pendingState = null;
  var conflictOpen = false;

  function deviceId() {
    try {
      var id = localStorage.getItem(DEVICE_KEY);
      if (id) return id;
      id = "perangkat-" + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(DEVICE_KEY, id);
      return id;
    } catch (e) {
      return "perangkat";
    }
  }

  function setStatus(text, kind) {
    var el = document.getElementById("sync-status");
    if (!el) return;
    el.hidden = !text;
    el.textContent = text || "";
    el.classList.remove("is-busy", "is-err");
    if (kind) el.classList.add(kind);
  }

  function getJson(path) {
    return fetch(url + path, { method: "GET", credentials: "omit" }).then(function (r) {
      return r.json();
    });
  }

  function postJson(payload) {
    return fetch(url, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  function fetchRemote() {
    return getJson("?token=" + encodeURIComponent(token));
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function applyToPage(data) {
    var raw = JSON.stringify(data);
    try { localStorage.setItem(window.KalkulatorSore.STORAGE_KEY, raw); } catch (e) {}
    if (window.__kalkulator && typeof window.__kalkulator.applyState === "function") {
      window.__kalkulator.applyState(raw);
      return;
    }
    // Landing: isi ulang tabel ringkasan.
    if (window.KalkulatorSore && document.querySelector("#sore-summary tbody")) {
      var st = window.KalkulatorSore.loadState(raw);
      window.KalkulatorSore.fillSummaryTable(
        document.querySelector("#sore-summary tbody"),
        st,
        { showModal: false, showMargin: false }
      );
      var note = document.getElementById("sore-note");
      if (note) note.textContent = "Angka mengikuti isian bersama (tersimpan di Google Sheet).";
    }
  }

  function showConflict(remote, localState) {
    if (conflictOpen) return;
    conflictOpen = true;
    var wrap = document.createElement("div");
    wrap.className = "sync-conflict";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "sync-conflict-title");
    wrap.innerHTML =
      '<div class="sync-conflict-card">' +
        '<p id="sync-conflict-title">Data di Google Sheet lebih baru daripada yang sedang dibuka.</p>' +
        '<div class="sync-conflict-actions">' +
          '<button type="button" class="btn" data-act="load">Muat data terbaru</button>' +
          '<button type="button" class="btn btn-secondary" data-act="keep">Tetap simpan perubahan ini</button>' +
        "</div>" +
      "</div>";
    function close() {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      conflictOpen = false;
    }
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      close();
      if (act === "load") {
        loadedUpdatedAt = remote.updatedAt || "";
        if (remote.data) applyToPage(remote.data);
        setStatus("Tersimpan ke Google Sheet");
      } else if (act === "keep") {
        sendPush(localState, true);
      }
    });
    document.body.appendChild(wrap);
  }

  function sendPush(state, force) {
    pendingState = null;
    setStatus("Menyimpan…", "is-busy");
    var body = { token: token, data: state, updatedBy: deviceId() };
    var start = force
      ? Promise.resolve({ data: null, updatedAt: loadedUpdatedAt })
      : fetchRemote();
    return start.then(function (remote) {
      if (remote && remote.error === "unauthorized") {
        setStatus("Gagal sinkron, data tersimpan lokal", "is-err");
        return;
      }
      var remoteAt = (remote && remote.updatedAt) || "";
      if (!force && remoteAt && loadedUpdatedAt && remoteAt !== loadedUpdatedAt && remote.data) {
        showConflict(remote, state);
        return;
      }
      return postJson(body).then(function (res) {
        if (res && res.ok) {
          loadedUpdatedAt = res.updatedAt || "";
          setStatus("Tersimpan ke Google Sheet");
        } else {
          setStatus("Gagal sinkron, data tersimpan lokal", "is-err");
        }
      });
    }).catch(function () {
      setStatus("Gagal sinkron, data tersimpan lokal", "is-err");
    });
  }

  function schedulePush(state) {
    if (!enabled) return;
    pendingState = cloneState(state);
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () {
      if (pendingState) sendPush(pendingState, false);
    }, 1500);
  }

  function pushNow(state) {
    if (!enabled) return Promise.resolve();
    clearTimeout(pushTimer);
    return sendPush(cloneState(state), true);
  }

  function initialLoad() {
    if (!enabled) return;
    fetchRemote().then(function (remote) {
      if (remote && remote.error === "unauthorized") {
        setStatus("Gagal sinkron, data tersimpan lokal", "is-err");
        return;
      }
      if (remote && remote.data) {
        loadedUpdatedAt = remote.updatedAt || "";
        applyToPage(remote.data);
        setStatus("Tersimpan ke Google Sheet");
        return;
      }
      // Sheet kosong: unggah isian lokal saat ini (migrasi sekali).
      var localRaw = null;
      try { localRaw = localStorage.getItem(window.KalkulatorSore.STORAGE_KEY); } catch (e) {}
      var localState = window.KalkulatorSore.loadState(localRaw);
      loadedUpdatedAt = "";
      if (localRaw) {
        setStatus("Menyimpan…", "is-busy");
        return sendPush(localState, true);
      }
      setStatus("Tersimpan ke Google Sheet");
    }).catch(function () {
      setStatus("Gagal sinkron, data tersimpan lokal", "is-err");
    });
  }

  window.SRSync = {
    enabled: function () { return enabled; },
    schedulePush: schedulePush,
    pushNow: pushNow
  };

  if (!enabled) return;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialLoad);
  } else {
    initialLoad();
  }
})();
