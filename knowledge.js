/* 一般常識 v1。設問を変更する際は共有URLの版も更新する。 */
const KNOWLEDGE_DIMS = [
  {
    "key": "info",
    "name": "情報の見極め",
    "action": "共有や入力の前に、出典・日時・確認経路を一つずつ点検する。"
  },
  {
    "key": "number",
    "name": "数量と計算",
    "action": "金額や割合は、元の数値と単位を書き出してから計算する。"
  },
  {
    "key": "public",
    "name": "公共のルール",
    "action": "思い込みで進めず、その場の案内・締切・窓口を確認する。"
  },
  {
    "key": "basic",
    "name": "基礎知識と読解",
    "action": "事実と感想を分け、分からない用語は例と一緒に調べ直す。"
  }
];
const KNOWLEDGE_ITEMS = [
  {
    "id": 1,
    "key": "info",
    "q": "ある商品の満足度が90%という図を見た。比較前に最も確認したい情報は？",
    "opts": [
      "図の色",
      "回答人数と調査方法",
      "商品名の文字サイズ",
      "紹介者の声の大きさ"
    ],
    "correct": 1,
    "explain": "割合だけでは調査の規模や偏りが分かりません。対象者・人数・質問方法を確認します。"
  },
  {
    "id": 2,
    "key": "info",
    "q": "「Aを使う人ほどBが多い」という調査だけから言えることは？",
    "opts": [
      "AがBの原因だ",
      "BがAの原因だ",
      "AとBに関連が見られた",
      "全員にBが起きる"
    ],
    "correct": 2,
    "explain": "関連と因果関係は別です。別の要因が両方に関わっている可能性もあります。"
  },
  {
    "id": 3,
    "key": "info",
    "q": "数年前の災害写真が「今日の出来事」として回ってきた。共有前にすることは？",
    "opts": [
      "投稿の日時と写真の出典を確認する",
      "反応数だけを見る",
      "説明を省いて共有する",
      "知人の投稿なら共有する"
    ],
    "correct": 0,
    "explain": "写真自体が本物でも、日時や場所が違えば誤解を招きます。"
  },
  {
    "id": 4,
    "key": "info",
    "q": "メールでパスワード入力を急かされた。確認する方法として適切なのは？",
    "opts": [
      "メール内のリンクを開く",
      "返信してパスワードを伝える",
      "送信者の表示名だけを信じる",
      "普段使う公式アプリなどから状況を確認する"
    ],
    "correct": 3,
    "explain": "メールが用意した入口から離れ、普段使う経路で確認します。"
  },
  {
    "id": 5,
    "key": "number",
    "q": "1,200円の商品が25%引き。支払額は？",
    "opts": [
      "300円",
      "900円",
      "1,000円",
      "1,175円"
    ],
    "correct": 1,
    "explain": "1,200×0.75＝900円です。300円は値引き額です。"
  },
  {
    "id": 6,
    "key": "number",
    "q": "1,000円の商品を20%値上げし、その価格から20%値下げした。最終価格は？",
    "opts": [
      "1,000円",
      "800円",
      "960円",
      "1,040円"
    ],
    "correct": 2,
    "explain": "1,000×1.2×0.8＝960円。割合を掛ける元の価格が変わります。"
  },
  {
    "id": 7,
    "key": "number",
    "q": "5人の点数は2、3、3、4、18。中央値は？",
    "opts": [
      "3",
      "6",
      "4",
      "18"
    ],
    "correct": 0,
    "explain": "小さい順に並べた中央の値が中央値です。平均値は6です。"
  },
  {
    "id": 8,
    "key": "number",
    "q": "時速60kmで30分走る。一定の速さなら距離は？",
    "opts": [
      "120km",
      "60km",
      "2km",
      "30km"
    ],
    "correct": 3,
    "explain": "30分は0.5時間なので、60×0.5＝30kmです。"
  },
  {
    "id": 9,
    "key": "public",
    "q": "「受付は15時まで、見学は16時まで」と案内された。15時30分の新規受付は？",
    "opts": [
      "見学時間内なので可能",
      "案内上は受付終了",
      "混んでいなければ必ず可能",
      "16時までに帰れば可能"
    ],
    "correct": 1,
    "explain": "受付の締切と利用の終了時刻は異なります。必要なら事前に窓口へ確認します。"
  },
  {
    "id": 10,
    "key": "public",
    "q": "資源ごみの出し方が、引越し前と違うようだ。基準にするのは？",
    "opts": [
      "以前の地域の方法",
      "容器の見た目",
      "現在の自治体の案内",
      "全国で一律だという記憶"
    ],
    "correct": 2,
    "explain": "分別や収集方法には地域差があります。現在の地域の案内を確認します。"
  },
  {
    "id": 11,
    "key": "public",
    "q": "「締切は金曜日の正午」と書かれている。正午とは？",
    "opts": [
      "金曜日の昼12時",
      "金曜日の夜12時",
      "金曜日の午前9時",
      "土曜日の昼12時"
    ],
    "correct": 0,
    "explain": "正午は昼の12時です。夜の0時とは区別します。"
  },
  {
    "id": 12,
    "key": "public",
    "q": "会場の列が分かりづらい。割り込みを避けるため最初にすることは？",
    "opts": [
      "入口に近い空間に立つ",
      "知人の隣へ入る",
      "長い列なら別の入口へ進む",
      "最後尾や係員に並び方を確認する"
    ],
    "correct": 3,
    "explain": "見た目で空いていても待機場所の場合があります。案内を確認します。"
  },
  {
    "id": 13,
    "key": "basic",
    "q": "「客観的な記述」に最も近いものは？",
    "opts": [
      "この部屋は快適だ",
      "温度計は室温25℃を示している",
      "この部屋は誰にとっても暑い",
      "ここは最高の部屋だ"
    ],
    "correct": 1,
    "explain": "測定された事実と、個人の感想・評価を分けます。"
  },
  {
    "id": 14,
    "key": "basic",
    "q": "地図の縮尺が1万分の1。地図上の1cmは実際には？",
    "opts": [
      "10m",
      "1km",
      "100m",
      "1m"
    ],
    "correct": 2,
    "explain": "1cm×10,000＝10,000cm＝100mです。"
  },
  {
    "id": 15,
    "key": "basic",
    "q": "水が氷になる変化の名称は？",
    "opts": [
      "凝固",
      "蒸発",
      "融解",
      "凝縮"
    ],
    "correct": 0,
    "explain": "液体から固体への変化は凝固、固体から液体は融解です。"
  },
  {
    "id": 16,
    "key": "basic",
    "q": "「全員が参加した」という主張を否定できる事実は？",
    "opts": [
      "参加者が多かった",
      "半分以上が参加した",
      "参加者の感想が好評だった",
      "参加しなかった人が一人いた"
    ],
    "correct": 3,
    "explain": "「全員」という主張は、一人でも反例があれば成り立ちません。"
  }
];

