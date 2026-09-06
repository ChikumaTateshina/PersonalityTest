/* =====================================================================
 * 対人スキル診断 — 進行と採点
 * ===================================================================== */

const $ = (sel) => document.querySelector(sel);

/* タイプ判定で軸に掛ける重み。どの技術も等価に扱う。 */
const TYPE_WEIGHT = { R: 1, L: 1, C: 1, S: 1, B: 1, M: 1 };

const state = {
  order: [],        // 出題順（ITEMS のインデックス）
  optOrder: [],     // 設問ごとの選択肢の表示順（位置で覚えられないようにする）
  curOrder: [],     // 表示中の設問の選択肢順（キーボード入力の対応づけ用）
  answers: [],      // ITEMS の並び順に対応した「選んだ選択肢の元の番号」（1..4 / null）
  pos: 0,
  compare: 'type',  // レーダーの比較対象: 'type' | 'avg'（avg は集計が有効なときだけ）
  last: null        // 直近の結果（比較対象の切り替えで再描画するため）
};

/* stats（参加者の集計）と集計まわりの処理は collect.js が持つ。
   既定では無効なので、stats は空のまま＝平均は一切表示されない。 */

/* ---------- 採点 ----------------------------------------------------
 * 軸スコア = 取れた点 / その軸の満点。
 * 満点は「各設問でその軸に対して取りうる最大点」の合計なので、
 * 100 は全設問でその軸の最善手を選んだ状態を指す。
 * ------------------------------------------------------------------ */

function scoreAll(answers) {
  const got = {}, max = {};
  DIMENSIONS.forEach((d) => { got[d.key] = 0; max[d.key] = 0; });

  ITEMS.forEach((item, i) => {
    const chosen = item.opts[answers[i] - 1];
    DIMENSIONS.forEach((d) => {
      const best = Math.max(...item.opts.map((o) => o.w[d.key] || 0));
      max[d.key] += best;
      if (chosen) got[d.key] += (chosen.w[d.key] || 0);
    });
  });

  const s = {};
  DIMENSIONS.forEach((d) => {
    s[d.key] = max[d.key] ? Math.round(100 * got[d.key] / max[d.key]) : 50;
  });
  return s;
}

/* 総合指標「対人スキル総合」＝6つの技術の平均到達度 */
function overallSkill(s) {
  const sum = DIMENSIONS.reduce((a, d) => a + s[d.key], 0);
  return Math.round(sum / DIMENSIONS.length);
}

/* プロファイル最近傍でタイプを決める */
function pickTypes(s) {
  const scored = TYPES.map((t) => {
    let num = 0, den = 0;
    for (const k in TYPE_WEIGHT) {
      const w = TYPE_WEIGHT[k];
      num += w * Math.pow(s[k] - t.target[k], 2);
      den += w;
    }
    return { type: t, d: Math.sqrt(num / den) };
  }).sort((a, b) => a.d - b.d);

  return {
    primary: scored[0].type,
    secondary: (scored[1].d - scored[0].d < 2.5) ? scored[1].type : null
  };
}

function bandOf(key, v) {
  if (v >= 67) return 'high';
  if (v <= 40) return 'low';
  return 'mid';
}

/* ---------- 画面遷移 ------------------------------------------------- */

function show(id) {
  ['#intro', '#quiz', '#result'].forEach((sel) => {
    $(sel).hidden = (sel !== '#' + id);
  });
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startQuiz() {
  state.order = shuffle(ITEMS.map((_, i) => i));
  state.optOrder = ITEMS.map((it) => shuffle(it.opts.map((_, i) => i)));
  state.answers = ITEMS.map(() => null);
  state.pos = 0;
  history.replaceState(null, '', location.pathname + location.search);
  $('#restart-btn').textContent = 'もう一度やる';
  show('quiz');
  renderQuestion();
}

function renderQuestion() {
  const total = ITEMS.length;
  const idx = state.order[state.pos];
  const item = ITEMS[idx];
  const current = state.answers[idx];

  $('#q-counter').textContent = `${state.pos + 1} / ${total}`;
  $('#q-progress-fill').style.width = `${(state.pos / total) * 100}%`;
  $('#q-progress').setAttribute('aria-valuenow', String(state.pos));
  $('#q-scene').textContent = item.scene;
  $('#q-text').textContent = item.q;

  state.curOrder = state.optOrder[idx];

  const box = $('#q-options');
  box.innerHTML = '';
  state.curOrder.forEach((oi, pos) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt' + (current === oi + 1 ? ' is-selected' : '');
    b.innerHTML =
      `<span class="opt-key">${pos + 1}</span><span class="opt-label"></span>`;
    b.querySelector('.opt-label').textContent = item.opts[oi].t;
    b.addEventListener('click', () => answer(oi + 1));
    box.appendChild(b);
  });

  $('#q-back').disabled = state.pos === 0;
  $('#q-scene').focus({ preventScroll: true });
}

