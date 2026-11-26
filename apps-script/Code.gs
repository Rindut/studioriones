/**
 * Backend sinkronisasi Studio Riones.
 * Terikat ke Google Sheet: tab "data" (A1 JSON, B1 updatedAt ISO, C1 updatedBy)
 * dan tab "history" (append-only: timestamp, updatedBy, json).
 *
 * Set Script Property SYNC_TOKEN, lalu deploy sebagai Web app:
 * Execute as Me, Who has access: Anyone.
 */

var DATA_TAB = "data";
var HISTORY_TAB = "history";

function getToken_() {
  return PropertiesService.getScriptProperties().getProperty("SYNC_TOKEN") || "";
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function tokenFromGet_(e) {
  return (e && e.parameter && e.parameter.token) ? String(e.parameter.token) : "";
}

function readBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function unauthorized_() {
  return jsonOut_({ error: "unauthorized" });
}

function ensureSheets_() {
  var ss = SpreadsheetApp.getActive();
  if (!ss) throw new Error("Script harus dibuka dari Google Sheet (Extensions > Apps Script).");
  var data = ss.getSheetByName(DATA_TAB);
  if (!data) data = ss.insertSheet(DATA_TAB);
  var hist = ss.getSheetByName(HISTORY_TAB);
  if (!hist) {
    hist = ss.insertSheet(HISTORY_TAB);
    hist.appendRow(["updatedAt", "updatedBy", "json"]);
  }
  return { data: data, hist: hist };
}

/** Jalankan sekali dari editor (tombol Run) untuk membuat tab dan meminta izin. */
function setupSheets() {
  ensureSheets_();
}

function doGet(e) {
  if (!getToken_() || tokenFromGet_(e) !== getToken_()) return unauthorized_();
  var sh = ensureSheets_().data;
  var raw = String(sh.getRange("A1").getValue() || "");
  var updatedAt = String(sh.getRange("B1").getValue() || "");
  var data = null;
  if (raw) {
    try { data = JSON.parse(raw); } catch (err) { data = null; }
  }
  return jsonOut_({ data: data, updatedAt: updatedAt });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var body = readBody_(e);
    var token = body && body.token ? String(body.token) : tokenFromGet_(e);
    if (!getToken_() || token !== getToken_()) return unauthorized_();
    var data = body.data;
    if (data == null || typeof data !== "object") {
      return jsonOut_({ error: "invalid_data" });
    }
    var updatedBy = body.updatedBy != null ? String(body.updatedBy) : "";
    var now = new Date().toISOString();
    var sheets = ensureSheets_();
    sheets.data.getRange("A1").setValue(JSON.stringify(data));
    sheets.data.getRange("B1").setValue(now);
    sheets.data.getRange("C1").setValue(updatedBy);
    sheets.hist.appendRow([now, updatedBy, JSON.stringify(data)]);
    return jsonOut_({ ok: true, updatedAt: now });
  } finally {
    lock.releaseLock();
  }
}
