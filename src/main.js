const STORAGE_KEY = 'resident-training-system-recent-cases-v2';

const DEFAULT_CASE = {
  name: '示例患者',
  age: '68',
  sex: '男',
  chiefComplaint: '发热、咳嗽、气促 3 天，加重伴胸痛 6 小时',
  history: '高血压、2 型糖尿病 10 年。近期受凉后咳黄痰，活动后气促。否认近期手术，长期口服降压药和二甲双胍。',
  exam: 'T 38.8℃，HR 112 次/分，RR 28 次/分，BP 92/58 mmHg，SpO₂ 89%。右下肺湿啰音，双下肢轻度水肿。',
  labs: 'WBC 16.2×10^9/L，N 89%，CRP 145 mg/L，PCT 3.2 ng/mL，乳酸 3.1 mmol/L，D-二聚体 1.8 mg/L，肌酐 156 μmol/L，BNP 780 pg/mL，肌钙蛋白轻度升高。胸片：右下肺片状渗出。',
};

const guidelineLinks = [
  { title: '中华医学会指南与共识检索', type: '国内指南', url: 'https://www.cma.org.cn/col/col3868/index.html', note: '检索国内专科指南、专家共识及更新公告。' },
  { title: 'NICE Guidance', type: '国际指南', url: 'https://www.nice.org.uk/guidance', note: '按疾病关键词检索诊疗路径和证据综述。' },
  { title: 'WHO Guidelines', type: '公共卫生', url: 'https://www.who.int/publications/who-guidelines', note: '感染、慢病和公共卫生管理建议。' },
  { title: 'AHA Guidelines and Statements', type: '心血管', url: 'https://professional.heart.org/en/guidelines-and-statements', note: '胸痛、心衰、复苏等指南和声明。' },
  { title: 'qSOFA / SOFA 脓毒症评估', type: '量表', url: 'https://www.mdcalc.com/calc/361/quick-sofa-qsofa-score-sepsis', note: '感染患者早期识别高危状态。' },
  { title: 'CURB-65 肺炎严重度', type: '量表', url: 'https://www.mdcalc.com/calc/324/curb-65-score-pneumonia-severity', note: '肺炎住院、ICU 和死亡风险教学评估。' },
  { title: 'Wells 肺栓塞评分', type: '量表', url: 'https://www.mdcalc.com/calc/115/wells-criteria-pulmonary-embolism', note: '胸痛、气促、D-二聚体升高时辅助分层。' },
  { title: 'Caprini VTE 风险评估', type: '量表', url: 'https://www.mdcalc.com/calc/3970/caprini-score-venous-thromboembolism-2005', note: '住院和围手术期静脉血栓风险分层。' },
  { title: 'CHA₂DS₂-VASc 卒中风险', type: '量表', url: 'https://www.mdcalc.com/calc/801/cha2ds2-vasc-score-atrial-fibrillation-stroke-risk', note: '房颤抗凝获益和风险沟通训练。' },
];

