# 🏮 AI 表情猜成语

> 看 Emoji，猜四字成语！AI 动态生成无限谜题。

一个纯前端 + 简易后端的网页猜谜游戏。AI 实时生成 emoji 谜题，玩家从 emoji 组合中猜出对应的四字成语。

> 🌀 **Vibe Coding 项目** — 本项目通过 AI 辅助编程（Claude Code）完成开发，从需求讨论、架构设计到代码实现，全程由 AI 协作驱动。

## ✨ 功能

- 🤖 **AI 动态出题** — DeepSeek API 实时生成，每局都是新题，永不重复
- 🏮 **四字成语** — 全部谜底为大众熟知的常用成语
- 🔥 **连击计分** — 连续答对触发 combo 加成，最高 +10 分
- 💡 **提示系统** — 每局 3 次提示机会，逐级揭示（首字 → 末字 → 前两字）
- ⏱️ **倒计时** — 每题 40 秒限时，紧张刺激
- 🏆 **排行榜** — localStorage 本地存储，同名玩家自动保留最高分
- 📱 **响应式** — 手机和桌面端都能流畅游玩
- 🎨 **毛玻璃 UI** — 深色主题 + 渐变背景 + 流畅动画

## 🎮 安装与运行

### 第一步：安装 Node.js

本项目需要 Node.js ≥ 18。在终端中检查是否已安装：

```bash
node --version
# 应显示 v18.x.x 或更高
```

如果未安装，去 [nodejs.org](https://nodejs.org/) 下载 LTS 版本并安装。安装完成后重新打开终端，再次运行 `node --version` 确认。

---

### 第二步：克隆仓库并安装依赖

```bash
# 克隆项目到本地
git clone https://github.com/szm20060312/ai-emoji-idiom-game.git
cd ai-emoji-idiom-game

# 安装依赖（express、cors、dotenv）
npm install
```

---

### 第三步：获取 AI API Key（三选一）

游戏需要 AI 来生成谜题。支持三种 AI 服务，选一个即可。**推荐 DeepSeek**（国产，注册简单，有免费额度）。

<details>
<summary><strong>🔷 方案 A：DeepSeek（推荐）</strong></summary>

1. 打开 [platform.deepseek.com](https://platform.deepseek.com/)，注册账号
2. 登录后点击左侧菜单「API Keys」
3. 点击「创建 API Key」，输入名称（比如 `emoji-game`），点击创建
4. **复制生成的 Key**（格式为 `sk-xxxx...`，只显示一次，请妥善保存）
5. 在项目文件夹中创建 `.env` 文件：

```bash
cp .env.example .env
```

6. 用任意文本编辑器（VS Code 即可）打开 `.env`，修改为：

```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-你的key粘贴在这里
```

</details>

<details>
<summary><strong>🔶 方案 B：OpenAI</strong></summary>

1. 打开 [platform.openai.com](https://platform.openai.com/)，注册并登录
2. 进入「API Keys」页面，创建新 Key
3. 编辑 `.env` 文件：

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-你的key粘贴在这里
```

</details>

<details>
<summary><strong>🔵 方案 C：Anthropic (Claude)</strong></summary>

1. 打开 [console.anthropic.com](https://console.anthropic.com/)，注册并登录
2. 进入「API Keys」页面，创建新 Key
3. 编辑 `.env` 文件：

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-你的key粘贴在这里
```

</details>

> ⚠️ **安全提醒**：`.env` 文件已在 `.gitignore` 中排除，不会被上传到 GitHub。绝对不要把 API Key 写在 `script.js` 或 `index.html` 里。

---

### 第四步：启动游戏

```bash
node server.js
```

看到以下输出说明启动成功：

```
🎮 ================================
   AI 表情猜谜王 后端已启动！
   地址: http://localhost:3000
   ✅ AI API 已配置 — 全部题目由 AI 动态生成
🎮 ================================
```

如果提示 `❌ 未配置 AI API Key`，请回到第三步检查 `.env` 文件。

---

### 第五步：打开浏览器

访问 http://localhost:3000 ，输入昵称，点击"开始游戏"即可游玩。

---

### 常见问题

| 问题 | 解决方法 |
|------|----------|
| `node: command not found` | 未安装 Node.js，去看第一步 |
| `❌ 未配置 AI API Key` | `.env` 文件未创建或 Key 写错 |
| 游戏加载但不出题 | 查看终端日志：`[错误]` 开头的是错误信息 |
| `DeepSeek API 错误 401` | API Key 无效或已过期 |
| `DeepSeek API 错误 402` | 账户余额不足，去 platform.deepseek.com 充值 |
| 端口 3000 被占用 | 在 `.env` 中加 `PORT=3001` 换端口 |
| 题目一直重复 | 正常，JS 会自动重试最多 3 次确保去重 |

## 🛠️ 技术栈

| 层 | 技术 |
|------|------|
| **前端** | HTML5 · CSS3 · Vanilla JavaScript (ES6+) |
| **后端** | Node.js · Express 4.x |
| **AI** | DeepSeek API（兼容 OpenAI 格式，也支持 Anthropic / OpenAI） |
| **存储** | 浏览器 localStorage |
| **AI 开发** | Claude Code（Anthropic） — Vibe Coding 协作 |
| **运行环境** | 纯本地，Node.js ≥ 18 |

## 🔧 开发工具

| 工具 | 用途 |
|------|------|
| **VS Code** | 代码编辑器，主开发环境 |
| **Live Server** | VS Code 插件，前端热重载调试 |
| **Claude Code** | AI 编程助手，Vibe Coding 全流程协作（需求 → 设计 → 编码 → 测试） |
| **DeepSeek API** | AI 谜题生成（`deepseek-chat` 模型） |
| **终端 (zsh)** | macOS 终端，运行 `node server.js` |
| **Git & GitHub** | 版本管理 + 代码托管 |
| **Chrome DevTools** | 前端调试，Console / Network 排查问题 |

### 为什么选择这些技术？

- **零框架前端**：纯原生 HTML/CSS/JS，无需学习 React/Vue，适合编程初学者理解和修改
- **Express**：最简洁的 Node.js 后端框架，一个文件即可完成 API 代理
- **DeepSeek API**：国产 AI，注册简单，性价比高，API 兼容 OpenAI 格式
- **localStorage**：排行榜数据存浏览器本地，无需数据库
- **Claude Code**：Vibe Coding 模式，用自然语言描述需求，AI 辅助实现，降低编程门槛

## 📁 项目结构

```
├── index.html          # 前端主页面
├── style.css           # 样式表（CSS 变量 + 动画 + 响应式）
├── script.js           # 游戏逻辑（状态机 + API 调用 + 排行榜）
├── server.js           # Express 后端（AI API 代理 + 去重）
├── package.json        # npm 依赖
├── .env.example        # 环境变量模板（真实 .env 不提交）
├── docs/               # 项目文档
│   ├── requirements.md     # 需求文档
│   ├── technical-spec.md   # 技术规范
│   ├── design-spec.md      # 设计规范
│   ├── development-steps.md# 开发步骤
│   └── api-docs.md         # API 文档
└── devlog/             # 开发日志
```

## 🔒 安全

- API Key 存储在 `.env` 文件
- 前端代码中不包含任何密钥
- 后端作为 API 代理，前端不直接调用 AI 服务

## 📝 License

MIT

---

*一个编程初学者的学习项目 — 2026年6月*
