const STORAGE_KEY = 'resident-training-system-recent-cases-v1';

const DEFAULT_CASE = {
  name: '示例患者',
  age: '68',
  sex: '男',
  chiefComplaint: '发热、咳嗽、气促 3 天，加重伴胸痛 6 小时',
  history: '高血压、2 型糖尿病 10 年。近期受凉后咳黄痰，活动后气促。',
  exam: 'T 38.8℃，HR 112 次/分，RR 28 次/分，BP 92/58 mmHg，SpO₂ 89%。右下肺湿啰音，双下肢轻度水肿。',
  labs: 'WBC 16.2×10^9/L，N 89%，CRP 145 mg/L，PCT 3.2 ng/mL，乳酸 3.1 mmol/L，D-二聚体 1.8 mg/L，肌酐 156 μmol/L，BNP 780 pg/mL，肌钙蛋白轻度升高。胸片：右下肺片状渗出。',
};

const guidelineLinks = [
  {
    title: '中华医学会指南与共识检索',
    type: '指南入口',
    url: 'https://www.cma.org.cn/col/col3868/index.html',
    note: '用于检索国内专科指南、专家共识及更新公告。',
  },
  {
    title: 'NICE Guidance',
    type: '国际指南',
    url: 'https://www.nice.org.uk/guidance',
    note: '可按疾病关键词检索诊疗路径、证据综述和患者版资料。',
  },
  {
    title: 'WHO Guidelines',
    type: '公共卫生指南',
    url: 'https://www.who.int/publications/who-guidelines',
    note: '涵盖感染、慢病和公共卫生管理建议。',
  },
  {
    title: 'AHA Guidelines and Statements',
    type: '心血管指南',
    url: 'https://professional.heart.org/en/guidelines-and-statements',
    note: '心血管急症、心衰、复苏等指南和科学声明。',
  },
  {
    title: 'Sepsis-3 qSOFA/SOFA 量表说明',
    type: '风险量表',
    url: 'https://www.mdcalc.com/calc/361/quick-sofa-qsofa-score-sepsis',
    note: '用于脓毒症早期识别训练，需结合临床判断。',
  },
  {
    title: 'Caprini VTE 风险评估',
    type: '风险量表',
    url: 'https://www.mdcalc.com/calc/3970/caprini-score-venous-thromboembolism-2005',
    note: '围手术期和住院患者静脉血栓风险分层训练。',
  },
  {
    title: 'CHA₂DS₂-VASc 房颤卒中风险',
    type: '风险量表',
    url: 'https://www.mdcalc.com/calc/801/cha2ds2-vasc-score-atrial-fibrillation-stroke-risk',
    note: '用于房颤抗凝获益评估训练。',
  },
];