function answer(v) {
  state.answers[state.order[state.pos]] = v;
  if (state.pos < ITEMS.length - 1) {
    state.pos++;
    renderQuestion();
  } else {
    finish();
  }
}

function goBack() {
  if (state.pos > 0) { state.pos--; renderQuestion(); }
}

function finish() {
  const code = state.answers.join('');
  history.replaceState(null, '', '#social-v1=' + code);
  renderResult(state.answers);
  show('result');
}

/* ---------- 結果描画 ------------------------------------------------- */

function renderResult(answers) {
  const s = scoreAll(answers);
  const total = overallSkill(s);
  const { primary, secondary } = pickTypes(s);
  state.last = { s, rom: total, type: primary, code: answers.join('') };

  $('#hero-value').textContent = total;
  $('#hero-note').textContent = overallNote(total);

  $('#type-name').textContent = '対人対応の特徴：' + primary.name;
  $('#type-tagline').textContent = primary.tagline;
  $('#type-verdict').textContent = primary.verdict;
  $('#type-body').innerHTML = primary.body.map(() => '<p></p>').join('');
  $('#type-body').querySelectorAll('p').forEach((el2, i) => { el2.textContent = primary.body[i]; });
  $('#type-risk').textContent = primary.risk;
  $('#type-actions').innerHTML = primary.actions.map(() => '<li></li>').join('');
  $('#type-actions').querySelectorAll('li').forEach((el2, i) => { el2.textContent = primary.actions[i]; });

  const secBox = $('#type-secondary');
  if (secondary) {
    secBox.hidden = false;
    secBox.innerHTML = '<strong></strong><span></span>';
    secBox.querySelector('strong').textContent = `近接する傾向：${secondary.name}`;
    secBox.querySelector('span').textContent =
      `${secondary.tagline}。こちらの練習メニューも部分的に当てはまります。`;
  } else {
    secBox.hidden = true;
  }

  renderScale(total);
  renderRadar(s, primary);
  renderMeters(s);
  renderTable(s, total);
  collectOnResult();

  $('#copy-btn').textContent = '結果をコピー';
  $('#copy-btn').dataset.text = buildShareText(s, total, primary);
}

function overallNote(v) {
  if (v >= 67) return '対人場面で使える手が、ひととおりそろっています。';
  if (v >= 50) return '基本の手は身についています。伸ばす余地は特定の技術に偏っています。';
  if (v >= 33) return '場面によって、使える手と使えない手の差が大きく出ています。';
  return '持ち札がまだ少ない状態です。対人スキルは練習で増えます。';
}

/* ---------- 総合スケール --------------------------------------------- */

function renderScale(v) {
  $('#scale-fill').style.width = v + '%';
  const marker = $('#scale-marker');
  marker.style.left = v + '%';
  marker.setAttribute('aria-hidden', 'true');
}

/* ---------- レーダーチャート ---------------------------------------- */

const RADAR = { cx: 180, cy: 176, r: 104, labelR: 132, rings: [25, 50, 75, 100] };
const SVG_NS = 'http://www.w3.org/2000/svg';

function radarAngle(i) {
  return (-90 + i * (360 / DIMENSIONS.length)) * Math.PI / 180;
}

function radarPoint(i, v) {
  const a = radarAngle(i), rr = RADAR.r * (v / 100);
  return [RADAR.cx + rr * Math.cos(a), RADAR.cy + rr * Math.sin(a)];
}