const topicRules = [
  {
    topic: '重症肺炎/脓毒症',
    keywords: ['发热', '咳', '痰', '肺', 'crp', 'pct', '白细胞', 'wbc', '乳酸', '感染', '渗出', '寒战', '低血压'],
    diagnosis: '社区获得性肺炎，需同步评估重症肺炎、脓毒症和感染性休克',
    differentials: ['肺栓塞', '急性心力衰竭合并肺部感染', '肺结核或非典型病原体感染', '误吸性肺炎', '病毒性肺炎/流感/COVID-19', '急性冠脉综合征诱发肺水肿'],
    missed: ['免疫抑制相关机会性感染', '感染灶并非肺部（泌尿系、胆道、腹腔、皮肤软组织、导管相关）', '坏死性肺炎/脓胸', '肺癌阻塞后感染', '抗菌药覆盖不足或耐药菌感染'],
    risks: ['低氧血症和呼吸衰竭', '脓毒性休克', '急性肾损伤', 'DIC 或血栓事件', 'ARDS', '抗菌药物相关腹泻/艰难梭菌感染'],
    plan: ['立即按 ABCDE 评估，给氧并连续监测 SpO₂、血压、尿量和意识状态', '完善血培养、痰培养、动脉血气、乳酸复测、电解质/肝肾功能、胸部 CT 或床旁超声', '在采培养后尽早启动经验性抗菌治疗，覆盖当地常见病原体并 48–72 小时复盘降阶梯', '若低灌注、乳酸升高或需要高流量氧/血管活性药，立即请 ICU 和上级医师床旁评估', '控制血糖、评估肾功能调整剂量，并进行 VTE、压疮、谵妄和营养风险预防'],
  },
  {
    topic: '急性冠脉综合征',
    keywords: ['胸痛', '肌钙蛋白', 'st段', '心电图', '冠脉', 'acs', '心梗', '胸闷', '放射痛'],
    diagnosis: '急性冠脉综合征待排，需动态心电图和肌钙蛋白复查',
    differentials: ['主动脉夹层', '肺栓塞', '心包炎/心肌炎', '气胸', '食管破裂或消化性溃疡', '感染/贫血/低氧导致的 2 型心梗'],
    missed: ['无痛性心梗（糖尿病、老年、女性患者）', '右室梗死或后壁梗死（常规导联易漏）', 'Takotsubo 心肌病', '主动脉夹层合并冠脉受累', '抗栓前未排除出血和夹层禁忌'],
    risks: ['恶性心律失常', '心源性休克', '急性心衰/肺水肿', '心肌梗死机械并发症', '抗栓/溶栓相关出血', '再灌注延误导致心肌坏死扩大'],
    plan: ['10 分钟内完成 12 导联心电图，必要时加做右室/后壁导联并动态复查', '连续监测心电、血压、氧饱和度，建立静脉通路并评估再灌注适应证', '按禁忌证制定抗血小板、抗凝、调脂、镇痛和硝酸酯/β受体阻滞剂策略', '尽早心内科会诊，评估急诊 PCI、溶栓或转运路径', '同步排除主动脉夹层、肺栓塞、气胸等会改变处置方向的高危鉴别诊断'],
  },
  {
    topic: '肺栓塞/VTE',
    keywords: ['d-二聚体', 'd二聚体', '气促', '胸痛', '咯血', '下肢肿', '血栓', '术后', '卧床', '肿瘤', 'pe'],
    diagnosis: '肺栓塞需要排查，尤其在气促、胸痛、低氧、D-二聚体升高或 VTE 风险因素存在时',
    differentials: ['急性冠脉综合征', '重症肺炎', '气胸', '主动脉夹层', '急性心衰', '胸膜炎'],
    missed: ['亚段肺栓塞或复发性小栓塞', '下肢深静脉血栓未查体/超声', '肿瘤相关血栓', '抗凝禁忌和出血风险未评估', '慢性血栓栓塞性肺高压'],
    risks: ['阻塞性休克', '右心衰竭', '低氧和猝死', '抗凝相关出血', '复发性 VTE', '慢性肺高压'],
    plan: ['进行 Wells/修正 Geneva 评分，结合 D-二聚体、下肢静脉超声和 CTPA 分层', '如血流动力学不稳定，床旁超声评估右心负荷并立即多学科会诊', '在排除禁忌后按风险分层考虑抗凝，必要时评估溶栓、介入或外科取栓', '持续监测氧合、血压、心率、出血和血红蛋白变化', '寻找诱因：肿瘤、手术卧床、妊娠/产褥、血栓倾向和药物因素'],
  },
  {
    topic: '急性心力衰竭',
    keywords: ['bnp', 'nt-probnp', '水肿', '端坐', '粉红泡沫', '心衰', '啰音', '低氧', '肺水肿'],
    diagnosis: '急性心力衰竭或感染/缺血诱发心功能失代偿需评估',
    differentials: ['肺炎', '急性冠脉综合征', '肺栓塞', '肾衰容量负荷过多', 'COPD/哮喘急性加重'],
    missed: ['瓣膜急症', '快速房颤或其他心律失常', '心肌炎', '药物诱发液体潴留', '右心衰/肺高压'],
    risks: ['急性肺水肿', '心源性休克', '肾功能恶化', '低钾/高钾和心律失常', '利尿过度导致低灌注', '再入院风险'],
    plan: ['床旁评估容量状态、灌注、肺部啰音、颈静脉和下肢水肿', '完善 BNP/NT-proBNP、肌钙蛋白、心电图、超声心动图、胸片/肺超声和肾功能电解质', '按血压和容量状态选择氧疗、利尿、扩血管、正性肌力或血管活性药物', '寻找诱因：感染、缺血、心律失常、贫血、肾衰、药物依从性差', '每日记录出入量、体重、尿量和电解质，制定出院二级预防计划'],
  },
  {
    topic: '糖尿病急症',
    keywords: ['血糖', '酮', '糖尿病', '酸中毒', '渗透压', '多饮', '多尿', '低血糖'],
    diagnosis: '糖尿病急性代谢紊乱待排（DKA/HHS/低血糖），需寻找感染、心梗或停药诱因',
    differentials: ['感染诱发应激性高血糖', '乳酸酸中毒', '肾衰相关代谢性酸中毒', '药物相关高血糖', '中毒或内分泌危象'],
    missed: ['SGLT2 抑制剂相关正常血糖 DKA', '老年 HHS 合并脱水和血栓', '低钾被胰岛素治疗加重', '隐匿感染灶', '低血糖后反跳高血糖'],
    risks: ['休克和急性肾损伤', '低钾/高钾相关心律失常', '脑水肿（快速纠正时）', '血栓栓塞', '治疗中低血糖', '高渗昏迷'],
    plan: ['立即测血糖、血酮/尿酮、血气、电解质、渗透压、尿量和感染指标', '先补液并严密监测尿量、钾和意识状态', '符合指征时小剂量胰岛素泵入，钾低时先补钾再用胰岛素', '寻找并处理诱因：感染、停药、心梗、卒中、胰腺炎或药物', '制定过渡到皮下胰岛素、饮食运动和自我监测教育计划'],
  },
  {
    topic: '卒中/神经急症',
    keywords: ['偏瘫', '失语', '意识', '抽搐', '头痛', '眩晕', '瞳孔', '脑卒中', '脑梗', '脑出血'],
    diagnosis: '急性脑血管病或神经系统急症待排，需明确发病时间窗和卒中类型',
    differentials: ['低血糖', '癫痫后 Todd 麻痹', '颅内感染', '脑肿瘤/占位', '中毒或代谢性脑病', '前庭周围性眩晕'],
    missed: ['后循环卒中', '蛛网膜下腔出血', '抗凝相关颅内出血', '感染/脓毒症相关脑病', '非惊厥性癫痫持续状态'],
    risks: ['脑疝', '吞咽障碍和误吸', '癫痫', '深静脉血栓', '压疮和谵妄', '溶栓/取栓相关出血'],
    plan: ['确认最后正常时间、NIHSS、血糖和生命体征，建立卒中绿色通道', '急查头颅 CT/CTA 或 MRI，区分出血与缺血并评估大血管闭塞', '在时间窗内评估静脉溶栓、机械取栓和禁忌证', '进行吞咽筛查、DVT 预防、血压血糖体温管理和康复早期介入', '寻找病因：房颤、大动脉粥样硬化、心源性栓塞、感染或凝血异常'],
  },
];