const topicRules = [
  {
    topic: '肺炎/脓毒症',
    keywords: ['发热', '咳', '痰', '肺', 'crp', 'pct', '白细胞', 'wbc', '乳酸', '感染', '渗出'],
    diagnosis: '社区获得性肺炎，需评估重症肺炎及脓毒症/感染性休克',
    differentials: ['肺栓塞', '急性心力衰竭合并肺部感染', '肺结核或非典型病原体感染', '急性冠脉综合征诱发肺水肿'],
    missed: ['免疫抑制相关机会性感染', '误吸性肺炎', '药物热或肿瘤热', '感染灶并非肺部（泌尿系、胆道、导管相关感染）'],
    risks: ['低氧血症和呼吸衰竭', '脓毒性休克', '急性肾损伤', 'DIC 或血栓事件', '抗菌药物相关腹泻/艰难梭菌感染'],
    plan: ['立即评估 ABCDE、氧疗并连续监测 SpO₂、血压和尿量', '完善血培养、痰培养、动脉血气、乳酸复测、胸部 CT 或床旁超声', '根据当地耐药谱启动经验性抗菌治疗，并在 48–72 小时内复盘降阶梯', '若低灌注或乳酸升高，按脓毒症流程补液、血管活性药物和 ICU 会诊', '控制血糖、评估肾功能调整药物剂量，并进行 VTE/压疮/谵妄预防'],
  },
  {
    topic: '急性冠脉综合征',
    keywords: ['胸痛', '肌钙蛋白', 'st段', '心电图', '冠脉', 'acs', '心梗'],
    diagnosis: '急性冠脉综合征待排，需动态心电图和肌钙蛋白复查',
    differentials: ['主动脉夹层', '肺栓塞', '心包炎', '气胸', '胃食管反流或消化性溃疡'],
    missed: ['无痛性心梗（糖尿病/老年患者）', 'Takotsubo 心肌病', '心肌炎', '贫血或感染导致的 2 型心梗'],
    risks: ['恶性心律失常', '心源性休克', '急性心衰/肺水肿', '机械并发症', '出血风险（抗栓治疗相关）'],
    plan: ['10 分钟内完成 12 导联心电图并动态复查', '监测生命体征、建立静脉通路、评估再灌注适应证', '按风险与禁忌证制定抗血小板、抗凝、调脂和镇痛方案', '尽早心内科会诊，评估急诊 PCI 或转运', '同步排除夹层、肺栓塞等抗栓禁忌情境'],
  },
  {
    topic: '糖尿病急症',
    keywords: ['血糖', '酮', '糖尿病', '酸中毒', '渗透压', '多饮', '多尿'],
    diagnosis: '糖尿病急性代谢紊乱待排（DKA/HHS/低血糖）',
    differentials: ['感染诱发应激性高血糖', '乳酸酸中毒', '肾衰相关代谢性酸中毒', '药物相关高血糖'],
    missed: ['SGLT2 抑制剂相关正常血糖 DKA', '老年 HHS 合并脱水和血栓', '低钾被胰岛素治疗加重', '隐匿感染灶'],
    risks: ['休克和急性肾损伤', '低钾/高钾相关心律失常', '脑水肿（快速纠正时）', '血栓栓塞', '治疗中低血糖'],
    plan: ['立即测血糖、血酮/尿酮、血气、电解质、渗透压和感染指标', '先补液并严密监测尿量、钾和意识状态', '符合指征时小剂量胰岛素泵入，钾低时先补钾再用胰岛素', '寻找并处理诱因：感染、停药、心梗、卒中或药物', '制定过渡到皮下胰岛素和患者教育计划'],
  },
];

const appState = {
  caseData: { ...DEFAULT_CASE },
  recentCases: loadRecentCases(),
  messages: [
    { role: 'assistant', text: '请输入病例资料。我会按规培教学逻辑生成诊断、鉴别诊断、风险、诊疗计划和可追问要点。' },
  ],
};

function normalizeText(caseData) {
  return Object.values(caseData).join(' ').toLowerCase();
}