function poly(values) {
  return values.map((v, i) => radarPoint(i, v).map((n) => n.toFixed(1)).join(',')).join(' ');
}

function el(name, attrs) {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

function comparison(type) {
  if (state.compare === 'avg' && stats.avg) {
    return {
      values: DIMENSIONS.map((d) => Math.round(stats.avg[d.key])),
      name: `参加者の平均（n=${stats.n}）`,
      short: '平均',
      cls: 'series-avg',
      sw: 'sw3'
    };
  }
  return {
    values: DIMENSIONS.map((d) => type.target[d.key]),
    name: `${type.name}の代表像`,
    short: '代表像',
    cls: 'series-ref',
    sw: 'sw2'
  };
}

function renderRadar(s, type) {
  const svg = $('#radar');
  const cmp = comparison(type);
  const you = DIMENSIONS.map((d) => s[d.key]);
  const ref = cmp.values;

  svg.querySelectorAll('g,polygon,line,circle,text').forEach((n) => n.remove());
  svg.querySelector('title').textContent =
    'レーダーチャート。' + DIMENSIONS.map((d) => `${d.name} ${s[d.key]}`).join('、') + '。';

  const gGrid = el('g', { class: 'radar-grid' });
  RADAR.rings.forEach((p) => gGrid.appendChild(el('polygon', { points: poly(DIMENSIONS.map(() => p)) })));
  DIMENSIONS.forEach((_, i) => {
    const [x, y] = radarPoint(i, 100);
    gGrid.appendChild(el('line', { x1: RADAR.cx, y1: RADAR.cy, x2: x.toFixed(1), y2: y.toFixed(1) }));
  });
  svg.appendChild(gGrid);

  const gLab = el('g', { class: 'radar-labels' });
  DIMENSIONS.forEach((d, i) => {
    const a = radarAngle(i);
    const x = RADAR.cx + RADAR.labelR * Math.cos(a);
    const y = RADAR.cy + RADAR.labelR * Math.sin(a);
    const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
    const t = el('text', {
      x: x.toFixed(1), y: (y + 4 + 8 * Math.sin(a)).toFixed(1), 'text-anchor': anchor
    });
    t.textContent = d.name;
    gLab.appendChild(t);
  });
  svg.appendChild(gLab);

  svg.appendChild(el('polygon', { class: cmp.cls, points: poly(ref) }));
  svg.appendChild(el('polygon', { class: 'series-you', points: poly(you) }));

  const gDots = el('g', { class: 'radar-dots' });
  you.forEach((v, i) => {
    const [x, y] = radarPoint(i, v);
    gDots.appendChild(el('circle', { class: 'dot-you', cx: x.toFixed(1), cy: y.toFixed(1), r: 4.5 }));
  });
  svg.appendChild(gDots);

  const tip = $('#radar-tip');
  const gHit = el('g', { class: 'radar-hits' });
  DIMENSIONS.forEach((d, i) => {
    const [x, y] = radarPoint(i, Math.max(you[i], 12));
    const c = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 17, tabindex: '0', role: 'img' });
    c.setAttribute('aria-label', `${d.name} あなた ${you[i]}、${cmp.name} ${ref[i]}`);
    const showTip = () => {
      tip.innerHTML =
        `<b>${d.name}</b>` +
        `<span><i class="sw sw1"></i>あなた <b>${you[i]}</b></span>` +
        `<span><i class="sw ${cmp.sw}"></i>${cmp.short} <b>${ref[i]}</b></span>`;
      tip.hidden = false;
      const wr = $('.radar-wrap').getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      tip.style.left = (cr.left + cr.width / 2 - wr.left) + 'px';
      tip.style.top = (cr.top - wr.top - 10) + 'px';
    };
    const hideTip = () => { tip.hidden = true; };
    c.addEventListener('mouseenter', showTip);
    c.addEventListener('mouseleave', hideTip);
    c.addEventListener('focus', showTip);
    c.addEventListener('blur', hideTip);
    gHit.appendChild(c);
  });
  svg.appendChild(gHit);

  $('#radar-legend').innerHTML =
    `<span class="lg"><i class="sw sw1"></i>あなた</span>` +
    `<span class="lg"><i class="sw ${cmp.sw}"></i>${cmp.name}</span>`;
}

