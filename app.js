/* =====================================================================
 * 心の在処テスト — 進行と採点
 * ===================================================================== */

const $ = (sel) => document.querySelector(sel);

const TYPE_WEIGHT = { E: 1.2, P: 0.8, G: 1.2, A: 1.0, M: 1.3, F: 1.0 };

const state = {
  order: [],        // 出題順（ITEMS のインデックス）
  answers: [],      // ITEMS の並び順に対応した回答（1..5 / null）
  pos: 0,
  compare: 'type',  // レーダーの比較対象: 'type' | 'avg'（avg は集計が有効なときだけ）
  last: null        // 直近の結果（比較対象の切り替えで再描画するため）
};

/* stats（参加者の集計）と集計まわりの処理は collect.js が持つ。
   既定では無効なので、stats は空のまま＝平均は一切表示されない。 */

/* ---------- 採点 ---------------------------------------------------- */

function scoreAll(answers) {
  const raw = {}, max = {};
  DIMENSIONS.forEach((d) => { raw[d.key] = 0; max[d.key] = 0; });

  ITEMS.forEach((item, i) => {
    const r = answers[i];
    const x = (r - 3) / 2;
    for (const k in item.w) {
      raw[k] += item.w[k] * x;
      max[k] += Math.abs(item.w[k]);
    }
  });

  const s = {};
  DIMENSIONS.forEach((d) => {
    const v = 50 + 50 * (raw[d.key] / max[d.key]);
    s[d.key] = Math.max(0, Math.min(100, Math.round(v)));
  });
  return s;
}

/* 総合指標「心の可動域」 */
function rangeOfMotion(s) {
  const base =
    0.30 * s.E + 0.12 * s.P + 0.28 * s.G + 0.20 * s.A + 0.10 * (100 - s.M);
  const v = base * (1 - 0.25 * (s.F / 100));
  return Math.max(0, Math.min(100, Math.round(v)));
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
    secondary: (scored[1].d - scored[0].d < 6) ? scored[1].type : null
  };
}

/* 帯の判定はスコアの大小のみで行う（負荷軸かどうかの意味づけは BANDS 側が持つ） */
function bandOf(key, v) {
  if (v >= 66) return 'high';
  if (v <= 35) return 'low';
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
  $('#q-text').textContent = item.t;
  $('#q-text').focus({ preventScroll: true });

  const box = $('#q-options');
  box.innerHTML = '';
  SCALE.forEach((opt) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opt' + (current === opt.v ? ' is-selected' : '');
    b.innerHTML =
      `<span class="opt-key">${opt.v}</span><span class="opt-label">${opt.label}</span>`;
    b.addEventListener('click', () => answer(opt.v));
    box.appendChild(b);
  });

  $('#q-back').disabled = state.pos === 0;
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
  history.replaceState(null, '', '#a=' + code);
  renderResult(state.answers);
  show('result');
}

/* ---------- 結果描画 ------------------------------------------------- */

function renderResult(answers) {
  const s = scoreAll(answers);
  const rom = rangeOfMotion(s);
  const { primary, secondary } = pickTypes(s);
  state.last = { s, rom, type: primary, code: answers.join('') };

  $('#hero-value').textContent = rom;
  $('#hero-note').textContent = romNote(rom);

  $('#type-name').textContent = primary.name;
  $('#type-tagline').textContent = primary.tagline;
  $('#type-verdict').textContent = primary.verdict;
  $('#type-body').innerHTML = primary.body.map((p) => `<p>${p}</p>`).join('');
  $('#type-risk').textContent = primary.risk;
  $('#type-actions').innerHTML =
    primary.actions.map((a) => `<li>${a}</li>`).join('');

  const secBox = $('#type-secondary');
  if (secondary) {
    secBox.hidden = false;
    secBox.innerHTML =
      `<strong>近接する傾向：${secondary.name}</strong>` +
      `<span>${secondary.tagline}。こちらの対処法も部分的に当てはまります。</span>`;
  } else {
    secBox.hidden = true;
  }

  renderScale(rom);
  renderRadar(s, primary);
  renderMeters(s);
  renderTable(s, rom);
  collectOnResult();
  $('#copy-btn').textContent = '結果をコピー';
  $('#copy-btn').dataset.text = buildShareText(s, rom, primary);
}

function romNote(v) {
  if (v >= 75) return '感じる力が大きく開いています。守りの設計が要ります。';
  if (v >= 55) return '一般的な範囲で動いています。';
  if (v >= 35) return '動きはあるが、狭くなっています。';
  return '可動域がかなり狭い状態です。原因は性格とは限りません。';
}

