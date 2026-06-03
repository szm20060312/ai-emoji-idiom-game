# API 接口文档 — AI 表情猜谜王

> 版本：v1.0 | 更新：2026-06-02

## 基础信息

- **Base URL**：`http://localhost:3000`
- **Content-Type**：`application/json`
- **认证**：无需认证（本地服务）

---

## 1. 健康检查

验证后端是否正常运行。

```
GET /api/health
```

**响应示例**：
```json
{
  "status": "ok",
  "message": "AI 表情猜谜王后端运行中 🎮"
}
```

---

## 2. 生成谜题

根据难度生成一道 emoji 谜题。优先调用 AI API，失败时 fallback 到本地预设题库。

```
POST /api/generate-puzzle
```

**请求体**：
```json
{
  "difficulty": "easy"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| difficulty | string | 是 | 难度等级：`"easy"` / `"medium"` / `"hard"` |

**成功响应** (200)：
```json
{
  "emoji": "🐝🏠",
  "answer": "蜂窝",
  "hint": "蜂"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| emoji | string | emoji 组合，空格分隔 |
| answer | string | 正确答案（中文） |
| hint | string | 提示文字，简单模式为首字，中高难度为空字符串 |

**错误响应** (400)：
```json
{
  "error": "无效的难度等级，请使用 \"easy\"、\"medium\" 或 \"hard\""
}
```

---

## 3. 静态文件服务

Express 同时托管项目根目录的静态文件，可直接访问前端页面：

```
GET /
```

返回 `index.html`，同时加载 `style.css` 和 `script.js`。

---

## 难度参数说明

| 难度 | AI Prompt 关键词 | emoji 数量 | 提示 | 特殊规则 |
|------|------------------|-----------|------|----------|
| easy | "常见物品/动物/日常词汇" | 3-4 个 | 返回首字 | 无 |
| medium | "成语/俗语/电影名/书名" | 4-6 个 | 空字符串 | 无 |
| hard | "抽象概念/英语短语/冷门梗" | 5-8 个 | 空字符串 | 前端 30 秒限时 |

---

## AI Provider 切换

在 `.env` 文件中设置：

```bash
# 使用 Anthropic（默认）
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# 或使用 OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
```

切换后重启后端即可生效。如果两个 Key 都未配置，后端自动使用本地预设题库。
