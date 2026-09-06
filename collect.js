/* =====================================================================
 * 対人スキル診断 — 結果の送信と参加者平均（既定では無効）
 *
 *   COLLECT.enabled === false のあいだ、この機能は完全に停止する。
 *   - 同意カードも比較スイッチも DOM に挿入されない（hidden ですらなく、存在しない）
 *   - 送信も統計取得も行わない。通信は一切発生しない
 *   - stats は空のまま。結果画面は「あなた」と「タイプの代表像」だけを描く
 *
 * 将来ふたたび有効にする手順は README の「データの送信と集計（現在は無効）」を参照。
 * 有効化に必要なのは、下の enabled を true にして endpoint を入れることだけで、
 * 他のファイルには手を入れなくてよい。
 * ===================================================================== */

const COLLECT = {
  /* ここが false のあいだ、以下の設定は読まれない */
  enabled: false,

  /* 集計サーバー。server/apps-script.gs をデプロイして得た /exec の URL
     例: 'https://script.google.com/macros/s/XXXXXXXX/exec' */
  endpoint: '',

  /* 参加者の平均を表示し始める最小人数。サーバー側の MIN_N と揃える。
     少人数のうちは、平均から個人の回答が逆算できてしまうため。 */
  minN: 5
};

/* 集計が無効でも、app.js 側が参照する入れ物だけは常に用意しておく */
const stats = { n: 0, avg: null };

function collectAvailable() {
  return COLLECT.enabled === true && !!COLLECT.endpoint;
}

/* ---------- 有効時にだけ挿入するマークアップ ------------------------- */

const SWITCH_HTML = `
  <div id="compare-switch" class="switch" role="group" aria-label="比較対象" hidden>
    <button type="button" data-cmp="type" class="is-on" aria-pressed="true">タイプの代表像</button>
    <button type="button" data-cmp="avg" aria-pressed="false">参加者の平均</button>
  </div>`;

const CONSENT_HTML = `
  <div id="consent" class="card consent" hidden>
    <h2>この結果を送信しますか？</h2>
    <p class="consent-lead">
      参加者全体の平均を出すためのデータとして、この結果を提供できます。
      <strong>任意です。</strong>送信してもしなくても、表示される結果は変わりません。
    </p>

    <dl class="consent-detail">
      <div>
        <dt>送るもの</dt>
        <dd>6つの技術の到達度（0〜100の整数）、対人スキル総合、判定されたタイプ、送信日（日付のみ）</dd>
      </div>
      <div>
        <dt>送らないもの</dt>
        <dd>設問ごとの回答、氏名やメールなどの個人情報、ID・Cookie などの識別子、送信時刻、閲覧環境</dd>
      </div>
      <div>
        <dt>使い道</dt>
        <dd>参加者の平均を出すことだけに使います。個々の送信内容が単体で表示されることはありません（<span id="consent-minn">5</span>人に満たないあいだは平均も表示しません）。</dd>
      </div>
    </dl>

    <div id="consent-actions" class="consent-actions">
      <button id="consent-yes" class="primary">送信する</button>
      <button id="consent-no" class="ghost">送信しない</button>
    </div>
    <p id="consent-status" class="consent-status" role="status"></p>
  </div>`;

/* ---------- 起動フック（app.js から呼ばれる） ------------------------ */

function collectInit() {
  if (!collectAvailable()) return;

  document.querySelector('.radar-wrap').insertAdjacentHTML('beforebegin', SWITCH_HTML);
  document.querySelector('.card.caution').insertAdjacentHTML('beforebegin', CONSENT_HTML);

  document.querySelector('#consent-yes').addEventListener('click', submitResult);
  document.querySelector('#consent-no').addEventListener('click', () => {
    saveConsent(state.last.code, 'declined');
    paintConsent('declined');
  });
  document.querySelectorAll('#compare-switch button').forEach((b) => {
    b.addEventListener('click', () => setCompare(b.dataset.cmp));
  });

  fetchStats();
}

