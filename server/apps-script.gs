/* =====================================================================
 * 対人スキル診断 — 集計用バックエンド（Google Apps Script）
 *
 * GitHub Pages は静的配信なので、送信されたデータを受ける場所が別に要る。
 * このファイルをスプレッドシートに紐づくスクリプトとして貼り、
 * ウェブアプリとしてデプロイして、その /exec URL を config.js に書く。
 * 手順は README の「集計を有効にする」を参照。
 *
 * 設計方針
 *  - 受け取るのは 6技術の到達度・総合値・タイプ・日付だけ。
 *    個人を指すものは何も受け取らないし、記録もしない。
 *  - IP・User-Agent は Apps Script 側からそもそも参照できない。
 *    こちらからも一切書き出さない。
 *  - 平均は MIN_N 人に達するまで返さない（少人数だと平均から個人の値が
 *    逆算できてしまうため）。
 * ===================================================================== */

var SHEET_NAME = 'responses';
var MIN_N = 5;                  // config.js の minN と揃える
var CACHE_SECONDS = 60;         // 集計結果のキャッシュ
var TYPE_IDS = ['mediator', 'listener', 'analyst', 'caretaker', 'direct', 'avoidant', 'reactive', 'novice'];
var AXES = ['R', 'L', 'C', 'S', 'B', 'M'];

/* ---------- 受信 ----------------------------------------------------- */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ ok: false });
    if (e.postData.contents.length > 2000) return json({ ok: false });

    var d = JSON.parse(e.postData.contents);
    if (!isValid(d)) return json({ ok: false });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sh = sheet();
      var row = [safeDate(d.date), d.type, d.rom];
      for (var i = 0; i < AXES.length; i++) row.push(d[AXES[i]]);
      sh.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    CacheService.getScriptCache().remove('stats');
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false });
  }
}

function isValid(d) {
  if (!d || d.v !== 1) return false;
  if (TYPE_IDS.indexOf(d.type) < 0) return false;
  if (!isScore(d.rom)) return false;
  for (var i = 0; i < AXES.length; i++) {
    if (!isScore(d[AXES[i]])) return false;
  }
  return true;
}

function isScore(v) {
  return typeof v === 'number' && isFinite(v) && v >= 0 && v <= 100 && v === Math.round(v);
}

/* 日付だけを残す。壊れていればサーバー側の日付を使う（時刻は持たない）。 */
function safeDate(v) {
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
}

/* ---------- 集計の返却 ----------------------------------------------- */

function doGet() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('stats');
  if (hit) return json(JSON.parse(hit));

  var out = aggregate();
  cache.put('stats', JSON.stringify(out), CACHE_SECONDS);
  return json(out);
}

function aggregate() {
  var sh = sheet();
  var last = sh.getLastRow();
  var n = Math.max(0, last - 1);                       // 1行目は見出し
  if (n < MIN_N) return { n: n, avg: null };

  var values = sh.getRange(2, 1, n, 3 + AXES.length).getValues();
  var sum = { rom: 0 };
  for (var a = 0; a < AXES.length; a++) sum[AXES[a]] = 0;
  var types = {};
  var used = 0;

  for (var r = 0; r < values.length; r++) {
    var row = values[r];
    var rom = Number(row[2]);
    if (!isFinite(rom)) continue;
    sum.rom += rom;
    for (var i = 0; i < AXES.length; i++) sum[AXES[i]] += Number(row[3 + i]);
    var t = String(row[1]);
    types[t] = (types[t] || 0) + 1;
    used++;
  }
  if (used < MIN_N) return { n: used, avg: null };

  var avg = { rom: round1(sum.rom / used) };
  for (var k = 0; k < AXES.length; k++) avg[AXES[k]] = round1(sum[AXES[k]] / used);

  return { n: used, avg: avg, types: types };
}

function round1(v) { return Math.round(v * 10) / 10; }

/* ---------- 共通 ----------------------------------------------------- */

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['date', 'type', 'rom'].concat(AXES));
  }
  return sh;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