/* ---------- 軸ごとのメーターと読み取り ------------------------------- */

function renderMeters(s) {
  const wrap = $('#meters');
  wrap.innerHTML = '';

  DIMENSIONS.forEach((d) => {
    const v = s[d.key];
    const text = BANDS[d.key][bandOf(d.key, v)];

    const row = document.createElement('div');
    row.className = 'meter';
    row.innerHTML = `
      <div class="meter-head">
        <span class="meter-name"></span>
        <span class="meter-value">${v}</span>
      </div>
      <div class="meter-track" role="img" aria-label="${d.name} ${v} / 100">
        <div class="meter-fill" style="width:${v}%"></div>
      </div>
      <p class="meter-desc"></p>
      <p class="meter-read"><span class="read-now"></span><br><span class="meter-do"></span></p>
    `;
    row.querySelector('.meter-name').textContent = d.name;
    row.querySelector('.meter-desc').textContent = d.short;
    row.querySelector('.read-now').textContent = text[0];
    row.querySelector('.meter-do').textContent = '→ ' + text[1];
    wrap.appendChild(row);
  });
}

function renderTable(s, total) {
  const hasAvg = !!stats.avg;
  const avgHead = hasAvg ? `<th scope="col">参加者平均 (n=${stats.n})</th>` : '';
  const avgCell = (k) => hasAvg ? `<td>${Math.round(stats.avg[k])}</td>` : '';

  const rows = DIMENSIONS.map(
    (d) => `<tr><th scope="row">${d.name}</th><td>${s[d.key]}</td>${avgCell(d.key)}</tr>`
  ).join('');

  const totalAvg = hasAvg && typeof stats.avg.rom === 'number'
    ? `<td>${Math.round(stats.avg.rom)}</td>` : (hasAvg ? '<td>—</td>' : '');

  $('#score-table').innerHTML = `
    <table>
      <caption>到達度（0〜100。高いほど身についている）</caption>
      <thead><tr><th scope="col">技術</th><th scope="col">あなた</th>${avgHead}</tr></thead>
      <tbody>${rows}<tr><th scope="row">対人スキル総合</th><td>${total}</td>${totalAvg}</tr></tbody>
    </table>`;
}

function buildShareText(s, total, type) {
  const dims = DIMENSIONS.map((d) => `${d.name} ${s[d.key]}`).join(' / ');
  return [
    `【対人スキル診断】${type.name} — ${type.tagline}`,
    `対人スキル総合：${total} / 100`,
    dims,
    location.href
  ].join('\n');
}

/* ---------- URL からの復元 ------------------------------------------ */

function tryRestoreFromHash() {
  const m = /^#social-v1=([1-4]+)$/.exec(location.hash);
  if (!m || m[1].length !== ITEMS.length) return false;
  const answers = m[1].split('').map(Number);
  renderResult(answers);
  $('#restart-btn').textContent = '自分もやってみる';  // 共有リンクからの初来訪
  show('result');
  return true;
}

/* ---------- 起動 ----------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  $('#total-count').textContent = String(ITEMS.length);
  $('#q-progress').setAttribute('aria-valuemax', String(ITEMS.length));

  $('#start-btn').addEventListener('click', startQuiz);
  $('#q-back').addEventListener('click', goBack);
  $('#restart-btn').addEventListener('click', startQuiz);

  $('#copy-btn').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(btn.dataset.text || '');
      btn.textContent = 'コピーしました';
    } catch {
      btn.textContent = 'コピーできませんでした';
    }
    setTimeout(() => { btn.textContent = '結果をコピー'; }, 2000);
  });

  document.addEventListener('keydown', (e) => {
    if ($('#quiz').hidden) return;
    const n = Number(e.key);
    if (n >= 1 && n <= state.curOrder.length) {
      answer(state.curOrder[n - 1] + 1);
      e.preventDefault();
    }
    if (e.key === 'Backspace') { goBack(); e.preventDefault(); }
  });

  collectInit();   // 集計が有効なときだけ、同意カードと比較スイッチを挿入する

  if (!tryRestoreFromHash()) show('intro');
});