/* 結果を描き終えるたびに呼ばれる */
function collectOnResult() {
  if (!collectAvailable()) return;
  renderConsent();
}

/* ---------- 同意 ------------------------------------------------------ */

const CONSENT_KEY = 'kokoro.consent.v1';

function consentLog() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}'); } catch { return {}; }
}

function saveConsent(code, value) {
  try {
    const log = consentLog();
    log[code] = value;
    localStorage.setItem(CONSENT_KEY, JSON.stringify(log));
  } catch { /* localStorage が使えなくても動作は続ける */ }
}

function renderConsent() {
  const card = document.querySelector('#consent');
  if (!card || !state.last) return;
  card.hidden = false;
  document.querySelector('#consent-minn').textContent = String(COLLECT.minN);
  paintConsent(consentLog()[state.last.code] || null);
}

function paintConsent(status) {
  const actions = document.querySelector('#consent-actions');
  const yes = document.querySelector('#consent-yes');
  const no = document.querySelector('#consent-no');
  const st = document.querySelector('#consent-status');

  if (status === 'sent') {
    actions.hidden = true;
    st.textContent = '送信しました。ありがとうございます。';
  } else if (status === 'declined') {
    actions.hidden = false;
    no.hidden = true;
    yes.textContent = 'やはり送信する';
    st.textContent = '送信しませんでした。この結果は端末の外に出ていません。';
  } else {
    actions.hidden = false;
    no.hidden = false;
    yes.textContent = '送信する';
    st.textContent = '';
  }
}

/* ---------- 送信 ------------------------------------------------------ */

/* 送信する中身。ここに書かれているものが、送るもののすべて。 */
function buildPayload() {
  const { s, rom, type } = state.last;
  const d = new Date();
  const date = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');                                  // 日付だけ。時刻は載せない
  return {
    v: 1, date, type: type.id, rom,
    R: s.R, L: s.L, C: s.C, S: s.S, B: s.B, M: s.M
  };
}

async function submitResult() {
  const yes = document.querySelector('#consent-yes');
  const st = document.querySelector('#consent-status');
  yes.disabled = true;
  st.textContent = '送信中…';
  try {
    await fetch(COLLECT.endpoint, {
      method: 'POST',
      mode: 'no-cors',                                   // プリフライトを避ける
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload())
    });
    saveConsent(state.last.code, 'sent');
    paintConsent('sent');
    fetchStats();                                        // 自分の分を含めた平均に更新
  } catch {
    st.textContent = '送信できませんでした。通信環境を確認して、もう一度お試しください。';
  } finally {
    yes.disabled = false;
  }
}

/* ---------- 集計の取得と比較表示 ------------------------------------- */

async function fetchStats() {
  if (!collectAvailable()) return;
  const url = COLLECT.endpoint +
    (COLLECT.endpoint.includes('?') ? '&' : '?') + 'stats=1&t=' + Date.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const j = await res.json();
    if (j && typeof j.n === 'number') {
      stats.n = j.n;
      stats.avg = (j.avg && typeof j.avg.R === 'number' && j.n >= COLLECT.minN) ? j.avg : null;
    }
  } catch { /* 取れなければ平均は出さない。結果表示そのものには影響しない */ }
  updateCompareUI();
}

function updateCompareUI() {
  const sw = document.querySelector('#compare-switch');
  if (!sw) return;
  const has = !!stats.avg;
  sw.hidden = !has;
  if (!has && state.compare === 'avg') state.compare = 'type';
  if (has) sw.querySelector('[data-cmp="avg"]').textContent = `参加者の平均 (n=${stats.n})`;
  if (state.last) {
    renderRadar(state.last.s, state.last.type);
    renderTable(state.last.s, state.last.rom);
  }
}

function setCompare(mode) {
  state.compare = mode;
  document.querySelectorAll('#compare-switch button').forEach((b) => {
    const on = b.dataset.cmp === mode;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  if (state.last) renderRadar(state.last.s, state.last.type);
}
