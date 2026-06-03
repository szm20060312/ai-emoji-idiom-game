// ============================================
// AI 表情猜谜王 — 后端服务
// 功能：代理 AI API 生成 emoji 谜题
// 启动：node server.js
// ============================================

const express = require("express");
const cors = require("cors");
const path = require("path");

// 尝试加载 .env 文件（如果存在）
try {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
} catch (e) {
  // dotenv 不是必需的，没有 .env 文件就用环境变量
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
// 托管前端静态文件（这样可以用 http://localhost:3000 直接访问整个游戏）
app.use(express.static(__dirname));

// ============================================
// 构建 AI Prompt（四字成语）
// ============================================
function buildPrompt(excludeAnswers = []) {
  // 随机种子：从丰富的成语库中随机挑几个作为示例，增加多样性
  const sampleIdioms = [
    "画蛇添足", "守株待兔", "画龙点睛", "对牛弹琴", "掩耳盗铃",
    "亡羊补牢", "井底之蛙", "杯弓蛇影", "叶公好龙", "狐假虎威",
    "闻鸡起舞", "悬梁刺股", "破釜沉舟", "卧薪尝胆", "纸上谈兵",
    "指鹿为马", "鹤立鸡群", "鸡飞蛋打", "龙飞凤舞", "虎头蛇尾",
  ];
  // 随机选 6 个作为示例
  const shuffled = sampleIdioms.sort(() => 0.5 - Math.random());
  const examples = shuffled.slice(0, 6).join("」「");

  let prompt = `你是一个 emoji 谜题生成器。请生成一道 emoji 谜题。

【唯一规则：谜底必须是常用四字成语】
- 只能出大众熟知的四字成语
- 参考成语库（不限于此）：「${examples}」
- 使用 4-6 个 emoji 来形象地表示这个成语
- 禁止生僻成语（如「饕餮盛宴」「魑魅魍魉」这类普通人看不懂的）
- 答案必须恰好 4 个汉字
- 每次生成不同的成语，不要总是重复同一个`;

  if (excludeAnswers.length > 0) {
    const excludeList = excludeAnswers.join("、");
    prompt += `\n\n【硬性排除】以下成语绝对不能再出现：${excludeList}`;
  }

  prompt += `\n\n请严格用 JSON 格式回复（不要包含其他文字）：
{
  "emoji": "emoji组合（用空格分隔）",
  "answer": "四字成语"
}`;

  return prompt;
}

// ============================================
// 调用 AI API 生成谜题
// ============================================
async function generateWithAI(excludeAnswers = []) {
  const provider = process.env.AI_PROVIDER || "anthropic";

  if (provider === "openai") {
    return generateWithOpenAI(excludeAnswers);
  }
  if (provider === "deepseek") {
    return generateWithDeepSeek(excludeAnswers);
  }
  // 默认 Anthropic
  return generateWithAnthropic(excludeAnswers);
}

// Anthropic API 调用
async function generateWithAnthropic(excludeAnswers) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 ANTHROPIC_API_KEY，请在 .env 文件中设置");
  }

  const prompt = buildPrompt(excludeAnswers);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API 错误 ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`AI 返回格式异常，无法解析 JSON: ${text}`);
  }

  const puzzle = JSON.parse(jsonMatch[0]);

  return {
    emoji: puzzle.emoji || "🤔❓",
    answer: puzzle.answer || "未知",
    hint: puzzle.hint || "",
  };
}

// OpenAI API 调用
async function generateWithOpenAI(excludeAnswers) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 OPENAI_API_KEY，请在 .env 文件中设置");
  }

  const prompt = buildPrompt(excludeAnswers);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "你是一个 emoji 谜题生成器，始终用 JSON 格式回复。只出大众熟知的词汇，禁止偏题怪题。" },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API 错误 ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`AI 返回格式异常，无法解析 JSON: ${text}`);
  }

  const puzzle = JSON.parse(jsonMatch[0]);

  return {
    emoji: puzzle.emoji || "🤔❓",
    answer: puzzle.answer || "未知",
    hint: puzzle.hint || "",
  };
}

// DeepSeek API 调用（OpenAI 兼容接口）
async function generateWithDeepSeek(excludeAnswers) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY，请在 .env 文件中设置");
  }

  const prompt = buildPrompt(excludeAnswers);

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个 emoji 谜题生成器，始终用 JSON 格式回复。只出大众熟知的词汇，禁止偏题怪题。" },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API 错误 ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`AI 返回格式异常，无法解析 JSON: ${text}`);
  }

  const puzzle = JSON.parse(jsonMatch[0]);

  return {
    emoji: puzzle.emoji || "🤔❓",
    answer: puzzle.answer || "未知",
    hint: puzzle.hint || "",
  };
}

// ============================================
// API 路由
// ============================================

// 生成谜题
app.post("/api/generate-puzzle", async (req, res) => {
  const { excludeAnswers } = req.body;

  // 确保 excludeAnswers 是数组
  const excludes = Array.isArray(excludeAnswers) ? excludeAnswers : [];

  try {
    console.log(`[请求] 成语${excludes.length > 0 ? `，已排除 ${excludes.length} 个` : ""}`);
    const puzzle = await generateWithAI(excludes);

    // 始终从答案自动提取首字提示（100% 准确）
    if (puzzle.answer && puzzle.answer.length > 0) {
      puzzle.hint = puzzle.answer[0];
    } else {
      puzzle.hint = "";
    }

    console.log(`[成功] AI 生成: ${puzzle.emoji} → ${puzzle.answer}`);
    res.json(puzzle);
  } catch (err) {
    console.error(`[错误] AI 生成失败: ${err.message}`);
    res.status(503).json({
      error: "AI 服务暂时不可用，请稍后重试",
    });
  }
});

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI 表情猜谜王后端运行中 🎮" });
});

// ============================================
// 启动服务器
// ============================================
app.listen(PORT, () => {
  console.log("🎮 ================================");
  console.log(`   AI 表情猜谜王 后端已启动！`);
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api/generate-puzzle`);
  console.log("   ================================");

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasDeepSeekKey = !!process.env.DEEPSEEK_API_KEY;
  if (hasAnthropicKey || hasOpenAIKey || hasDeepSeekKey) {
    console.log("   ✅ AI API 已配置 — 全部题目由 AI 动态生成");
  } else {
    console.log("   ❌ 未配置 AI API Key，服务无法运行");
    console.log("   💡 复制 .env.example 为 .env 并填入 API Key");
  }
  console.log("🎮 ================================");
});
