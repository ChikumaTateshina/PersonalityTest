/* 社会常識 v2。各分野6問・全24問。 */
const KNOWLEDGE_DIMS = [
  {
    "key": "info",
    "name": "情報共有と慎重さ",
    "action": "共有前に宛先・公開範囲・出典を確認する。"
  },
  {
    "key": "public",
    "name": "公共の場のふるまい",
    "action": "その場所の案内を確認し、通路や共有物を次の人も使える状態にする。"
  },
  {
    "key": "work",
    "name": "仕事と約束",
    "action": "遅れや不明点を早めに伝え、担当・期限・次の行動をすり合わせる。"
  },
  {
    "key": "respect",
    "name": "プライバシーと尊重",
    "action": "善意でも本人の了承と断る権利を確認し、踏み込む範囲を調整する。"
  }
];
const KNOWLEDGE_ITEMS = [
  {
    "id": 1,
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
    "id": 2,
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
    "id": 3,
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
    "id": 4,
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
    "id": 5,
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
    "key": "info",
    "q": "仕事の宛先を選び間違え、社内資料を外部に送ってしまった。最初の対応は？",
    "opts": [
      "削除依頼だけを送り、報告はしない",
      "誤送信の範囲を確認し、担当窓口へ速やかに報告する",
      "返事が来るまで待つ",
      "送信履歴を消してから考える"
    ],
    "correct": 1,
    "explain": "自分だけで収めようとせず、組織の手順に従って担当者と対応します。削除依頼だけで回収できたとは限りません。",
    "id": 6
  },
  {
    "key": "info",
    "q": "面識のない複数の参加者へ、互いのメールアドレスを知らせず同じ案内を送りたい。方法は？",
    "opts": [
      "全員をToに入れる",
      "全員をCcに入れる",
      "送信先を確認したうえでBccまたは個別送信を使う",
      "本文に全員のアドレスを書く"
    ],
    "correct": 2,
    "explain": "Bccは他の受信者に宛先を表示しません。本文や添付にも名簿が入っていないか確認します。",
    "id": 7
  },
  {
    "key": "info",
    "q": "知人が、未確認の人物の噂を「注意のため」と送ってきた。適切な対応は？",
    "opts": [
      "善意なのでそのまま広める",
      "個人が分かる情報を広めず、必要なら信頼できる窓口に確認する",
      "疑問符を付けて公開する",
      "閉じたグループなら自由に転送する"
    ],
    "correct": 1,
    "explain": "注意喚起のつもりでも、未確認の情報は人を傷つけます。拡散と確認を分けます。",
    "id": 8
  },
  {
    "key": "info",
    "q": "オンライン会議の画面を共有する予定。事前にしておくことは？",
    "opts": [
      "必要なウィンドウに絞り、通知や私的な画面が映らないか確認する",
      "全画面を共有してから不要な画面を閉じる",
      "会議参加者は信用できるので何も確認しない",
      "通知の音だけを消す"
    ],
    "correct": 0,
    "explain": "不要な情報は画面や通知からも伝わります。必要な内容だけ共有できる状態を整えます。",
    "id": 9
  },
  {
    "key": "public",
    "q": "電車の扉付近で、降りる人と乗る人が向かい合った。基本となる行動は？",
    "opts": [
      "空席が見えた人から乗る",
      "降りる人の通路を空けてから乗る",
      "荷物を先に入れて場所を取る",
      "扉の正面で止まって待つ"
    ],
    "correct": 1,
    "explain": "降りる人が通れる空間を作ると、乗降がスムーズになります。係員の案内がある場合は従います。",
    "id": 10
  },
  {
    "key": "public",
    "q": "公共施設で携帯電話に着信があった。静かな利用が求められている場所での対応は？",
    "opts": [
      "小声ならその場で長く話す",
      "スピーカーを使わなければどこでもよい",
      "利用案内に従い、通話できる場所へ移動してから応答する",
      "周囲も携帯を見ているので話す"
    ],
    "correct": 2,
    "explain": "画面を見ることと通話することでは周囲への影響が異なります。その場所の利用案内を確認します。",
    "id": 11
  },
  {
    "key": "public",
    "q": "共有スペースの机で作業し、次の人が待っている。退出時にすることは？",
    "opts": [
      "自分の荷物だけ持ち、使った物は残す",
      "次の人が使いやすいよう机を片づけ、借りた物を所定の場所へ戻す",
      "後で戻る予定なので私物を置いておく",
      "片づけを次の人に頼んで帰る"
    ],
    "correct": 1,
    "explain": "共有物は次の人も使える状態に戻します。私物で占有し続けないことも大切です。",
    "id": 12
  },
  {
    "key": "work",
    "q": "約束の時刻に遅れる見込みになった。最も適切な連絡は？",
    "opts": [
      "到着してから事情を説明する",
      "確実な到着時刻が分かるまで連絡しない",
      "遅れる見込みと現在の到着予想を早めに伝え、対応を相談する",
      "理由だけ詳しく送り、到着予想は書かない"
    ],
    "correct": 2,
    "explain": "相手が予定を調整できるよう早めに伝えます。予想が変わったら更新します。",
    "id": 13
  },
  {
    "key": "work",
    "q": "締切までに仕事を終えられない可能性が出た。どうする？",
    "opts": [
      "期限直前まで黙って努力する",
      "影響と進捗を伝え、優先順位や分担を相談する",
      "完了していない部分を説明せず提出する",
      "自分の判断だけで期限を変更する"
    ],
    "correct": 1,
    "explain": "相談は遅れると確定する前でもできます。相手が対策を取れる情報を伝えます。",
    "id": 14
  },
  {
    "key": "work",
    "q": "依頼された仕事の範囲が曖昧だ。着手前に確認すべきことは？",
    "opts": [
      "完成形・締切・優先順位",
      "依頼者の年齢",
      "同僚の評判",
      "一番見栄えのよい形式だけ"
    ],
    "correct": 0,
    "explain": "期待する成果と期限をすり合わせると、作り直しや認識のずれを減らせます。",
    "id": 15
  },
  {
    "key": "work",
    "q": "欠席していた同僚へ会議結果を伝える。役立つ伝え方は？",
    "opts": [
      "自分の感想だけ伝える",
      "発言者の口調を中心に伝える",
      "全発言を順不同で送る",
      "決定事項・担当・期限と、未決事項を分けて伝える"
    ],
    "correct": 3,
    "explain": "何を実行するかと、まだ決まっていないことを分けると誤解が減ります。",
    "id": 16
  },
  {
    "key": "work",
    "q": "担当外のことを取引先から聞かれ、答えが分からない。どうする？",
    "opts": [
      "詳しそうに推測を答える",
      "確認が必要だと伝え、担当者と回答予定を調整する",
      "断定してから間違いがあれば直す",
      "何も言わず別の人に転送する"
    ],
    "correct": 1,
    "explain": "分からないことは断定せず、誰がいつ返答するかを調整します。",
    "id": 17
  },
  {
    "key": "work",
    "q": "作業でミスを見つけたが、影響の全体はまだ分からない。どう報告する？",
    "opts": [
      "確認済みの事実と不明点を分けて伝える",
      "全容が分かるまで報告しない",
      "推測も事実として伝える",
      "他人の責任と思う点だけを話す"
    ],
    "correct": 0,
    "explain": "不確かな情報は不確かと明示し、影響が広がる前に共有します。",
    "id": 18
  },
  {
    "key": "respect",
    "q": "知人との会話をSNSに載せたい。名前を消せば十分？",
    "opts": [
      "名前がなければ必ず十分",
      "親しい相手なら確認不要",
      "内容から本人が分かる可能性も含め、公開してよいか確認する",
      "面白い内容ならそのまま公開できる"
    ],
    "correct": 2,
    "explain": "名前以外の所属や出来事から本人が分かることもあります。私的な会話の公開範囲を確認します。",
    "id": 19
  },
  {
    "key": "respect",
    "q": "相手が誘いを「今回は見送ります」と断った。どう受け止める？",
    "opts": [
      "詳しい理由を説明するまで聞き続ける",
      "断りを受け止め、参加を前提に手配しない",
      "親しい人から説得してもらう",
      "とりあえず人数に入れておく"
    ],
    "correct": 1,
    "explain": "断る判断を尊重し、説明や参加を強制しないことが基本です。",
    "id": 20
  },
  {
    "key": "respect",
    "q": "相手の名前の読み方に自信がない。本人に呼びかける前にどうする？",
    "opts": [
      "分からないまま決めつけて呼ぶ",
      "名前を避け続ける",
      "他の人に冗談として聞く",
      "失礼のない形で本人に読み方を確認する"
    ],
    "correct": 3,
    "explain": "確認すること自体は失礼ではありません。誤った呼び方を続けないための配慮です。",
    "id": 21
  },
  {
    "key": "respect",
    "q": "体調や障害の事情を聞いた。同僚も知っておくと便利そうだが、本人の了承はない。どうする？",
    "opts": [
      "共有する目的と範囲を本人と確認し、必要な配慮の情報に絞る",
      "善意なら詳しく伝える",
      "病名だけなら自由に伝える",
      "本人抜きのグループで相談する"
    ],
    "correct": 0,
    "explain": "私的な事情を必要以上に共有しないよう、まず本人の意向を確認します。緊急時などは別途状況に応じた対応が必要です。",
    "id": 22
  },
  {
    "key": "respect",
    "q": "写真撮影の誘いに一人が「写りたくない」と言った。対応は？",
    "opts": [
      "記念だからと一枚だけ撮る",
      "顔を小さく撮ればよい",
      "断りを尊重し、写らずに済む形で撮影する",
      "集合写真なら了承は不要"
    ],
    "correct": 2,
    "explain": "全員と同じ行動を求めず、参加しない選択を尊重します。",
    "id": 23
  },
  {
    "key": "respect",
    "q": "説明を聞いた相手が理解できたか確認したい。適切なのは？",
    "opts": [
      "年齢や職業から理解度を決める",
      "「普通は分かりますよね」と尋ねる",
      "うなずいていれば説明を終える",
      "不明な点を聞ける間を作り、次の手順を一緒に確認する"
    ],
    "correct": 3,
    "explain": "相手が質問しやすい形で、具体的な理解を確かめます。属性や反応だけで決めつけません。",
    "id": 24
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
  const description = socialTotal >= 67 ? (common.total >= 67 ? '相手への配慮を含む対応と、社会常識の正答がともに多い結果でした。迷った場面では確認する習慣を続けましょう。' : '相手への配慮を含む対応を選べています。一方、知識や情報確認で誤りがあり、善意だけでは判断を誤る場面に注意が必要です。') : (common.total >= 67 ? '社会場面の正答は多い一方、対人場面では相手の事情を確認する余地があります。正しい内容でも伝え方とタイミングを点検しましょう。' : '今回の回答では、対人対応と基礎判断の両方に練習の余地がありました。急いで決めず、相手と情報を確認する手順から始めましょう。');
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
  $('#knowledge-progress').max = KNOWLEDGE_ITEMS.length;
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
    history.replaceState(null,'','#combined-v2='+knowledge.social.join('')+'.'+knowledge.answers.map(v=>v+1).join(''));
    renderCombined({ showReview: true }); show('combined-result'); $('#combined-title').focus();
  }
}
function addCombinedBar(label,value) {
  const row = document.createElement('div'); row.className='combined-bar';
  const name = document.createElement('span'); name.textContent=label+'：'+value+' / 100';
  const meter = document.createElement('meter'); meter.min=0; meter.max=100; meter.value=value; meter.setAttribute('aria-label',label);
  row.append(name,meter); $('#combined-bars').appendChild(row);
}
function renderCombined({ showReview = false } = {}) {
  const r = combinedEvaluation(knowledge.social,knowledge.answers);
  $('#combined-value').textContent=r.total;
  $('#combined-name').textContent=r.text;
  $('#combined-description').textContent=r.description;
  $('#knowledge-correct').textContent='社会常識：'+r.common.correct+' / '+KNOWLEDGE_ITEMS.length+'問正解';
  $('#combined-bars').replaceChildren();
  addCombinedBar('対人スキル総合',r.socialTotal); addCombinedBar('社会常識',r.common.total);
  DIMENSIONS.forEach(d=>addCombinedBar(d.name,r.skills[d.key]));
  KNOWLEDGE_DIMS.forEach(d=>addCombinedBar(d.name,r.common.dims[d.key]));
  const weakSocial=[...DIMENSIONS].sort((a,b)=>r.skills[a.key]-r.skills[b.key]).slice(0,2);
  const weakKnowledge=[...KNOWLEDGE_DIMS].sort((a,b)=>r.common.dims[a.key]-r.common.dims[b.key]).slice(0,2);
  $('#combined-actions').replaceChildren();
  [...weakSocial.map(d=>d.name+'：'+BANDS[d.key][bandOf(d.key,r.skills[d.key])][1]),...weakKnowledge.map(d=>d.name+'：'+d.action)].forEach(t=>{const li=document.createElement('li');li.textContent=t;$('#combined-actions').appendChild(li);});
  $('#knowledge-review').replaceChildren();
  $('#knowledge-review-card').hidden = !showReview;
  // 正解・解説はこの画面で回答を完了したときだけ生成する。共有URL復元では生成しない。
  if (!showReview) return;
  KNOWLEDGE_ITEMS.forEach((q,i)=>{
    const item=document.createElement('details'), summary=document.createElement('summary'), p=document.createElement('p');
    summary.textContent=(i+1)+'. '+(knowledge.answers[i]===q.correct?'正解':'要確認')+' — '+q.q;
    p.textContent='あなたの回答：'+q.opts[knowledge.answers[i]]+' ／ 正解：'+q.opts[q.correct]+'。'+q.explain;
    item.append(summary,p);$('#knowledge-review').appendChild(item);
  });
}
function restoreCombined() {
  const m=/^#combined-v2=([1-4]+)\.([1-4]+)$/.exec(location.hash);
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
    try {await navigator.clipboard.writeText('【対人スキル＋社会常識】'+r.text+'\n総合 '+r.total+'/100・対人 '+r.socialTotal+'・社会常識 '+r.common.total+'\n'+location.href);b.textContent='コピーしました';}
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