const neverMissChecklist = [
  '胸痛/背痛：主动脉夹层、急性冠脉综合征、肺栓塞、张力性气胸、食管破裂',
  '发热/感染：脓毒症、脑膜炎、坏死性软组织感染、胆道/泌尿/腹腔感染灶',
  '气促/低氧：肺栓塞、心衰、重症肺炎、气胸、哮喘/COPD 急性加重',
  '腹痛/休克：消化道穿孔、肠缺血、胰腺炎、异位妊娠/妇科急症、腹主动脉瘤',
  '意识改变：低血糖、卒中/颅内出血、癫痫持续状态、中毒、低钠/高钠、肝肾衰脑病',
  '老年/糖尿病/免疫抑制患者：症状可不典型，需主动排查无痛性心梗、隐匿感染和药物不良反应',
];

const appState = {
  caseData: { ...DEFAULT_CASE },
  recentCases: loadRecentCases(),
  messages: [
    { role: 'assistant', text: '请录入病例。我会按“先救命、再定位、再验证、再复盘”的规培思路，给出诊断谱、漏诊核查、风险并发症和诊疗计划。' },
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

  const primary = matches[0] ?? fallbackRule();
  const combined = matches.length ? matches : [primary];
  const vitals = extractVitals(text);
  const redFlags = detectRedFlags(text, vitals);
  const contextRisks = detectContextRisks(text, vitals);
  const rankedDiagnoses = combined.map((item, index) => ({
    title: item.diagnosis,
    topic: item.topic,
    level: index === 0 ? '首要考虑' : item.score >= 3 ? '强相关' : '需排除',
    score: item.score ?? 0,
  }));

  return {
    primary,
    rankedDiagnoses,
    redFlags,
    differentials: uniqueList([...combined.flatMap((item) => item.differentials), ...redFlags]).slice(0, 14),
    missed: uniqueList([...combined.flatMap((item) => item.missed), ...neverMissChecklist]).slice(0, 16),
    risks: uniqueList([...contextRisks, ...combined.flatMap((item) => item.risks)]).slice(0, 16),
    plan: uniqueList([
      '立即确认生命体征、意识、气道/呼吸/循环，先处理低氧、休克、胸痛、意识障碍等危急状态',
      ...combined.flatMap((item) => item.plan),
      '为每个鉴别诊断设定“支持证据、反对证据、下一项验证检查、何时升级处理”',
      '记录复盘节点：2 小时看生命体征/尿量/乳酸，24–48 小时看培养、影像、疗效和不良反应',
    ]).slice(0, 14),
    vitals,
    completeness: evaluateCompleteness(caseData),
  };
}

function fallbackRule() {
  return {
    topic: '未匹配到明确主题',
    diagnosis: '资料不足，需补充病史、查体、关键化验和影像后建立问题清单',
    differentials: ['感染性疾病', '心肺急症', '神经急症', '代谢/内分泌急症', '药物或中毒相关问题', '外科急腹症'],
    missed: ['妊娠相关疾病', '免疫抑制状态', '近期手术/侵入操作并发症', '患者真实用药史和过敏史', '暴露史/旅行史/职业史'],
    risks: ['病情进展导致休克或呼吸循环衰竭', '检查延误造成诊断偏差', '用药禁忌或相互作用', '院内感染、跌倒、压疮和谵妄风险'],
    plan: ['补齐主诉、现病史、既往史、用药史、过敏史、查体和关键辅助检查', '按危急值与生命体征先处理威胁生命的问题', '请上级医师床旁复核诊断路径'],
    score: 0,
  };
}

function extractVitals(text) {
  const numberAfter = (patterns) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return Number(match[1]);
    }
    return null;
  };
  return {
    temperature: numberAfter([/t\s*([0-9]+\.?[0-9]*)/, /体温\s*([0-9]+\.?[0-9]*)/]),
    heartRate: numberAfter([/hr\s*([0-9]+)/, /心率\s*([0-9]+)/]),
    respiratoryRate: numberAfter([/rr\s*([0-9]+)/, /呼吸\s*([0-9]+)/]),
    systolicBp: numberAfter([/bp\s*([0-9]+)\s*\//, /血压\s*([0-9]+)\s*\//]),
    spo2: numberAfter([/spo₂\s*([0-9]+)/, /spo2\s*([0-9]+)/, /氧饱和度\s*([0-9]+)/]),
    lactate: numberAfter([/乳酸\s*([0-9]+\.?[0-9]*)/, /lactate\s*([0-9]+\.?[0-9]*)/]),
  };
}

function detectRedFlags(text, vitals) {
  const flags = [];
  if (text.includes('胸痛') || text.includes('胸闷') || text.includes('肌钙蛋白')) flags.push('主动脉夹层、肺栓塞、气胸和急性冠脉综合征需同步排除');
  if (text.includes('发热') || text.includes('感染') || text.includes('pct') || text.includes('crp')) flags.push('脓毒症、隐匿感染灶和耐药/特殊病原体感染需排除');
  if (text.includes('气促') || text.includes('低氧') || (vitals.spo2 && vitals.spo2 < 92)) flags.push('低氧原因需同时覆盖肺炎、肺栓塞、心衰、气胸和气道疾病');
  if (text.includes('d-二聚体') || text.includes('d二聚体')) flags.push('D-二聚体升高不能单独诊断肺栓塞，需结合临床概率和影像');
  if (vitals.systolicBp && vitals.systolicBp < 90) flags.push('休克病因需覆盖感染性、心源性、低容量性、阻塞性和过敏性休克');
  if (text.includes('意识') || text.includes('昏迷') || text.includes('抽搐')) flags.push('意识改变需立即排除低血糖、卒中、颅内出血、中毒和代谢紊乱');
  return flags;
}

function detectContextRisks(text, vitals) {
  const risks = [];
  if (vitals.spo2 && vitals.spo2 < 92) risks.push(`SpO₂ ${vitals.spo2}%：低氧高危，需氧疗升级和呼吸衰竭监测`);
  if (vitals.systolicBp && vitals.systolicBp < 100) risks.push(`收缩压 ${vitals.systolicBp} mmHg：低灌注/休克风险，需复测乳酸和尿量`);
  if (vitals.heartRate && vitals.heartRate > 100) risks.push(`心率 ${vitals.heartRate} 次/分：感染、缺氧、疼痛、休克或心律失常风险`);
  if (vitals.respiratoryRate && vitals.respiratoryRate >= 22) risks.push(`呼吸频率 ${vitals.respiratoryRate} 次/分：qSOFA 阳性要素，需警惕脓毒症恶化`);
  if (vitals.lactate && vitals.lactate >= 2) risks.push(`乳酸 ${vitals.lactate} mmol/L：组织低灌注风险，需动态复测`);
  if (text.includes('肌酐') || text.includes('肾')) risks.push('肾功能异常：造影剂、抗菌药、抗凝药和利尿剂需按肾功能调整');
  if (text.includes('肌钙蛋白')) risks.push('肌钙蛋白升高：需区分 1 型心梗、2 型心梗、心肌炎和肾衰相关升高');
  return risks;
}

function evaluateCompleteness(caseData) {
  const fields = [
    ['主诉', caseData.chiefComplaint],
    ['病史/用药/过敏', caseData.history],
    ['查体和生命体征', caseData.exam],
    ['化验/影像/心电图', caseData.labs],
  ];
  const missing = fields.filter(([, value]) => !String(value || '').trim()).map(([label]) => label);
  return { filled: fields.length - missing.length, total: fields.length, missing };
}

function uniqueList(items) {
  return [...new Set(items.filter(Boolean))];
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
        <div class="hero-copy-block">
          <p class="eyebrow">Resident Training Clinical Command Center</p>
          <h1>规培生病例推演与防漏诊训练系统</h1>
          <p class="hero-copy">以问题清单为核心，整合病例录入、诊断谱、漏诊核查、风险并发症、诊疗计划、指南量表和大屏对话训练。</p>
          <div class="hero-actions">
            <button class="ghost-button" id="scroll-chat">进入大对话区</button>
            <span>⚕️ 教学用途 · 必须由上级医师复核</span>
          </div>
        </div>
        <div class="hero-panel">
          <div><strong>${analysis.rankedDiagnoses.length}</strong><span>诊断线索</span></div>
          <div><strong>${analysis.risks.length}</strong><span>风险提醒</span></div>
          <div><strong>${analysis.completeness.filled}/${analysis.completeness.total}</strong><span>资料完整度</span></div>
        </div>
      </header>

      <section class="command-strip">
        ${renderInsightChip('首要诊断', analysis.primary.topic, 'blue')}
        ${renderInsightChip('必须排除', analysis.differentials[0] || '补充资料后判断', 'orange')}
        ${renderInsightChip('最高风险', analysis.risks[0] || '暂无明确高危信号', 'red')}
        ${renderInsightChip('下一步', analysis.plan[0], 'green')}
      </section>

      <section class="grid intake-grid">
        ${card('📄', '1. 病例与化验单录入', renderCaseForm(), 'card-tall')}
        ${card('🕘', '7. 最近 10 次使用记录', renderHistory(), 'history-card')}
      </section>

      <section class="diagnosis-board">
        ${card('🧭', '2. 诊断总览：先列全，再分层', renderDiagnosis(analysis), 'diagnosis-card')}
        ${card('🛡️', '防漏诊核查清单', renderMissed(analysis), 'missed-card')}
      </section>

      <section class="grid clinical-grid">
        ${card('⚠️', '4. 风险与需关注并发症', renderRisks(analysis), 'risk-card')}
        ${card('📋', '5. 完整诊疗计划', renderPlan(analysis), 'plan-card')}
      </section>

      <section class="grid bottom-grid">
        ${card('📚', '3. 最新指南与相关量表链接/PDF入口', renderResources(), 'resource-wrap')}
        ${card('💬', '6. 大对话训练区', renderChat(), 'chat-card')}
      </section>
    </main>
  `;
  bindEvents();
}

function card(icon, title, content, extraClass = '') {
  return `
    <article class="card ${extraClass}">
      <div class="card-title"><span class="title-icon">${icon}</span><h2>${title}</h2></div>
      <div class="dynamic-content">${content}</div>
    </article>
  `;
}

function renderInsightChip(label, value, tone) {
  return `<div class="insight-chip ${tone}"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderCaseForm() {
  return `
    <div class="form-grid compact">
      ${inputField('姓名/编号', 'name')}
      ${inputField('年龄', 'age')}
      ${inputField('性别', 'sex')}
    </div>
    ${textareaField('主诉', 'chiefComplaint')}
    ${textareaField('现病史/既往史/用药史/过敏史', 'history', 5)}
    ${textareaField('查体与生命体征', 'exam', 5)}
    ${textareaField('化验单/影像/心电图/量表结果', 'labs', 7)}
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
    return '<div class="empty-state"><strong>尚无历史病例</strong><span>点击左侧保存后，将自动保留最近 10 次，可一键回放训练。</span></div>';
  }
  return `
    <div class="history-list">
      ${appState.recentCases
        .map(
          (record, index) => `
            <button class="history-item" data-history-id="${record.id}">
              <span class="history-index">${index + 1}</span>
              <strong>${escapeHtml(record.summary)}</strong>
              <small>${new Date(record.savedAt).toLocaleString('zh-CN')}</small>
            </button>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderDiagnosis(analysis) {
  return `
    <div class="ranked-list">
      ${analysis.rankedDiagnoses
        .map(
          (item) => `
            <div class="ranked-item">
              <span class="level-pill">${item.level}</span>
              <div><strong>${escapeHtml(item.topic)}</strong><p>${escapeHtml(item.title)}</p></div>
              <small>线索 ${item.score}</small>
            </div>
          `,
        )
        .join('')}
    </div>
    ${list('鉴别诊断：结合本病例必须逐项排除', analysis.differentials, 'split-list')}
  `;
}

function renderMissed(analysis) {
  return `
    <div class="redflag-box"><strong>防漏诊原则：</strong>任何胸痛、低氧、低血压、意识改变、乳酸升高、肌钙蛋白升高，都必须先排除可致死诊断，再讨论常见病。</div>
    ${list('', analysis.missed, 'dense-list')}
  `;
}

function renderRisks(analysis) {
  return `
    ${list('', analysis.risks, 'risk-list')}
    <div class="warning-box">⚠️ 若出现意识障碍、低血压、SpO₂ 持续下降、尿量减少、乳酸升高、胸痛加重或心电图动态改变，应立即升级处置并呼叫上级医师/ICU。</div>
  `;
}

function renderPlan(analysis) {
  return `<ol class="ordered-list timeline-list">${analysis.plan.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
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
    <div class="quick-prompts">
      <button data-prompt="这个病例最不能漏掉哪些诊断？">不能漏什么？</button>
      <button data-prompt="下一步检查和处置按优先级怎么排？">下一步优先级</button>
      <button data-prompt="哪些风险提示需要立即请上级或ICU？">何时升级？</button>
    </div>
    <div class="chat-window" id="chat-window">
      ${appState.messages.map((message) => `<div class="chat-message ${message.role}">${escapeHtml(message.text)}</div>`).join('')}
    </div>
    <form class="chat-form" id="chat-form">
      <textarea id="question-input" rows="3" placeholder="可直接追问：鉴别诊断怎么排？还会漏掉什么？治疗方案是否符合该病例风险？"></textarea>
      <button type="submit">发送提问</button>
    </form>
  `;
}

function list(title, items, className = '') {
  return `
    <div>
      ${title ? `<h3>${title}</h3>` : ''}
      <ul class="check-list ${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
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
  document.getElementById('scroll-chat').addEventListener('click', () => document.querySelector('.chat-card').scrollIntoView({ behavior: 'smooth', block: 'start' }));

  document.querySelectorAll('[data-history-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const record = appState.recentCases.find((item) => item.id === button.dataset.historyId);
      if (!record) return;
      appState.caseData = { ...record.caseData };
      appState.messages.push({ role: 'assistant', text: `已载入历史病例：${record.summary}` });
      render();
    });
  });

  document.querySelectorAll('[data-prompt]').forEach((button) => {
    button.addEventListener('click', () => submitQuestion(button.dataset.prompt));
  });

  document.getElementById('chat-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('question-input');
    submitQuestion(input.value.trim());
  });
}

function updateAnalysisPanels() {
  const analysis = analyzeCase(appState.caseData);
  const sections = document.querySelectorAll('.diagnosis-board .card .dynamic-content, .clinical-grid .card .dynamic-content');
  sections[0].innerHTML = renderDiagnosis(analysis);
  sections[1].innerHTML = renderMissed(analysis);
  sections[2].innerHTML = renderRisks(analysis);
  sections[3].innerHTML = renderPlan(analysis);
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

function submitQuestion(question) {
  if (!question) return;
  const input = document.getElementById('question-input');
  const analysis = analyzeCase(appState.caseData);
  appState.messages.push({ role: 'user', text: question });
  appState.messages.push({ role: 'assistant', text: buildTeachingReply(question, analysis, appState.caseData) });
  if (input) input.value = '';
  render();
  document.querySelector('.chat-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildTeachingReply(question, analysis, caseData) {
  const text = question.toLowerCase();
  if (text.includes('漏') || text.includes('鉴别') || text.includes('排除')) {
    return `本病例防漏诊优先级：${analysis.differentials.slice(0, 6).join('；')}。请为每项写明支持/反对证据，并用检查闭环验证，不能只用单一化验结果下结论。`;
  }
  if (text.includes('检查') || text.includes('检验') || text.includes('下一步') || text.includes('优先')) {
    return `下一步按优先级：1）${analysis.plan.slice(0, 3).join('；2）')}；3）同步复盘危急值和影像。病例中${caseData.labs ? '已有化验线索，重点看动态趋势和是否能解释全部症状。' : '化验资料不足，应尽快补齐关键检验和影像。'}`;
  }
  if (text.includes('icu') || text.includes('危重') || text.includes('转入') || text.includes('升级')) {
    return `升级处置触发点：${analysis.risks.slice(0, 6).join('；')}。若出现持续低氧、低血压、乳酸不降、少尿、意识改变或需要血管活性药，应立即请 ICU/上级医师。`;
  }
  if (text.includes('用药') || text.includes('治疗') || text.includes('抗生素') || text.includes('抗凝')) {
    return `治疗要与诊断概率和风险匹配：先处理威胁生命的问题，再按禁忌证选择药物；尤其核对过敏史、肝肾功能、出血风险、相互作用和指南适应证。当前可从“${analysis.plan[0]}”开始。`;
  }
  return `建议按 PBL 追问：1）首要诊断 ${analysis.primary.topic} 的证据是否足够；2）${analysis.differentials[0] || '最危险鉴别诊断'} 如何排除；3）${analysis.risks[0] || '最高风险'} 如何监测；4）何时复盘疗效与调整方案。`;
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
