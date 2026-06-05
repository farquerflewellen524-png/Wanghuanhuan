import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 5173);
const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const systemPrompt = `你是规培生培养系统中的医学教学助手。请使用中文回答。
你的任务：结合用户录入病例、化验单、生命体征和问题，给出适合住院医师规范化培训的临床推理。
要求：
1. 先说明最需要立即处理的危急问题，再列出首要诊断、鉴别诊断、不能漏诊的致死性诊断。
2. 诊断、风险、并发症和诊疗计划必须与病例信息匹配；资料不足时明确写出还缺什么。
3. 涉及最新指南、药物、量表、流程或时效性信息时，必须使用网络搜索并引用权威来源。
4. 不替代真实临床决策；结尾提醒必须由上级医师/专科医师结合当地指南和患者情况复核。
5. 避免编造指南年份、药物剂量或来源；不确定时说明不确定并建议查阅原文。`;

createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/api/chat') {
    await handleChat(request, response);
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  await serveStatic(request, response);
}).listen(PORT, () => {
  console.log(`规培生培养系统已启动：http://127.0.0.1:${PORT}`);
});

async function handleChat(request, response) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(response, 400, {
      error: '未配置 OPENAI_API_KEY。请在启动服务前设置环境变量，例如：OPENAI_API_KEY=sk-... npm run start',
    });
    return;
  }

  const payload = await readJson(request);
  const question = String(payload.question || '').trim();
  if (!question) {
    sendJson(response, 400, { error: '问题不能为空。' });
    return;
  }

  const model = String(payload.model || DEFAULT_MODEL);
  const enableWebSearch = payload.webSearch !== false;
  const caseContext = buildCaseContext(payload.caseData, payload.localAnalysis);

  const body = {
    model,
    input: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `病例资料与本地初步分析：\n${caseContext}\n\n用户问题：${question}`,
      },
    ],
    tools: enableWebSearch
      ? [
          {
            type: 'web_search',
            external_web_access: true,
            user_location: {
              type: 'approximate',
              country: 'CN',
              timezone: 'Asia/Shanghai',
            },
          },
        ]
      : [],
    tool_choice: enableWebSearch ? 'auto' : undefined,
    include: enableWebSearch ? ['web_search_call.action.sources'] : undefined,
  };

  const upstream = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  if (!upstream.ok) {
    sendJson(response, upstream.status, {
      error: data.error?.message || 'OpenAI API 调用失败。',
      details: data.error,
    });
    return;
  }

  const parsed = parseResponse(data);
  sendJson(response, 200, {
    answer: parsed.answer,
    citations: parsed.citations,
    sources: parsed.sources,
    model,
    webSearch: enableWebSearch,
  });
}

function buildCaseContext(caseData = {}, localAnalysis = {}) {
  return JSON.stringify(
    {
      patient: {
        nameOrId: caseData.name,
        age: caseData.age,
        sex: caseData.sex,
        chiefComplaint: caseData.chiefComplaint,
        history: caseData.history,
        exam: caseData.exam,
        labsAndImaging: caseData.labs,
      },
      localAnalysis: {
        primaryTopic: localAnalysis.primaryTopic,
        rankedDiagnoses: localAnalysis.rankedDiagnoses,
        differentials: localAnalysis.differentials,
        missedDiagnoses: localAnalysis.missed,
        risks: localAnalysis.risks,
        plan: localAnalysis.plan,
      },
    },
    null,
    2,
  );
}

function parseResponse(data) {
  const message = data.output?.find((item) => item.type === 'message');
  const textContent = message?.content?.find((item) => item.type === 'output_text');
  const answer = data.output_text || textContent?.text || '模型未返回文本答案。';
  const citations = (textContent?.annotations || [])
    .filter((annotation) => annotation.type === 'url_citation')
    .map((annotation) => ({
      title: annotation.title || annotation.url,
      url: annotation.url,
      startIndex: annotation.start_index,
      endIndex: annotation.end_index,
    }));
  const sources = data.output
    ?.filter((item) => item.type === 'web_search_call')
    .flatMap((item) => item.action?.sources || [])
    .map((source) => ({ title: source.title || source.url, url: source.url })) || [];
  return { answer, citations, sources };
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const safePath = normalize(requestedPath).replace(/^([/\\])+/, '');
  const filePath = join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}