const knowledge = { answers: [], order: [], options: [], pos: 0, social: null };
function knowledgeScore(answers) {
  if (answers.length !== KNOWLEDGE_ITEMS.length || answers.some(v => !Number.isInteger(v) || v < 0 || v > 3)) throw new Error('回答が未完了です');
  const dims = {}, counts = {};
  KNOWLEDGE_DIMS.forEach(d => { dims[d.key] = 0; counts[d.key] = 0; });
  let correct = 0;
  KNOWLEDGE_ITEMS.forEach((q,i) => { counts[q.key]++; if (answers[i] === q.correct) { correct++; dims[q.key]++; } });
  KNOWLEDGE_DIMS.forEach(d => { dims[d.key] = Math.round(dims[d.key] / counts[d.key] * 100); });
  return {correct, total: Math.round(correct / KNOWLEDGE_ITEMS.length * 100), dims};
}
function combinedEvaluation(social, answers) {
  const skills = scoreAll(social), socialTotal = overallSkill(skills), common = knowledgeScore(answers);
  const total = Math.round((socialTotal + common.total) / 2);
  const text = socialTotal >= 67 ? (common.total >= 67 ? '配慮と基礎判断を両立' : '配慮を支える知識を補う') : (common.total >= 67 ? '知識を相手に届く対応へ' : '確認と対話の基本から');
  const description = socialTotal >= 67 ? (common.total >= 67 ? '相手への配慮を含む対応と、一般常識の正答がともに多い結果でした。迷った場面では確認する習慣を続けましょう。' : '相手への配慮を含む対応を選べています。一方、知識や情報確認で誤りがあり、善意だけでは判断を誤る場面に注意が必要です。') : (common.total >= 67 ? '基礎知識の正答は多い一方、対人場面では相手の事情を確認する余地があります。正しい内容でも伝え方とタイミングを点検しましょう。' : '今回の回答では、対人対応と基礎判断の両方に練習の余地がありました。急いで決めず、相手と情報を確認する手順から始めましょう。');
  return {skills,socialTotal,common,total,text,description};
}
function startKnowledge() {
  if (!state.last) return;
  knowledge.social = state.last.code.split('').map(Number);
  knowledge.answers = KNOWLEDGE_ITEMS.map(() => null);
  knowledge.order = shuffle(KNOWLEDGE_ITEMS.map((_,i) => i));
  knowledge.options = KNOWLEDGE_ITEMS.map(() => shuffle([0,1,2,3]));
  knowledge.pos = 0;
  show('knowledge-quiz'); renderKnowledgeQuestion();
}
function renderKnowledgeQuestion() {
  const i = knowledge.order[knowledge.pos], q = KNOWLEDGE_ITEMS[i];
  $('#knowledge-counter').textContent = (knowledge.pos+1)+' / '+KNOWLEDGE_ITEMS.length;
  $('#knowledge-progress').value = knowledge.pos;
  $('#knowledge-question').textContent = q.q;
  $('#knowledge-options').replaceChildren();
  knowledge.options[i].forEach((oi,pos) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt';
    if (knowledge.answers[i] === oi) b.classList.add('is-selected');
    b.textContent = (pos+1)+'. '+q.opts[oi]; b.addEventListener('click',()=>answerKnowledge(oi));
    $('#knowledge-options').appendChild(b);
  });
  $('#knowledge-back').disabled = knowledge.pos === 0;
  $('#knowledge-question').focus({preventScroll:true});
}
function answerKnowledge(value) {
  knowledge.answers[knowledge.order[knowledge.pos]] = value;
  if (++knowledge.pos < KNOWLEDGE_ITEMS.length) renderKnowledgeQuestion();
  else {
    history.replaceState(null,'','#combined-v1='+knowledge.social.join('')+'.'+knowledge.answers.map(v=>v+1).join(''));
    renderCombined(); show('combined-result'); $('#combined-title').focus();
  }
}
function addCombinedBar(label,value) {
  const row = document.createElement('div'); row.className='combined-bar';
  const name = document.createElement('span'); name.textContent=label+'：'+value+' / 100';
  const meter = document.createElement('meter'); meter.min=0; meter.max=100; meter.value=value; meter.setAttribute('aria-label',label);
  row.append(name,meter); $('#combined-bars').appendChild(row);
}
function renderCombined() {
  const r = combinedEvaluation(knowledge.social,knowledge.answers);
  $('#combined-value').textContent=r.total;
  $('#combined-name').textContent=r.text;
  $('#combined-description').textContent=r.description;
  $('#knowledge-correct').textContent='一般常識：'+r.common.correct+' / '+KNOWLEDGE_ITEMS.length+'問正解';
  $('#combined-bars').replaceChildren();
  addCombinedBar('対人スキル総合',r.socialTotal); addCombinedBar('一般常識',r.common.total);
  DIMENSIONS.forEach(d=>addCombinedBar(d.name,r.skills[d.key]));
  KNOWLEDGE_DIMS.forEach(d=>addCombinedBar(d.name,r.common.dims[d.key]));
  const weakSocial=[...DIMENSIONS].sort((a,b)=>r.skills[a.key]-r.skills[b.key]).slice(0,2);
  const weakKnowledge=[...KNOWLEDGE_DIMS].sort((a,b)=>r.common.dims[a.key]-r.common.dims[b.key]).slice(0,2);
  $('#combined-actions').replaceChildren();
  [...weakSocial.map(d=>d.name+'：'+BANDS[d.key][bandOf(d.key,r.skills[d.key])][1]),...weakKnowledge.map(d=>d.name+'：'+d.action)].forEach(t=>{const li=document.createElement('li');li.textContent=t;$('#combined-actions').appendChild(li);});
  $('#knowledge-review').replaceChildren();
  KNOWLEDGE_ITEMS.forEach((q,i)=>{
    const item=document.createElement('details'), summary=document.createElement('summary'), p=document.createElement('p');
    summary.textContent=(i+1)+'. '+(knowledge.answers[i]===q.correct?'正解':'要確認')+' — '+q.q;
    p.textContent='あなたの回答：'+q.opts[knowledge.answers[i]]+' ／ 正解：'+q.opts[q.correct]+'。'+q.explain;
    item.append(summary,p);$('#knowledge-review').appendChild(item);
  });
}
function restoreCombined() {
  const m=/^#combined-v1=([1-4]+)\.([1-4]+)$/.exec(location.hash);
  if (!m || m[1].length!==ITEMS.length || m[2].length!==KNOWLEDGE_ITEMS.length) return false;
  knowledge.social=m[1].split('').map(Number);knowledge.answers=m[2].split('').map(v=>Number(v)-1);
  renderResult(knowledge.social);renderCombined();show('combined-result');return true;
}
document.addEventListener('DOMContentLoaded',()=>{
  $('#knowledge-start').addEventListener('click',startKnowledge);
  $('#knowledge-back').addEventListener('click',()=>{if(knowledge.pos>0){knowledge.pos--;renderKnowledgeQuestion();}});
  $('#knowledge-exit').addEventListener('click',()=>show('result'));
  $('#combined-social').addEventListener('click',()=>show('result'));
  $('#combined-retry').addEventListener('click',startKnowledge);
  $('#combined-restart').addEventListener('click',startQuiz);
  $('#combined-copy').addEventListener('click',async()=>{
    const b=$('#combined-copy'); const r=combinedEvaluation(knowledge.social,knowledge.answers);
    try {await navigator.clipboard.writeText('【対人スキル＋一般常識】'+r.text+'\n総合 '+r.total+'/100・対人 '+r.socialTotal+'・一般常識 '+r.common.total+'\n'+location.href);b.textContent='コピーしました';}
    catch {b.textContent='コピーできませんでした';}
  });
  document.addEventListener('keydown',e=>{
    if($('#knowledge-quiz').hidden || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    const n=Number(e.key), i=knowledge.order[knowledge.pos];
    if(n>=1&&n<=4){e.preventDefault();answerKnowledge(knowledge.options[i][n-1]);}
    if(e.key==='Backspace'){e.preventDefault();if(knowledge.pos>0){knowledge.pos--;renderKnowledgeQuestion();}}
  });
  restoreCombined();
});