function renderMeters(s) {
  const wrap = $('#meters');
  wrap.innerHTML = '';

  DIMENSIONS.forEach((d) => {
    const v = s[d.key];
    const band = bandOf(d.key, v);
    const text = BANDS[d.key][band];

    const row = document.createElement('div');
    row.className = 'meter';
    row.innerHTML = `
      <div class="meter-head">
        <span class="meter-name">${d.name}${d.burden ? '<span class="tag">▲ 高いほど負荷</span>' : ''}</span>
        <span class="meter-value">${v}</span>
      </div>
      <div class="meter-track" role="img" aria-label="${d.name} ${v} / 100">
        <div class="meter-fill" style="width:${v}%"></div>
      </div>
      <p class="meter-desc">${d.short}</p>
      <p class="meter-read">${text[0]}<br><span class="meter-do">→ ${text[1]}</span></p>
    `;
    wrap.appendChild(row);
  });
}

/* ---------- 心の可動域スケール（0-100 上の位置） -------------------- */

function renderScale(rom) {
  $('#scale-fill').style.width = rom + '%';
  const marker = $('#scale-marker');
  marker.style.left = rom + '%';
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

  // 軸ラベル
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
    if (d.burden) {
      const sp = el('tspan', { class: 'ax-burden' });
      sp.textContent = ' ▲';
      t.appendChild(sp);
    }
    gLab.appendChild(t);
  });
  svg.appendChild(gLab);

  // 代表像（線のみ）→ あなた（塗り＋線）の順に重ねる
  svg.appendChild(el('polygon', { class: cmp.cls, points: poly(ref) }));
  svg.appendChild(el('polygon', { class: 'series-you', points: poly(you) }));

  const gDots = el('g', { class: 'radar-dots' });
  you.forEach((v, i) => {
    const [x, y] = radarPoint(i, v);
    gDots.appendChild(el('circle', { class: 'dot-you', cx: x.toFixed(1), cy: y.toFixed(1), r: 4.5 }));
  });
  svg.appendChild(gDots);

  // ホバー/フォーカス用の当たり判定（実マークより大きく取る）
  const tip = $('#radar-tip');
  const gHit = el('g', { class: 'radar-hits' });
  DIMENSIONS.forEach((d, i) => {
    const [x, y] = radarPoint(i, Math.max(you[i], 12));
    const c = el('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 17, tabindex: '0', role: 'img' });
    c.setAttribute('aria-label', `${d.name} あなた ${you[i]}、${cmp.name} ${ref[i]}`);
    const showTip = () => {
      tip.innerHTML =
        `<b>${d.name}${d.burden ? ' ▲' : ''}</b>` +
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
function renderTable(s, rom) {
  const hasAvg = !!stats.avg;
  const avgHead = hasAvg ? `<th scope="col">参加者平均 (n=${stats.n})</th>` : '';
  const avgCell = (k) => hasAvg ? `<td>${Math.round(stats.avg[k])}</td>` : '';

  const rows = DIMENSIONS.map(
    (d) => `<tr><th scope="row">${d.name}</th><td>${s[d.key]}</td>${avgCell(d.key)}` +
           `<td>${d.burden ? '高いほど負荷' : '高いほど強い'}</td></tr>`
  ).join('');

  const romAvg = hasAvg && typeof stats.avg.rom === 'number' ? `<td>${Math.round(stats.avg.rom)}</td>` : (hasAvg ? '<td>—</td>' : '');

  $('#score-table').innerHTML = `
    <table>
      <caption>スコア一覧（0〜100）</caption>
      <thead><tr><th scope="col">軸</th><th scope="col">あなた</th>${avgHead}<th scope="col">向き</th></tr></thead>
      <tbody>${rows}<tr><th scope="row">心の可動域（総合）</th><td>${rom}</td>${romAvg}<td>高いほど広い</td></tr></tbody>
    </table>`;
}

function buildShareText(s, rom, type) {
  const dims = DIMENSIONS.map((d) => `${d.name} ${s[d.key]}`).join(' / ');
  return [
    `【心の在処テスト】${type.name} — ${type.tagline}`,
    `心の可動域：${rom} / 100`,
    dims,
    location.href
  ].join('\n');
}

/* ---------- URL からの復元 ------------------------------------------ */

function tryRestoreFromHash() {
  const m = /^#a=([1-5]+)$/.exec(location.hash);
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
  collectInit();   // 集計が有効なときだけ、同意カードと比較スイッチを挿入する

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
    if (e.key >= '1' && e.key <= '5') { answer(Number(e.key)); e.preventDefault(); }
    if (e.key === 'Backspace') { goBack(); e.preventDefault(); }
  });

  if (!tryRestoreFromHash()) show('intro');
});