function analyzeCase(caseData) {
  const text = normalizeText(caseData);
  const matches = topicRules
    .map((rule) => ({
      ...rule,
      score: rule.keywords.reduce((count, keyword) => count + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary = matches[0] ?? {
    topic: '未匹配到明确主题',
    diagnosis: '需要补充病史、体格检查、关键化验和影像后再形成初步诊断',
    differentials: ['感染性疾病', '心肺急症', '代谢/内分泌急症', '药物或中毒相关问题'],
    missed: ['妊娠相关疾病', '免疫抑制状态', '近期手术/侵入操作并发症', '患者真实用药史和过敏史'],
    risks: ['病情进展导致休克或呼吸循环衰竭', '检查延误造成诊断偏差', '用药禁忌或相互作用', '院内感染和跌倒风险'],
    plan: ['补齐主诉、现病史、既往史、用药史、过敏史和体征', '按危急值与生命体征先处理威胁生命的问题', '列出问题清单并为每个问题设定验证检查', '请上级医师床旁复核诊断路径', '记录告知沟通、复盘节点和随访指标'],
  };

  const combined = matches.length ? matches.slice(0, 2) : [primary];
  return {
    primary,
    diagnosis: primary.diagnosis,
    differentials: uniqueList(combined.flatMap((item) => item.differentials)).slice(0, 6),
    missed: uniqueList(combined.flatMap((item) => item.missed)).slice(0, 6),
    risks: uniqueList(combined.flatMap((item) => item.risks)).slice(0, 7),
    plan: uniqueList(combined.flatMap((item) => item.plan)).slice(0, 8),
  };
}

function uniqueList(items) {
  return [...new Set(items)];
}

function loadRecentCases() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistRecentCases() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.recentCases));
}

function render() {
  const root = document.getElementById('root');
  const analysis = analyzeCase(appState.caseData);
  root.innerHTML = `
    <main class="app-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Resident Training Clinical Coach</p>
          <h1>规培生病例推演与诊疗计划训练系统</h1>
          <p class="hero-copy">支持病例与化验单录入、诊断推理、指南量表链接、风险并发症提醒、诊疗计划生成、即时问答及最近 10 次记录调用。</p>
        </div>
        <div class="hero-card">
          <span class="hero-icon">🩺</span>
          <span>教学用途 · 需上级医师复核 · 不替代临床决策</span>
        </div>
      </header>

      <section class="grid two-columns">
        ${card('📄', '1. 病例与化验单录入', renderCaseForm())}
        ${card('🕘', '7. 最近 10 次使用记录', renderHistory())}
      </section>

      <section class="grid three-columns">
        ${card('🔎', '2. 诊断与鉴别诊断', renderDiagnosis(analysis))}
        ${card('⚠️', '4. 风险与需关注并发症', renderRisks(analysis))}
        ${card('📋', '5. 完整诊疗计划', renderPlan(analysis))}
      </section>

      <section class="grid two-columns bottom-grid">
        ${card('📚', '3. 最新指南与相关量表链接/PDF入口', renderResources())}
        ${card('💬', '6. 随时提问的聊天框', renderChat())}
      </section>
    </main>
  `;
  bindEvents();
}

function card(icon, title, content) {
  return `
    <article class="card">
      <div class="card-title"><span class="title-icon">${icon}</span><h2>${title}</h2></div>
      <div class="dynamic-content">${content}</div>
    </article>
  `;
}

function renderCaseForm() {
  return `
    <div class="form-grid compact">
      ${inputField('姓名/编号', 'name')}
      ${inputField('年龄', 'age')}
      ${inputField('性别', 'sex')}
    </div>
    ${textareaField('主诉', 'chiefComplaint')}
    ${textareaField('现病史/既往史/用药史', 'history')}
    ${textareaField('查体', 'exam')}
    ${textareaField('化验单/影像/心电图', 'labs', 6)}
    <button class="primary-button" id="save-case">💾 保存到最近 10 次记录</button>
  `;
}

function inputField(label, key) {
  return `
    <label class="field">
      <span>${label}</span>
      <input data-case-field="${key}" value="${escapeAttr(appState.caseData[key])}" />
    </label>
  `;
}

function textareaField(label, key, rows = 4) {
  return `
    <label class="field">
      <span>${label}</span>
      <textarea rows="${rows}" data-case-field="${key}">${escapeHtml(appState.caseData[key])}</textarea>
    </label>
  `;
}

function renderHistory() {
  if (!appState.recentCases.length) {
    return '<p class="muted">尚无记录。点击“保存”后会自动保留最近 10 次病例。</p>';
  }
  return `
    <div class="history-list">
      ${appState.recentCases
        .map(
          (record) => `
            <button class="history-item" data-history-id="${record.id}">
              <strong>${escapeHtml(record.summary)}</strong>
              <span>${new Date(record.savedAt).toLocaleString('zh-CN')}</span>
            </button>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderDiagnosis(analysis) {
  return `
    <span class="badge">⚕️ ${analysis.primary.topic}</span>
    <h3>初步诊断</h3>
    <p>${analysis.diagnosis}</p>
    ${list('鉴别诊断', analysis.differentials)}
    ${list('可能忽略的诊断', analysis.missed)}
  `;
}

function renderRisks(analysis) {
  return `
    ${list('', analysis.risks)}
    <div class="warning-box">⚠️ 若出现意识障碍、低血压、SpO₂ 持续下降、尿量减少、乳酸升高或胸痛加重，应立即升级处置并呼叫上级医师。</div>
  `;
}

function renderPlan(analysis) {
  return `<ol class="ordered-list">${analysis.plan.map((item) => `<li>${item}</li>`).join('')}</ol>`;
}

function renderResources() {
  return `
    <div class="resource-list">
      ${guidelineLinks
        .map(
          (link) => `
            <a class="resource-card" href="${link.url}" target="_blank" rel="noreferrer">
              <span>${link.type}</span>
              <strong>${link.title}</strong>
              <small>${link.note}</small>
            </a>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderChat() {
  return `
    <div class="chat-window">
      ${appState.messages.map((message) => `<div class="chat-message ${message.role}">${escapeHtml(message.text)}</div>`).join('')}
    </div>
    <form class="chat-form" id="chat-form">
      <input id="question-input" placeholder="例如：下一步最关键的检查是什么？是否需要 ICU？" />
      <button type="submit">提问</button>
    </form>
  `;
}

function list(title, items) {
  return `
    <div>
      ${title ? `<h3>${title}</h3>` : ''}
      <ul class="check-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-case-field]').forEach((field) => {
    field.addEventListener('input', (event) => {
      appState.caseData[event.target.dataset.caseField] = event.target.value;
      updateAnalysisPanels();
    });
  });

  document.getElementById('save-case').addEventListener('click', saveCase);

  document.querySelectorAll('[data-history-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const record = appState.recentCases.find((item) => item.id === button.dataset.historyId);
      if (!record) return;
      appState.caseData = { ...record.caseData };
      appState.messages.push({ role: 'assistant', text: `已载入历史病例：${record.summary}` });
      render();
    });
  });

  document.getElementById('chat-form').addEventListener('submit', askQuestion);
}

function updateAnalysisPanels() {
  const analysis = analyzeCase(appState.caseData);
  const sections = document.querySelectorAll('.three-columns .card .dynamic-content');
  sections[0].innerHTML = renderDiagnosis(analysis);
  sections[1].innerHTML = renderRisks(analysis);
  sections[2].innerHTML = renderPlan(analysis);
}

function saveCase() {
  const analysis = analyzeCase(appState.caseData);
  const record = {
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    caseData: { ...appState.caseData },
    summary: `${appState.caseData.name || '未命名患者'}｜${appState.caseData.age || '?'}岁｜${analysis.primary.topic}`,
  };
  appState.recentCases = [
    record,
    ...appState.recentCases.filter((item) => JSON.stringify(item.caseData) !== JSON.stringify(appState.caseData)),
  ].slice(0, 10);
  persistRecentCases();
  render();
}

function askQuestion(event) {
  event.preventDefault();
  const input = document.getElementById('question-input');
  const question = input.value.trim();
  if (!question) return;
  const analysis = analyzeCase(appState.caseData);
  appState.messages.push({ role: 'user', text: question });
  appState.messages.push({ role: 'assistant', text: buildTeachingReply(question, analysis, appState.caseData) });
  render();
}

function buildTeachingReply(question, analysis, caseData) {
  const text = question.toLowerCase();
  if (text.includes('检查') || text.includes('检验') || text.includes('下一步')) {
    return `围绕“${analysis.primary.topic}”，下一步建议优先验证危急问题：复测生命体征、血气/乳酸、电解质、肾功能、感染或心肌损伤指标，并用影像或床旁超声确认病灶。病例中 ${caseData.labs ? '已有化验线索，应关注趋势变化。' : '化验资料不足，应尽快补齐。'}`;
  }
  if (text.includes('icu') || text.includes('危重') || text.includes('转入')) {
    return '若存在持续低氧、低血压、乳酸升高、意识改变、少尿、需血管活性药或快速进展，应按危重症标准请 ICU/上级医师床旁评估。';
  }
  if (text.includes('用药') || text.includes('治疗') || text.includes('抗生素') || text.includes('抗凝')) {
    return `治疗训练重点：先处理威胁生命的问题，再根据诊断假设选择药物；用药前检查过敏史、肝肾功能、出血风险、相互作用和指南适应证。当前计划可从“${analysis.plan[0]}”开始执行。`;
  }
  return `建议按 PBL 方式追问：1）支持 ${analysis.diagnosis} 的证据是什么；2）最危险的鉴别诊断如何排除；3）哪些并发症需要监测；4）何时复盘疗效与降阶梯。`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

render();
