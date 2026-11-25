/* Kalkulator Paket Hutan · Studio Riones
   Plain JS, tanpa build step. State disimpan di localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "studio-riones-kalkulator-v1";

  // Rumus modal cetak: (gram × harga filamen per gram + listrik 80 W × Rp1.444,70/kWh) × 1,10 cadangan gagal cetak.
  // Default filamen: PLA Matte Bambu Lab Rp238.000/kg. Bisa diubah di halaman (Harga filamen per kg).
  var PLA_PER_KG = 238000;
  var WATT = 80;
  var TARIF_KWH = 1444.7;
  var FAIL = 0.10;
  function printCost(grams, minutes, perKg) {
    if (perKg == null || !isFinite(perKg)) perKg = PLA_PER_KG;
    var listrik = (WATT / 1000) * (minutes / 60) * TARIF_KWH;
    return Math.round((grams * (perKg / 1000) + listrik) * (1 + FAIL));
  }

  var PRINT_ITEMS = [
    { id: "tray", lic: "sabre", name: "Tray oval ribbed", mw: "MW2419531", grams: 51, minutes: 97, image: "images/tray.jpg", license: "Sabre" },
    { id: "eggcup", lic: "egg", name: "Egg cup Linea", mw: "MW1926863", grams: 22, minutes: 81, image: "images/eggcup.jpg", license: "Egg cup, TBD" },
    { id: "phonestand", lic: "yekta", name: "Phone stand C-shape", mw: "MW2823737", grams: 15, minutes: 49, image: "images/phonestand.jpg", license: "yekta" },
    { id: "clip", lic: "yekta", name: "Mini bag clip", mw: "MW2346974", grams: 6, minutes: 18, image: "images/clip.jpg", license: "yekta" },
    { id: "tree", lic: "cc0", name: "Pohon kerucut", mw: "MW1940296", grams: 28, minutes: 76, image: "images/tree.jpg", license: "CC0" },
    { id: "coaster", lic: "myro", name: "Coaster ribbed myro", mw: "MW2445744", grams: 21, minutes: 42, image: "images/coaster.jpg", license: "CC BY-NC" }
  ];

  // Kue dr cookies yang dipakai. Harga sudah termasuk kemasan (toples 500 ml / pouch).
  var FOOD_ITEMS = [
    { id: "florentine500", desc: "Toples 500 ml", name: "Florentine Cookies", note: "Toples 500 ml Rp65.000.", image: "images/food-florentine.jpg" },
    { id: "lidahKucingMatcha500", desc: "Toples 500 ml", name: "Lidah Kucing Matcha", note: "Toples 500 ml Rp65.000.", image: "images/food-lidah-kucing-matcha.jpg" },
    { id: "cheddar500", desc: "Toples 500 ml", name: "Cheese Stick Cheddar", note: "Toples 500 ml Rp35.000.", image: "images/food-cheddar.jpg" },
    { id: "cheddarPouch", desc: "Pouch 18×26 cm", name: "Cheese Stick Cheddar Pouch", note: "Pouch 18×26 cm Rp35.000.", image: "images/food-cheddar-pouch.jpg" }
  ];

  var MNOP = "https://www.tokopedia.com/mnop/kotak-kado-jb-10-ukuran-43x33x16-cm-giftbox-jumbo-mnop-store-1731195569874437789-1736520859896350365";
  var GR_EX = "https://www.tokopedia.com/graciabox/hard-box-exclusive-ukuran-30-cm-x-25-cm-x12-cm-hitam-b8c37";
  var GR_JE = "https://www.tokopedia.com/graciabox/box-hamper-hardbox-kotak-kado-ukuran-25-cm-x-20-cm-x-12-cm-merah";
  var B1B_CUBE = "https://shopee.co.id/Best-One-Clear-Cube-Bloom-Box-Flower-Bag-Tas-Mika-Souvenir-Serbaguna-Gift-Bag-Hampers-i.1506650416.53921934687";
  var B1B_SQUARE = "https://shopee.co.id/Best-One-Clear-Square-Bloom-Box-Flower-Bag-Tas-Mika-Souvenir-Serbaguna-Gift-Bag-Hampers-i.1506650416.43086940955";
  var B1B_GIFTBAG = "https://shopee.co.id/Best-One-Square-Clear-Gift-Bag-Goodie-Bag-Visible-Tas-Hadiah-Hampers-Souvenir-i.1506650416.54770053205";
  var B1B_BLURRY = "https://shopee.co.id/Best-One-Blurry-Gift-Bag-Round-Handle-Tas-Hadiah-Hampers-Goodie-Bag-Souvenir-i.1506650416.49069778231";
  var KRAFT = "https://www.tokopedia.com/nusantarapacking/standing-pouch-kraft-paper-window-ziplock-premium-18-x-26-cm";
  var WINDOW = "https://www.tokopedia.com/felice-cakebox/kode-bmt012-paket-hardbox-mika-pita-kado-panjang-thank-you-card-25x25x12";
  var PREMIUM = "https://www.tokopedia.com/luxe-box/hardbox-flat-box-magnet-packaging-kotak-kado-gift-box-buka-tutup-magnet-uk-25-x-20-x-8-cm-1736086569164244382-1736086728044807582";
  var TOTE = "https://www.tokopedia.com/lestarisby-/paper-bag-polos-kantong-souvenir-dan-kue-r6-20x10x25-cm";
  var CELLO = "https://www.tokopedia.com/berlian90/plastik-parcel-polos-80x100-cm-plastik-bening-parsel-pastik-opp-parcel";
  var EXTRAS = "https://www.tokopedia.com/payperinkbsd/200-gr-shredded-paper-kertas-potong-cream-natural-crinkle-cut";

  var PACK_ITEMS = [
    { id: "mnop", desc: "43×33×16 cm · Tokopedia", image: "images/pack-mnop.jpg", name: "Mnop Kotak Kado JB 10", note: "43×33×16 cm, Rp55.900. Pohon 16,5 cm muat berdiri.", href: MNOP, site: "Tokopedia · Mnop Store" },
    { id: "graciaExclusive", desc: "30×25×12 cm · Tokopedia", image: "images/pack-gracia-exclusive.jpg", name: "Gracia Box Hard Box Exclusive", note: "30×25×12 cm, Rp90.422, toko Tangerang Selatan. Pohon 16,5 cm harus ditidurkan.", href: GR_EX, site: "Tokopedia · Gracia Box, Tangerang Selatan" },
    { id: "graciaJendela", desc: "25×20×12 cm · Tokopedia", image: "images/pack-gracia-jendela.jpg", name: "Gracia Box Hardbox Jendela", note: "25×20×12 cm, Rp60.745, toko Tangerang Selatan. Pohon 16,5 cm harus ditidurkan.", href: GR_JE, site: "Tokopedia · Gracia Box, Tangerang Selatan" },
    { id: "b1bCube12", desc: "12×12×12 cm · mika · Shopee", image: "images/pack-b1b-cube.jpg", name: "B1B Clear Cube Bloom Box 12×12×12", note: "Mika bening, Rp10.150. Sesuai untuk NF Kecil (coaster Ø10 cm masih muat). Min. order 2 pcs.", href: B1B_CUBE, site: "Shopee · B1B Store" },
    { id: "b1bSquare20", desc: "20×9×20 cm · mika · Shopee", image: "images/pack-b1b-square-bloom.jpg", name: "B1B Clear Square Bloom Box 20×9×20", note: "Mika bening, Rp13.400. Cocok untuk NF Sedang atau Kecil Food. Dalam 9 cm, tray 12,3 cm tidak muat.", href: B1B_SQUARE, site: "Shopee · B1B Store" },
    { id: "b1bSquare25", desc: "25×10×25 cm · mika · Shopee", image: "images/pack-b1b-square-bloom.jpg", name: "B1B Clear Square Bloom Box 25×10×25", note: "Mika bening, Rp18.800. Dalam 10 cm, toples dan tray kemungkinan terlalu sempit.", href: B1B_SQUARE, site: "Shopee · B1B Store" },
    { id: "b1bGiftBag20", desc: "20×20×20 cm · jendela bening · Shopee", image: "images/pack-b1b-gift-bag.jpg", name: "B1B Square Clear Gift Bag 20×20×20", note: "Art paper dengan jendela bening, Rp11.600. Tray 19,7 cm muat, tetapi sangat pas (~3 mm); pohon dapat berdiri.", href: B1B_GIFTBAG, site: "Shopee · B1B Store" },
    { id: "b1bBlurryL", desc: "23×13×27 cm · doff · Shopee", image: "images/pack-b1b-blurry.jpg", name: "B1B Blurry Round Handle Large 23×13×27", note: "Buram (doff), Rp14.700. Tray muat, pohon berdiri, tetapi isi hanya terlihat samar.", href: B1B_BLURRY, site: "Shopee · B1B Store" },
    { id: "cellophane", desc: "80×100 cm · Berlian 90 · Rp2.922/lembar (isi 25)", image: "images/pack-cellophane.jpg", name: "Cellophane (plastik OPP)", note: "Plastik OPP 80×100 cm, Rp73.062 isi 25 (≈ Rp2.922/lembar). Bukan set plus pita.", href: CELLO, site: "Tokopedia · Plastik Opp Berlian 90" },
    { id: "kraft", desc: "18×26 cm · Nusantara Packing", image: "images/pack-kraft-pouch.jpg", name: "Kraft pouch", note: "Standing pouch kraft window ziplock 18×26 cm, Rp1.150/pcs.", href: KRAFT, site: "Tokopedia · Nusantara Packing Indo" },
    { id: "window", desc: "25×25×12 cm · Felice · min. 5, incl. pita+kartu", image: "images/pack-window-box.jpg", name: "Window box", note: "Hardbox mika 25×25×12 cm, Rp14.720/pcs, minimal 5, sudah termasuk pita dan kartu (warna pita acak).", href: WINDOW, site: "Tokopedia · Felice Cake Box" },
    { id: "premium", desc: "25×20×8 cm · Luxe Box", image: "images/pack-magnetic-box.jpg", name: "Premium magnetic box", note: "Hardbox magnet 25×20×8 cm, Rp45.500/pcs. Ada warna putih dan hijau emerald.", href: PREMIUM, site: "Tokopedia · Luxe Box" },
    { id: "tote", desc: "20×10×25 cm · Lestari Jaya · Rp1.625/pcs (isi 12)", image: "images/pack-tote-bag.jpg", name: "Tote bag", note: "Paper bag kraft R6 20×10×25 cm, Rp19.500 isi 12 (≈ Rp1.625/pcs).", href: TOTE, site: "Tokopedia · Lestari Jaya Surabaya" },
    { id: "extras", desc: "Rp11.700 per paket · 1 bungkus 200 g Rp35.000 untuk 3 paket; kartu & pita belum termasuk", image: "images/pack-extras-crinkle.jpg", name: "Ekstra (tissue, kartu, pita)", note: "Rp11.700 per paket (1 bungkus crinkle cream 200 g Rp35.000 untuk 3 paket; kartu & pita belum termasuk). Link tile ke listing crinkle.", href: EXTRAS, site: "Tokopedia · payperink.bsd" }
  ];

  var DEFAULT_SETTINGS = {
    plaPerKg: PLA_PER_KG,
    print: {}, // dihitung otomatis oleh syncPrint()
    food: { florentine500: 65000, lidahKucingMatcha500: 65000, cheddar500: 35000, cheddarPouch: 35000 },
    pack: {
      mnop: 55900, graciaExclusive: 90422, graciaJendela: 60745,
      b1bCube12: 10150, b1bSquare20: 13400, b1bSquare25: 18800, b1bGiftBag20: 11600, b1bBlurryL: 14700, cellophane: 2922,
      kraft: 1150, window: 14720, premium: 45500, tote: 1625, extras: 11700
    },
    // Centang Lisensi per item cetak (phone stand + clip berbagi satu lisensi yekta).
    licOn: { sabre: true, yekta: true, egg: true, myro: true },
    setsPerMonth: "20",
    sabreEur: "19",
    yektaUsd: "12",
    eurIdr: "18421",
    usdIdr: "16800",
    eggLicense: "0",
    myroLicense: "0",
    marginTarget: "60"
  };

  var DEFAULT_PACKAGES = [
    { id: "food-kecil", name: "Hutan Kecil", mode: "food", items: { tray: 1, eggcup: 1, clip: 1, cheddar500: 1 }, priceMode: "manual", manualPrice: 199000, labor: 10000, finalImage: null },
    { id: "food-sedang", name: "Hutan Sedang", mode: "food", items: { tray: 1, eggcup: 1, clip: 1, phonestand: 1, tree: 1, florentine500: 1 }, priceMode: "manual", manualPrice: 349000, labor: 15000, finalImage: null },
    { id: "food-besar", name: "Hutan Besar", mode: "food", items: { tray: 1, eggcup: 1, clip: 1, phonestand: 1, tree: 1, cheddar500: 1, mnop: 1 }, priceMode: "manual", manualPrice: 499000, labor: 25000, finalImage: null },
    { id: "nf-kecil", name: "Hutan Kecil", mode: "nf", items: { coaster: 2, eggcup: 1, clip: 1 }, priceMode: "manual", manualPrice: 99000, labor: 10000, finalImage: null },
    { id: "nf-sedang", name: "Hutan Sedang", mode: "nf", items: { coaster: 2, eggcup: 1, clip: 1, phonestand: 1, tree: 1 }, priceMode: "manual", manualPrice: 229000, labor: 15000, finalImage: null },
    { id: "nf-besar", name: "Hutan Besar", mode: "nf", items: { tray: 1, eggcup: 1, phonestand: 1, clip: 1, tree: 3, mnop: 1 }, priceMode: "manual", manualPrice: 399000, labor: 25000, finalImage: null }
  ];

  // Isi s.print dari harga filamen per kg (selalu otomatis, tidak bisa diisi manual).
  function syncPrint(s) {
    s.print = {};
    var perKg = typeof s.plaPerKg === "number" && isFinite(s.plaPerKg) ? s.plaPerKg : PLA_PER_KG;
    PRINT_ITEMS.forEach(function (it) {
      s.print[it.id] = printCost(it.grams, it.minutes, perKg);
    });
    return s;
  }
  syncPrint(DEFAULT_SETTINGS);
  function cloneSettings() { return syncPrint(JSON.parse(JSON.stringify(DEFAULT_SETTINGS))); }
  function clonePackages() { return JSON.parse(JSON.stringify(DEFAULT_PACKAGES)); }

  // ---------- Parsing & format (sama seperti canvas) ----------
  function parseIdr(raw) {
    var cleaned = String(raw).trim().replace(/Rp/gi, "").replace(/\s/g, "");
    if (!cleaned) return 0;
    if (cleaned.indexOf(",") >= 0 && cleaned.indexOf(".") >= 0) return Number(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
    if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) return Number(cleaned.replace(/\./g, "")) || 0;
    if (cleaned.indexOf(",") >= 0) return Number(cleaned.replace(",", ".")) || 0;
    var n = Number(cleaned);
    return isFinite(n) ? n : 0;
  }
  function parseDecimal(raw) {
    var n = Number(String(raw).trim().replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : 0;
  }
  function formatRp(n) {
    var v = Math.round(n);
    var s = Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (v < 0 ? "-Rp" : "Rp") + s;
  }
  function formatMinutes(mins) {
    var total = Math.max(0, Math.round(mins));
    var h = Math.floor(total / 60), m = total % 60;
    if (h <= 0) return m + " m";
    if (m === 0) return h + " j";
    return h + " j " + m + " m";
  }
  function formatPct(n) {
    var v = Math.round(n * 10) / 10;
    var s = v % 1 === 0 ? String(v) : v.toFixed(1).replace(".", ",");
    return s + "%";
  }
  function roundUpTo9k(n) {
    if (n <= 0) return 0;
    var base = Math.ceil((n - 9000) / 10000) * 10000 + 9000;
    return base < n ? base + 10000 : base;
  }
  function suggestedPrice(modal, marginPct) {
    if (modal <= 0) return 0;
    var t = Math.min(99, Math.max(0, marginPct)) / 100;
    if (t <= 0) return roundUpTo9k(modal);
    return roundUpTo9k(modal / (1 - t));
  }
  function qtyOf(pkg, id) {
    var q = pkg.items[id];
    return typeof q === "number" && q > 0 ? q : 0;
  }

  function licenseUnitCosts(s) {
    var sets = Math.max(1, parseDecimal(s.setsPerMonth));
    return {
      sabre: (parseDecimal(s.sabreEur) * parseDecimal(s.eurIdr)) / sets,
      yekta: (parseDecimal(s.yektaUsd) * parseDecimal(s.usdIdr)) / sets,
      egg: parseIdr(s.eggLicense),
      myro: parseIdr(s.myroLicense)
    };
  }
  function licensesFor(pkg, s) {
    var u = licenseUnitCosts(s), on = s.licOn || {};
    var sabre = on.sabre && qtyOf(pkg, "tray") > 0 ? u.sabre : 0;
    var yekta = on.yekta && (qtyOf(pkg, "phonestand") > 0 || qtyOf(pkg, "clip") > 0) ? u.yekta : 0; // sekali per paket
    var egg = on.egg && qtyOf(pkg, "eggcup") > 0 ? u.egg : 0;
    var myro = on.myro && qtyOf(pkg, "coaster") > 0 ? u.myro : 0;
    return { sabre: sabre, yekta: yekta, egg: egg, myro: myro, total: sabre + yekta + egg + myro };
  }
  function breakdown(pkg, s) {
    syncPrint(s);
    var print = 0, grams = 0, minutes = 0, food = 0, pack = 0;
    PRINT_ITEMS.forEach(function (it) {
      var q = qtyOf(pkg, it.id);
      print += q * (s.print[it.id] || 0); grams += q * it.grams; minutes += q * it.minutes;
    });
    if (pkg.mode !== "nf") FOOD_ITEMS.forEach(function (it) { food += qtyOf(pkg, it.id) * (s.food[it.id] || 0); });
    PACK_ITEMS.forEach(function (it) { pack += qtyOf(pkg, it.id) * (s.pack[it.id] || 0); });
    var lic = licensesFor(pkg, s);
    var labor = typeof pkg.labor === "number" && isFinite(pkg.labor) ? Math.max(0, Math.round(pkg.labor)) : 0;
    var modal = print + food + pack + lic.total + labor;
    var suggested = suggestedPrice(modal, parseDecimal(s.marginTarget));
    var price = pkg.priceMode === "margin" ? suggested : pkg.manualPrice;
    var profit = price - modal;
    var margin = price > 0 ? (profit / price) * 100 : 0;
    return { print: print, food: food, pack: pack, licenses: lic, labor: labor, modal: modal, grams: grams, minutes: minutes, price: price, profit: profit, margin: margin, suggested: suggested };
  }

  // Satu-satunya fungsi pengisi tabel ringkasan Paket Hutan (Food + No food).
  // Dipakai landing page (index.html) DAN hutan.html, jadi angkanya tidak mungkin beda.
  var SUMMARY_SIZES = [["kecil", "Kecil"], ["sedang", "Sedang"], ["besar", "Besar"]];
  function summaryRows(st) {
    function cells(pkgId) {
      var p = st.packages.filter(function (x) { return x.id === pkgId; })[0];
      if (!p) return ["—", "—", "—", "—"];
      var b = breakdown(p, st.settings);
      return [formatRp(b.price), formatRp(b.modal), formatPct(b.margin), formatMinutes(b.minutes)]; // urutan: Harga jual, Modal, Margin, Waktu
    }
    return SUMMARY_SIZES.map(function (sz) {
      return { size: sz[0], cells: [sz[1]].concat(cells("nf-" + sz[0]), cells("food-" + sz[0])) };
    });
  }
  function packageThumbItems(pkg) {
    var list = [];
    if (!pkg) return list;
    PRINT_ITEMS.concat(pkg.mode === "nf" ? [] : FOOD_ITEMS).forEach(function (it) {
      var q = qtyOf(pkg, it.id);
      if (q > 0) list.push({ item: it, qty: q });
    });
    return list;
  }
  function renderThumbGrid(pkg, isFood) {
    var cap = isFood ? 6 : 5;
    var items = packageThumbItems(pkg).slice(0, cap);
    var grid = document.createElement("div");
    grid.className = "sum-thumbs";
    grid.setAttribute("aria-label", "Isi paket");
    var i;
    for (i = 0; i < 6; i++) {
      var cell = document.createElement("div");
      cell.className = "sum-thumb";
      if (!isFood && i === 5) {
        cell.className += " is-ghost";
        cell.setAttribute("aria-hidden", "true");
      } else if (i < items.length) {
        var it = items[i].item, q = items[i].qty;
        cell.title = it.name;
        if (it.image) {
          var img = document.createElement("img");
          img.src = it.image;
          img.alt = it.name;
          img.width = 48;
          img.height = 48;
          cell.appendChild(img);
        } else {
          cell.className += " is-ph";
        }
        if (q > 1) {
          var badge = document.createElement("span");
          badge.className = "sum-thumb-qty";
          badge.textContent = "x" + q;
          cell.appendChild(badge);
        }
      } else {
        cell.className += " is-empty";
        cell.setAttribute("aria-hidden", "true");
      }
      grid.appendChild(cell);
    }
    return grid;
  }
  function renderFinalPhoto(pkg) {
    var box = document.createElement("div");
    var src = pkg && pkg.finalImage;
    var label = pkg
      ? ((pkg.name || "Paket") + " · " + (pkg.mode === "food" ? "Food" : "No food") + " (final)")
      : "Paket final";
    if (src) {
      box.className = "sum-final";
      var img = document.createElement("img");
      img.src = src;
      img.alt = label;
      box.appendChild(img);
    } else {
      box.className = "sum-final tile-noimg";
      box.setAttribute("aria-label", "No image");
    }
    return box;
  }
  function fillSummaryTable(tbody, st, opts) {
    if (!tbody) return;
    opts = opts || {};
    var showModal = opts.showModal !== false;
    var showMargin = opts.showMargin !== false;
    tbody.innerHTML = "";
    function textTd(v) {
      var td = document.createElement("td");
      td.textContent = v;
      return td;
    }
    function appendGroup(tr, pkgId, isFood) {
      var p = st.packages.filter(function (x) { return x.id === pkgId; })[0];
      var thumbTd = document.createElement("td");
      thumbTd.className = "g-start sum-thumbs-cell";
      var visual = document.createElement("div");
      visual.className = "sum-visual";
      visual.appendChild(renderThumbGrid(p, isFood));
      visual.appendChild(renderFinalPhoto(p));
      thumbTd.appendChild(visual);
      tr.appendChild(thumbTd);
      if (!p) {
        var emptyPill = document.createElement("td");
        var dash = document.createElement("span");
        dash.className = "price-pill";
        dash.textContent = "—";
        emptyPill.appendChild(dash);
        tr.appendChild(emptyPill);
        if (showModal) {
          var emptyModal = document.createElement("td");
          emptyModal.className = "sum-modal-cell";
          emptyModal.textContent = "—";
          tr.appendChild(emptyModal);
        }
        tr.appendChild(textTd("—"));
        return;
      }
      var b = breakdown(p, st.settings);
      var priceTd = document.createElement("td");
      var pill = document.createElement("span");
      pill.className = "price-pill";
      pill.textContent = formatRp(b.price);
      priceTd.appendChild(pill);
      tr.appendChild(priceTd);
      if (showModal) {
        var modalTd = document.createElement("td");
        modalTd.className = "sum-modal-cell";
        var wrap = document.createElement("div");
        wrap.className = "sum-modal";
        var amt = document.createElement("div");
        amt.className = "sum-modal-amt";
        amt.textContent = formatRp(b.modal);
        wrap.appendChild(amt);
        if (showMargin) {
          wrap.appendChild(document.createTextNode(" "));
          var pct = document.createElement("div");
          pct.className = "sum-modal-pct";
          pct.textContent = formatPct(b.margin);
          wrap.appendChild(pct);
        }
        modalTd.appendChild(wrap);
        tr.appendChild(modalTd);
      }
      tr.appendChild(textTd(formatMinutes(b.minutes)));
    }
    SUMMARY_SIZES.forEach(function (sz) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-size", sz[0]);
      tr.appendChild(textTd(sz[1]));
      appendGroup(tr, "nf-" + sz[0], false);
      appendGroup(tr, "food-" + sz[0], true);
      tbody.appendChild(tr);
    });
  }

  var core = {
    PRINT_ITEMS: PRINT_ITEMS, FOOD_ITEMS: FOOD_ITEMS, PACK_ITEMS: PACK_ITEMS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS, DEFAULT_PACKAGES: DEFAULT_PACKAGES,
    cloneSettings: cloneSettings, clonePackages: clonePackages, printCost: printCost, syncPrint: syncPrint,
    breakdown: breakdown, licenseUnitCosts: licenseUnitCosts, formatRp: formatRp, formatPct: formatPct,
    formatMinutes: formatMinutes, parseIdr: parseIdr,
    summaryRows: summaryRows, fillSummaryTable: fillSummaryTable
  };
  var ITEM_RENAMES = { edam500: "cheddar500" };
  var KNOWN_ITEMS = {};
  PRINT_ITEMS.concat(FOOD_ITEMS, PACK_ITEMS).forEach(function (it) { KNOWN_ITEMS[it.id] = true; });
  var FOOD_IDS = {};
  FOOD_ITEMS.forEach(function (it) { FOOD_IDS[it.id] = true; });
  function isFoodId(id) { return !!FOOD_IDS[id]; }
  var MAX_PRINT_ITEMS = 5;
  var MAX_FOOD_ITEMS = 1;
  function isPrintId(id) { return PRINT_ITEMS.some(function (it) { return it.id === id; }); }
  function selectedCatalog(pkg, list) {
    return list.filter(function (it) { return qtyOf(pkg, it.id) > 0; });
  }
  function clampGroup(pkg, list, max) {
    var n = 0;
    list.forEach(function (it) {
      if (!(qtyOf(pkg, it.id) > 0)) return;
      n += 1;
      if (n > max) delete pkg.items[it.id];
    });
  }
  function stripFoodFromNf(pkg) {
    if (!pkg || pkg.mode !== "nf" || !pkg.items) return pkg;
    Object.keys(pkg.items).forEach(function (id) { if (FOOD_IDS[id]) delete pkg.items[id]; });
    return pkg;
  }
  function clampPackageItems(pkg) {
    if (!pkg || !pkg.items) return pkg;
    if (pkg.mode === "nf") stripFoodFromNf(pkg);
    else clampGroup(pkg, FOOD_ITEMS, MAX_FOOD_ITEMS);
    clampGroup(pkg, PRINT_ITEMS, MAX_PRINT_ITEMS);
    return pkg;
  }
  function canSelectItem(pkg, id) {
    if (qtyOf(pkg, id) > 0) return true;
    if (isFoodId(id)) return pkg.mode !== "nf" && selectedCatalog(pkg, FOOD_ITEMS).length < MAX_FOOD_ITEMS;
    if (isPrintId(id)) return selectedCatalog(pkg, PRINT_ITEMS).length < MAX_PRINT_ITEMS;
    return true;
  }

  function loadState() {
    var st = { settings: cloneSettings(), packages: clonePackages(), mode: "food" };
    try {
      var ls = typeof localStorage !== "undefined" ? localStorage : null;
      var raw = ls ? ls.getItem(STORAGE_KEY) : null;
      if (!raw) return st;
      var saved = JSON.parse(raw);
      if (saved && saved.settings) {
        var s = saved.settings;
        // Harga cetak per item (termasuk harga manual versi lama) sengaja diabaikan: selalu ikut rumus filamen per kg.
        ["food", "pack"].forEach(function (g) {
          if (s[g]) Object.keys(st.settings[g]).forEach(function (k) {
            if (typeof s[g][k] === "number" && isFinite(s[g][k])) st.settings[g][k] = s[g][k];
          });
        });
        if (s.licOn && typeof s.licOn === "object") Object.keys(st.settings.licOn).forEach(function (k) {
          if (typeof s.licOn[k] === "boolean") st.settings.licOn[k] = s.licOn[k];
        });
        else if (s.licensesOn === false) Object.keys(st.settings.licOn).forEach(function (k) { st.settings.licOn[k] = false; }); // toggle lama
        if (typeof s.plaPerKg === "number" && isFinite(s.plaPerKg) && s.plaPerKg >= 0) st.settings.plaPerKg = s.plaPerKg;
        Object.keys(st.settings).forEach(function (k) {
          if (k === "print" || k === "food" || k === "pack" || k === "plaPerKg" || k === "printOverride" || k === "licOn") return;
          if (k in s && typeof s[k] === typeof st.settings[k]) st.settings[k] = s[k];
        });
      }
      if (saved && Array.isArray(saved.packages)) {
        st.packages.forEach(function (p) {
          var sp = saved.packages.filter(function (x) { return x && x.id === p.id; })[0];
          if (!sp) return;
          if (sp.items && typeof sp.items === "object") {
            var items = {};
            Object.keys(sp.items).forEach(function (k) {
              var v = Number(sp.items[k]);
              var id = ITEM_RENAMES[k] || k; // Edam lama otomatis jadi Cheese Stick Cheddar
              if (!KNOWN_ITEMS[id] || !(v > 0)) return; // abaikan barang lama yang sudah dihapus (mis. jar500, mede)
              items[id] = (items[id] || 0) + Math.floor(v);
            });
            p.items = items;
          }
          clampPackageItems(p);
          if (sp.priceMode === "manual" || sp.priceMode === "margin") p.priceMode = sp.priceMode;
          if (typeof sp.manualPrice === "number" && isFinite(sp.manualPrice)) p.manualPrice = sp.manualPrice;
          if (typeof sp.labor === "number" && isFinite(sp.labor)) p.labor = Math.max(0, Math.round(sp.labor));
          if (typeof sp.finalImage === "string" && sp.finalImage) p.finalImage = sp.finalImage;
          else if (sp.finalImage === null) p.finalImage = null;
        });
      }
      if (saved && (saved.mode === "food" || saved.mode === "nf")) st.mode = saved.mode;
    } catch (e) { /* data rusak: pakai default */ }
    syncPrint(st.settings);
    return st;
  }
  core.loadState = loadState;
  core.STORAGE_KEY = STORAGE_KEY;
  if (typeof module !== "undefined" && module.exports) module.exports = core;
  if (typeof window !== "undefined") window.KalkulatorSore = core;
  // Halaman detail saja yang punya #cards; landing page cuma pakai core.
  if (typeof document === "undefined" || !document.getElementById("cards")) return;

  // ---------- State + localStorage ----------
  var state = loadState();

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        flashSaved();
      } catch (e) { /* storage penuh/diblokir */ }
    }, 250);
  }
  function flashSaved() {
    var el = document.getElementById("save-status");
    if (!el) return;
    el.textContent = "Tersimpan otomatis di browser ini";
    el.classList.add("is-on");
    clearTimeout(flashSaved.t);
    flashSaved.t = setTimeout(function () { el.classList.remove("is-on"); }, 1500);
  }

  // ---------- DOM helpers ----------
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }
  function badge(text, cls) { return h("span", { class: "badge " + (cls || ""), text: text }); }

  // Input rupiah: tampil "Rp" + titik ribuan, disimpan sebagai angka.
  function groupDigits(d) { return d.replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function moneyInput(attrs, onNumber) {
    var input = h("input", Object.assign({ type: "text", inputmode: "numeric", autocomplete: "off", class: "money-input" }, attrs));
    input.addEventListener("input", function () {
      var raw = input.value, caret = input.selectionStart == null ? raw.length : input.selectionStart;
      var before = raw.slice(0, caret).replace(/\D/g, "").length;
      var digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
      var out = groupDigits(digits);
      input.value = out;
      var pos = 0, seen = 0;
      while (pos < out.length && seen < before) { if (/\d/.test(out[pos])) seen++; pos++; }
      try { input.setSelectionRange(pos, pos); } catch (e) {}
      onNumber(digits ? Number(digits) : 0);
    });
    input.addEventListener("blur", function () { if (!input.value) input.value = "0"; });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") e.preventDefault(); });
    input.setValue = function (n) { input.value = groupDigits(String(Math.max(0, Math.round(Number(n) || 0)))); };
    return input;
  }
  function moneyBox(input) { return h("div", { class: "money" }, [h("span", { class: "money-pre", "aria-hidden": "true", text: "Rp" }), input]); }

  function field(label, value, onInput, opts) {
    opts = opts || {};
    var id = "f-" + Math.random().toString(36).slice(2, 9);
    var control;
    if (opts.money) {
      var mi = moneyInput({ id: id }, onInput);
      mi.setValue(parseIdr(value));
      control = moneyBox(mi);
    } else {
      control = h("input", {
        id: id, type: "text", inputmode: opts.decimal ? "decimal" : "numeric", value: String(value),
        oninput: function (e) { onInput(e.target.value); }
      });
    }
    return h("div", { class: "field" }, [h("label", { for: id, text: label }), control, opts.note ? h("p", { class: "note", text: opts.note }) : null]);
  }

  // ---------- Render: settings ----------
  var plaInput = null, printTiles = [];
  function licLabel(key, u) {
    if (key === "cc0") return "Rp0 · CC0";
    var v = u[key] || 0;
    return v > 0 ? formatRp(v) + "/set" : "TBD";
  }
  function updatePrintTiles() {
    var s = state.settings;
    syncPrint(s);
    if (plaInput && document.activeElement !== plaInput) plaInput.setValue(s.plaPerKg);
    var u = licenseUnitCosts(s);
    printTiles.forEach(function (t) {
      t.price.textContent = formatRp(s.print[t.id]);
      if (!t.lic) return;
      var txt = licLabel(t.key, u);
      t.licPrice.textContent = txt;
      t.licPrice.classList.toggle("is-tbd", txt === "TBD");
      if (t.key !== "cc0") { t.lic.checked = !!(s.licOn || {})[t.key]; t.row.classList.toggle("is-off", !t.lic.checked); }
    });
  }
  function setField(key, value) { state.settings[key] = value; recalc(); save(); }
  function setUnit(group, id, n) { state.settings[group][id] = Math.max(0, Math.round(Number(n) || 0)); recalc(); save(); }

  function renderSettings() {
    var s = state.settings;
    var root = document.getElementById("asumsi-fields");
    root.innerHTML = "";
    root.appendChild(h("div", { class: "grid g2 asumsi-grid" }, [
      field("Target margin, persen", s.marginTarget, function (v) { setField("marginTarget", v); }, { decimal: true }),
      field("Set per bulan", s.setsPerMonth, function (v) { setField("setsPerMonth", v); }, { note: "Perkiraan jumlah paket terjual per bulan, untuk membagi iuran lisensi." })
    ]));
    root.appendChild(h("div", { class: "asumsi-info asumsi-labor" }, [
      h("div", { class: "asumsi-labor-title", text: "Tenaga kerja default (Food & No food)" }),
      h("ul", {}, [
        h("li", {}, [
          h("span", { class: "asumsi-labor-size", text: "Kecil" }),
          h("span", { class: "asumsi-labor-amt" }, [
            "Rp10.000",
            h("span", { class: "asumsi-labor-mins", text: " (±20 menit)" })
          ])
        ]),
        h("li", {}, [
          h("span", { class: "asumsi-labor-size", text: "Sedang" }),
          h("span", { class: "asumsi-labor-amt" }, [
            "Rp15.000",
            h("span", { class: "asumsi-labor-mins", text: " (±30 menit)" })
          ])
        ]),
        h("li", {}, [
          h("span", { class: "asumsi-labor-size", text: "Besar" }),
          h("span", { class: "asumsi-labor-amt" }, [
            "Rp25.000",
            h("span", { class: "asumsi-labor-mins", text: " (±50 menit)" })
          ])
        ])
      ]),
      h("p", { class: "asumsi-labor-note", text: "Asumsi ±Rp30.000/jam untuk rakit, finishing, dan wrapping. Dapat diubah pada setiap kartu Isi paket." })
    ]));

    var plaBox = document.getElementById("pla-field");
    if (plaBox) {
      plaBox.innerHTML = "";
      plaInput = moneyInput({ id: "pla-per-kg" }, function (n) { state.settings.plaPerKg = Math.max(0, Math.round(n)); recalc(); save(); });
      plaInput.setValue(s.plaPerKg);
      plaBox.appendChild(h("label", { for: "pla-per-kg", text: "Harga filamen per kg" }));
      plaBox.appendChild(moneyBox(plaInput));
    }

    var pg = document.getElementById("print-fields");
    pg.innerHTML = "";
    printTiles = [];
    PRINT_ITEMS.forEach(function (it) {
      var id = "pf-" + it.id;
      var priceEl = h("div", { class: "tile-price", id: id, "aria-live": "polite" });
      var key = it.lic, licId = "lic-" + it.id;
      var licBox = h("input", { type: "checkbox", id: licId, "data-lic": key });
      if (key === "cc0") { licBox.checked = true; licBox.disabled = true; }
      else licBox.addEventListener("change", function () { state.settings.licOn[key] = licBox.checked; recalc(); save(); });
      var licPrice = h("span", { class: "tile-lic-price" });
      var licRow = h("label", { class: "tile-lic", for: licId,
        title: key === "yekta" ? "Satu lisensi yekta dipakai phone stand dan clip, dihitung sekali per paket." : key === "cc0" ? "Desain CC0, gratis." : key === "sabre" ? "Langganan Sabre dibagi jumlah set per bulan." : "Harga lisensi belum tersedia. Masukkan di Asumsi hitungan apabila sudah pasti." },
        [licBox, h("span", { class: "tile-lic-name", text: "Lisensi" }), licPrice]);
      pg.appendChild(h("div", { class: "print-tile" }, [
        h("div", { class: "tile-img" }, [it.image ? h("img", { src: it.image, alt: it.name, loading: "lazy", width: "300", height: "300" }) : null]),
        it.mw ? h("a", { class: "tile-name tile-link", href: "https://makerworld.com/en/models/" + it.mw.replace(/^MW/, ""), target: "_blank", rel: "noopener noreferrer", title: "Buka di MakerWorld" }, [it.name, h("span", { class: "ext", "aria-hidden": "true", text: " ↗" })])
          : h("div", { class: "tile-name", text: it.name }),
        h("div", { class: "tile-meta", text: it.grams + " g · " + formatMinutes(it.minutes) }),
        priceEl,
        licRow
      ]));
      printTiles.push({ id: it.id, price: priceEl, key: key, lic: licBox, licPrice: licPrice, row: licRow });
    });
    updatePrintTiles();

    renderPriceTiles("food-fields", "food", FOOD_ITEMS, false);
    renderPriceTiles("pack-fields", "pack", PACK_ITEMS, true);
  }

  // Tile harga kue / kemasan: gambar, nama (link toko untuk kemasan), keterangan singkat, input rupiah.
  function renderPriceTiles(elId, group, items, withLink) {
    var root = document.getElementById(elId);
    if (!root) return;
    root.innerHTML = "";
    var s = state.settings;
    items.forEach(function (it) {
      var id = (group === "food" ? "ff-" : "kf-") + it.id;
      var mi = moneyInput({ id: id, "aria-label": "Harga " + it.name }, function (n) { setUnit(group, it.id, n); });
      mi.setValue(s[group][it.id]);
      var img = it.image
        ? h("div", { class: "tile-img" }, [h("img", { src: it.image, alt: it.name, loading: "lazy", width: "300", height: "300" })])
        : h("div", { class: "tile-img tile-noimg", "aria-hidden": "true" }, [h("span", { text: "No image" })]);
      var name = withLink && it.href
        ? h("a", { class: "tile-name tile-link", href: it.href, target: "_blank", rel: "noopener noreferrer", title: "Buka di " + (it.site || "toko") }, [it.name, h("span", { class: "ext", "aria-hidden": "true", text: " ↗" })])
        : h("div", { class: "tile-name", text: it.name });
      var tile = h("div", { class: "print-tile price-tile" + (it.unconfirmed ? " is-unconfirmed" : "") }, [
        img, name,
        h("div", { class: "tile-meta", text: it.desc || "" }),
        moneyBox(mi)
      ]);
      if (it.note) tile.title = it.note;
      root.appendChild(tile);
    });
  }

  // ---------- Render: package cards ----------
  var cardRefs = {};

  function setQty(pkg, id, q) {
    q = Math.max(0, Math.floor(q) || 0);
    if (pkg.mode === "nf" && isFoodId(id)) q = 0;
    if (q > 0 && qtyOf(pkg, id) === 0 && !canSelectItem(pkg, id)) return;
    if (q > 0) pkg.items[id] = q; else delete pkg.items[id];
    updateCard(pkg); renderSummary(); save();
  }

  function itemRow(pkg, it, group, refs) {
    var fallback = it.id === "coaster" ? 2 : 1;
    var check = h("button", { type: "button", class: "check", onclick: function () { setQty(pkg, it.id, qtyOf(pkg, it.id) > 0 ? 0 : fallback); } }, ["✓"]);
    var qty = h("input", {
      type: "number", min: "0", inputmode: "numeric", class: "qty", "aria-label": "Jumlah " + it.name,
      oninput: function (e) { setQty(pkg, it.id, parseFloat(String(e.target.value).replace(",", "."))); },
      onkeydown: function (e) { if (e.key === "Enter") e.preventDefault(); }
    });
    var minus = h("button", { type: "button", class: "step", "aria-label": "Kurangi", onclick: function () { setQty(pkg, it.id, qtyOf(pkg, it.id) - 1); } }, ["−"]);
    var plus = h("button", { type: "button", class: "step", "aria-label": "Tambah", onclick: function () { setQty(pkg, it.id, qtyOf(pkg, it.id) + 1); } }, ["+"]);
    var unitEl = h("span");
    var lineEl = h("div", { class: "line-total" });

    var nameRow = h("div", { class: "item-name" }, [h("span", { text: it.name }),
      it.unconfirmed ? badge("belum pasti") : null, it.estimate ? badge("estimasi", "est") : null]);
    var meta = [];
    if (group === "print") meta.push(h("div", { class: "item-meta" }, [it.mw + " · " + it.grams + " g · " + formatMinutes(it.minutes) + " · ", unitEl]));
    else meta.push(h("div", { class: "item-meta" }, [unitEl, " / pcs"]));
    if (group === "print") meta.push(h("div", { class: "item-lic", text: it.license }));
    if (it.href) meta.push(h("a", { class: "item-link", href: it.href, target: "_blank", rel: "noopener noreferrer", text: it.site || "Lihat toko" }));

    var row = h("div", { class: "item-row" }, [
      it.image ? h("div", { class: "thumb" }, [h("img", { src: it.image, alt: it.name, loading: "lazy", width: "64", height: "64" })]) : null,
      h("div", { class: "item-info" }, [nameRow].concat(meta)),
      h("div", { class: "item-ctrl" }, [h("div", { class: "stepper" }, [check, minus, qty, plus]), lineEl])
    ]);
    refs.items.push({ id: it.id, group: group, check: check, qty: qty, unitEl: unitEl, lineEl: lineEl, row: row });
    return row;
  }

  function priceBtn(pkg, mode, label) {
    return h("button", { type: "button", class: "pill", "data-mode": mode, onclick: function () { pkg.priceMode = mode; updateCard(pkg); renderSummary(); save(); } }, [label]);
  }

  var GROUPS = [
    { key: "print", title: "Cetak 3D", items: PRINT_ITEMS },
    { key: "food", title: "Food", items: FOOD_ITEMS },
    { key: "pack", title: "Kemasan", items: PACK_ITEMS }
  ];

  // Baris ringkas di kartu: cuma barang yang dipilih (qty > 0).
  function compactRow(pkg, it, group) {
    var q = qtyOf(pkg, it.id);
    var unit = state.settings[group][it.id] || 0;
    var key = pkg.id + ":" + it.id;
    return h("div", { class: "sel-row" }, [
      it.image ? h("div", { class: "thumb sm" }, [h("img", { src: it.image, alt: "", loading: "lazy", width: "40", height: "40" })]) : null,
      h("div", { class: "sel-info" }, [
        h("div", { class: "sel-name" }, [h("span", { text: it.name }), it.unconfirmed ? badge("belum pasti") : null, it.estimate ? badge("estimasi", "est") : null]),
        h("div", { class: "sel-meta", text: formatRp(unit) + " / pcs" })
      ]),
      h("div", { class: "sel-ctrl" }, [
        h("div", { class: "stepper sm" }, [
          h("button", { type: "button", class: "step", "data-focus": key + ":-", "aria-label": "Kurangi " + it.name, onclick: function () { setQty(pkg, it.id, qtyOf(pkg, it.id) - 1); } }, ["−"]),
          h("span", { class: "qty-val", "aria-live": "polite", text: String(q) }),
          h("button", { type: "button", class: "step", "data-focus": key + ":+", "aria-label": "Tambah " + it.name, onclick: function () { setQty(pkg, it.id, qtyOf(pkg, it.id) + 1); } }, ["+"])
        ]),
        h("div", { class: "line-total", text: formatRp(q * unit) })
      ])
    ]);
  }

  function renderSelected(pkg, refs) {
    var active = document.activeElement;
    var focusKey = active && active.getAttribute ? active.getAttribute("data-focus") : null;
    GROUPS.forEach(function (g) {
      if (!refs.sections[g.key]) return;
      var body = refs.sections[g.key].body;
      body.innerHTML = "";
      var chosen = g.items.filter(function (it) { return qtyOf(pkg, it.id) > 0; });
      if (!chosen.length) body.appendChild(h("div", { class: "sel-empty", text: "Belum ada barang" }));
      chosen.forEach(function (it) { body.appendChild(compactRow(pkg, it, g.key)); });
      var btn = refs.sections[g.key].btn;
      btn.textContent = chosen.length ? "Ubah" : "+ Pilih";
      btn.setAttribute("aria-label", (chosen.length ? "Ubah " : "Pilih ") + g.title + " untuk " + pkg.name);
    });
    if (focusKey && focusKey.indexOf(pkg.id + ":") === 0) {
      var again = refs.card.querySelector('[data-focus="' + focusKey + '"]');
      if (again) again.focus();
    }
  }

  // ---------- Popup pilihan ----------
  var picker = null; // { pkg, group, refs, opener }
  var modalEl = null;

  function buildModal() {
    modalEl = h("div", { class: "modal-backdrop", hidden: true });
    var dialog = h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title" }, [
      h("div", { class: "modal-head" }, [
        h("div", {}, [h("h3", { id: "modal-title" }), h("p", { class: "modal-sub muted small" }), h("p", { class: "picker-limit", hidden: true })]),
        h("button", { type: "button", class: "modal-x", "aria-label": "Tutup", onclick: closePicker }, ["×"])
      ]),
      h("div", { class: "modal-body" }),
      h("div", { class: "modal-foot" }, [
        h("span", { class: "modal-total muted small" }),
        h("button", { type: "button", class: "btn modal-done", onclick: closePicker }, ["Selesai"])
      ])
    ]);
    modalEl.appendChild(dialog);
    modalEl.addEventListener("mousedown", function (e) { if (e.target === modalEl) closePicker(); });
    document.addEventListener("keydown", function (e) {
      if (!picker) return;
      if (e.key === "Escape") { e.preventDefault(); closePicker(); return; }
      if (e.key === "Tab") {
        var f = [].slice.call(dialog.querySelectorAll("button, input, a[href]")).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.body.appendChild(modalEl);
  }

  function openPicker(pkg, groupKey, opener) {
    if (pkg.mode === "nf" && groupKey === "food") return;
    if (!modalEl) buildModal();
    var g = GROUPS.filter(function (x) { return x.key === groupKey; })[0];
    if (!g) return;
    var refs = { items: [] };
    picker = { pkg: pkg, group: groupKey, refs: refs, opener: opener };
    modalEl.querySelector("#modal-title").textContent = "Pilih " + g.title;
    modalEl.querySelector(".modal-sub").textContent = pkg.name + " · " + (pkg.mode === "food" ? "Food" : "No food") + ". Centang barang dan atur jumlahnya.";
    var body = modalEl.querySelector(".modal-body");
    body.innerHTML = "";
    g.items.forEach(function (it) { body.appendChild(itemRow(pkg, it, groupKey, refs)); });
    body.scrollTop = 0;
    modalEl.hidden = false;
    document.body.classList.add("modal-open");
    updatePicker();
    modalEl.querySelector(".modal-done").focus();
  }

  function groupLimit(group) {
    if (group === "print") return { max: MAX_PRINT_ITEMS, list: PRINT_ITEMS, note: "Maksimal 5 barang cetak" };
    if (group === "food") return { max: MAX_FOOD_ITEMS, list: FOOD_ITEMS, note: "Maksimal 1 kue" };
    return null;
  }
  function updatePicker() {
    if (!picker) return;
    var pkg = picker.pkg, s = state.settings, sum = 0;
    var cap = groupLimit(picker.group);
    var atLimit = !!(cap && selectedCatalog(pkg, cap.list).length >= cap.max);
    var note = modalEl.querySelector(".picker-limit");
    if (note) { note.hidden = !atLimit; note.textContent = atLimit ? cap.note : ""; }
    picker.refs.items.forEach(function (r) {
      var q = qtyOf(pkg, r.id);
      var unit = s[r.group][r.id] || 0;
      sum += q * unit;
      r.check.classList.toggle("on", q > 0);
      r.check.setAttribute("aria-label", q > 0 ? "Lepas dari paket" : "Masukkan ke paket");
      r.check.setAttribute("aria-pressed", q > 0 ? "true" : "false");
      r.row.classList.toggle("is-on", q > 0);
      var locked = atLimit && q === 0;
      r.row.classList.toggle("is-locked", locked);
      r.check.disabled = locked;
      r.row.querySelectorAll(".step, .qty").forEach(function (el) { el.disabled = locked; });
      if (document.activeElement !== r.qty) r.qty.value = String(q);
      r.unitEl.textContent = formatRp(unit);
      r.lineEl.textContent = q > 0 ? formatRp(q * unit) : "";
    });
    var b = breakdown(pkg, s);
    modalEl.querySelector(".modal-total").textContent = "Subtotal bagian ini " + formatRp(sum) + " · Total modal " + formatRp(b.modal);
  }

  function closePicker() {
    if (!picker) return;
    var opener = picker.opener;
    picker = null;
    modalEl.hidden = true;
    document.body.classList.remove("modal-open");
    if (opener && document.body.contains(opener)) opener.focus();
  }

  function renderCards() {
    if (picker) closePicker();
    var root = document.getElementById("cards");
    root.innerHTML = "";
    cardRefs = {};
    state.packages.filter(function (p) { return p.mode === state.mode; }).forEach(function (pkg) {
      var refs = { sections: {} };
      var sectionEls = GROUPS.filter(function (g) { return !(pkg.mode === "nf" && g.key === "food"); }).map(function (g) {
        var btn = h("button", { type: "button", class: "pick-btn", onclick: function () { openPicker(pkg, g.key, btn); } }, ["Ubah"]);
        var body = h("div", { class: "sel-list" });
        refs.sections[g.key] = { btn: btn, body: body };
        return h("section", { class: "card-sec", "data-group": g.key }, [
          h("div", { class: "sec-head" }, [h("div", { class: "group-title", text: g.title }), btn]),
          body
        ]);
      });

      refs.laborWrap = h("div", { class: "labor-field" }, [
        h("label", { text: "Tenaga kerja" }),
        moneyBox(refs.laborInput = moneyInput({ "aria-label": "Tenaga kerja " + pkg.name + " " + (pkg.mode === "food" ? "Food" : "No food") }, function (n) {
          pkg.labor = Math.max(0, Math.round(n)); updateCard(pkg); renderSummary(); save();
        }))
      ]);
      refs.totals = h("div", { class: "totals" });
      refs.manualWrap = h("div", { class: "manual" }, [
        h("label", { text: "Harga jual" }),
        moneyBox(refs.manualInput = moneyInput({ "aria-label": "Harga jual " + pkg.name }, function (n) { pkg.manualPrice = Math.max(0, Math.round(n)); updateCard(pkg); renderSummary(); save(); }))
      ]);
      refs.suggested = h("div", { class: "suggested" });
      refs.price = h("div", { class: "price" });
      refs.margin = h("span"); refs.profit = h("span");
      refs.pills = [priceBtn(pkg, "manual", "Harga manual"), priceBtn(pkg, "margin", "Target margin")];

      var card = h("article", { class: "card", "data-pkg": pkg.id }, [
        h("h3", { text: pkg.name }),
        h("div", { class: "card-mode", text: pkg.mode === "food" ? "Food" : "No food" })].concat(sectionEls, [
        refs.laborWrap,
        refs.totals,
        h("div", { class: "pills" }, refs.pills),
        refs.manualWrap, refs.suggested, refs.price,
        h("div", { class: "pm" }, [refs.margin, refs.profit])
      ]));
      refs.card = card;
      cardRefs[pkg.id] = refs;
      root.appendChild(card);
      updateCard(pkg);
    });
  }

  function updateCard(pkg) {
    if (picker && picker.pkg === pkg) updatePicker();
    var refs = cardRefs[pkg.id];
    if (!refs) return;
    var s = state.settings;
    var b = breakdown(pkg, s);
    renderSelected(pkg, refs);
    var lines = [["Modal cetak", b.print, false], ["Lisensi", b.licenses.total, true], ["Food", b.food, true], ["Kemasan", b.pack, true], ["Tenaga kerja", b.labor, true]];
    refs.totals.innerHTML = "";
    lines.forEach(function (l) {
      if (l[2] && Math.round(l[1]) === 0) return;
      refs.totals.appendChild(h("div", { class: "tline" }, [h("span", { text: l[0] }), h("span", { text: formatRp(l[1]) })]));
    });
    refs.totals.appendChild(h("div", { class: "tline total" }, [h("span", { text: "Total modal" }), h("span", { class: "modal-val", text: formatRp(b.modal) })]));
    refs.totals.appendChild(h("div", { class: "muted small", text: b.grams + " g · " + formatMinutes(b.minutes) + " cetak" }));
    refs.pills.forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-mode") === pkg.priceMode); });
    refs.manualWrap.hidden = pkg.priceMode !== "manual";
    refs.suggested.hidden = pkg.priceMode !== "margin";
    if (document.activeElement !== refs.laborInput) refs.laborInput.setValue(typeof pkg.labor === "number" ? pkg.labor : 0);
    if (document.activeElement !== refs.manualInput) refs.manualInput.setValue(pkg.manualPrice);
    refs.suggested.textContent = "Harga disarankan (dibulatkan ke ...9.000): " + formatRp(b.suggested);
    refs.price.textContent = formatRp(b.price);
    refs.margin.textContent = "Margin " + formatPct(b.margin);
    refs.profit.textContent = "Laba " + formatRp(b.profit);
  }

  function renderSummary() {
    fillSummaryTable(document.querySelector("#sore-summary tbody"), state);
  }

  function recalc() {
    updatePrintTiles();
    state.packages.forEach(updateCard);
    renderSummary();
  }

  function renderMode() {
    document.querySelectorAll(".seg button").forEach(function (b) {
      var on = b.getAttribute("data-mode") === state.mode;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function renderAll() {
    renderSettings();
    renderMode();
    renderCards();
    renderSummary();
  }

  document.querySelectorAll(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      state.mode = b.getAttribute("data-mode");
      renderMode(); renderCards(); renderSummary(); save();
    });
  });
  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Kembalikan semua isian ke default? Perubahan yang tersimpan akan dihapus.")) return;
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    clearTimeout(saveTimer);
    state = { settings: cloneSettings(), packages: clonePackages(), mode: "food" };
    renderAll();
  });

  renderAll();
  window.__kalkulator = { core: core, getState: function () { return state; } };
})();
