# 技术规范 — AI 表情猜谜王

> 版本：v1.0 | 更新：2026-06-02

## 技术栈

| 层 | 技术 | 版本要求 |
|------|------|----------|
| 前端 | 原生 HTML5 + CSS3 + ES6 JavaScript | 浏览器原生支持 |
| 后端 | Node.js + Express 4.x | Node.js ≥ 18 |
| AI API | Anthropic Claude / OpenAI GPT | 可选配置 |
| 存储 | 浏览器 localStorage | — |
| 开发工具 | VS Code + Live Server 插件 | — |

## 项目文件结构

```
AI Emoji Guessing Game/
├── index.html              # 前端主页面（5 个 page div）
├── style.css               # 全局样式（CSS 变量 + 动画 + 响应式）
├── script.js               # 前端游戏逻辑（状态机 + API 调用 + 存储）
├── server.js               # Express 后端（API 代理 + 兜底题库）
├── package.json            # npm 依赖声明
├── .env.example            # 环境变量模板
├── .env                    # 真实环境变量（不提交 Git）
├── docs/                   # 项目文档
│   ├── requirements.md     # 需求文档
│   ├── technical-spec.md   # 技术规范（本文件）
│   ├── design-spec.md      # 设计规范
│   ├── development-steps.md# 开发步骤
│   └── api-docs.md         # API 接口文档
└── devlog/                 # 开发日志
    └── YYYY-MM-DD.md       # 每日开发记录
```

## 架构设计

### 前后端交互

```
[浏览器 script.js]
     │
     │  POST /api/generate-puzzle
     │  Content-Type: application/json
     │  { "difficulty": "easy" | "medium" | "hard" }
     │
     ▼
[server.js Express]
     │
     ├── 尝试调用 AI API（Anthropic 或 OpenAI）
     │   └── 成功 → 返回 { emoji, answer, hint }
     │
     └── AI 不可用时 → 从 FALLBACK_PUZZLES 随机抽取
         └── 返回 { emoji, answer, hint }
     │
     ▼
[浏览器 script.js]
     │
     ├── 展示 emoji
     ├── 等待玩家输入
     ├── 判定答案
     └── 更新分数 / combo / 计时器
```

### 前端状态机

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐
│  start   │───→│  difficulty  │───→│   game   │───→│  result  │───→│ leaderboard│
│ (开始页) │    │  (选择难度)  │    │ (游戏循环)│    │ (结算页) │    │ (排行榜)   │
└──────────┘    └──────────────┘    └──────────┘    └──────────┘    └────────────┘
      ↑               ↑                                    │              │
      └───────────────┴────────────────────────────────────┴──────────────┘
                         各页面可互相跳转
```

## 关键设计决策

### 1. 为什么不用框架？
- 用户是初学者，原生 HTML/CSS/JS 学习曲线最低
- 项目体量小（5 个页面），不需要 React/Vue 的状态管理
- 有利于理解 Web 基础原理

### 2. API Key 安全
- Key 存在后端 `.env` 文件，由 `dotenv` 加载
- 前端代码中不出现任何 API Key
- `.env` 加入 `.gitignore`（如果后续使用 Git）

### 3. 兜底策略
- 后端维护 `FALLBACK_PUZZLES` 对象，按难度分类共 30 题
- AI 调用任何环节失败 → 自动使用预设题库
- 保证了离线/无 Key 场景下的可用性

### 4. 计分公式
```
单题得分 = 难度基础分 + combo 加成
基础分: easy=10, medium=20, hard=30
combo 加成: min(combo - 1, 5) × 2  （最高 +10）
```

## 浏览器兼容性

| API/特性 | Chrome | Safari | Firefox |
|-----------|--------|--------|---------|
| CSS 变量 | ✅ 49+ | ✅ 9.1+ | ✅ 31+ |
| backdrop-filter | ✅ 76+ | ✅ 9+ | ✅ 103+ |
| fetch() | ✅ 42+ | ✅ 10.1+ | ✅ 39+ |
| localStorage | ✅ 4+ | ✅ 3.1+ | ✅ 3.5+ |
| ES6 const/let/arrow | ✅ 49+ | ✅ 10+ | ✅ 36+ |
