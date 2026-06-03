# 🏮 AI 表情猜成语

> 看 Emoji，猜四字成语！AI 动态生成无限谜题。

一个纯前端 + 简易后端的网页猜谜游戏。AI 根据你的选择实时生成 emoji 谜题，你需要从 emoji 组合中猜出对应的四字成语。

## ✨ 功能

- 🤖 **AI 动态出题** — DeepSeek API 实时生成，每局都是新题，永不重复
- 🏮 **四字成语** — 全部谜底为大众熟知的常用成语
- 🔥 **连击计分** — 连续答对触发 combo 加成，最高 +10 分
- 💡 **提示系统** — 每局 3 次提示机会，逐级揭示（首字 → 末字 → 前两字）
- ⏱️ **倒计时** — 每题 40 秒限时，紧张刺激
- 🏆 **排行榜** — localStorage 本地存储，同名玩家自动保留最高分
- 📱 **响应式** — 手机和桌面端都能流畅游玩
- 🎨 **毛玻璃 UI** — 深色主题 + 渐变背景 + 流畅动画

## 🎮 快速开始

### 前提条件

- [Node.js](https://nodejs.org/) ≥ 18
- [DeepSeek API Key](https://platform.deepseek.com/)（免费注册即可获取）

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/szm20060312/ai-emoji-idiom-game.git
cd ai-emoji-idiom-game

# 2. 安装依赖
npm install

# 3. 配置 API Key
cp .env.example .env
# 编辑 .env 文件，填入你的 DeepSeek API Key

# 4. 启动
node server.js

# 5. 打开浏览器
# http://localhost:3000
```

## 🛠️ 技术栈

| 层 | 技术 |
|------|------|
| **前端** | HTML5 · CSS3 · Vanilla JavaScript (ES6+) |
| **后端** | Node.js · Express 4.x |
| **AI** | DeepSeek API（兼容 OpenAI 格式，也支持 Anthropic / OpenAI） |
| **存储** | 浏览器 localStorage |
| **开发工具** | VS Code · Live Server |
| **运行环境** | 纯本地，Node.js ≥ 18 |

### 为什么选择这些技术？

- **零框架前端**：纯原生 HTML/CSS/JS，无需学习 React/Vue，适合编程初学者理解和修改
- **Express**：最简洁的 Node.js 后端框架，一个文件即可完成 API 代理
- **DeepSeek API**：国产 AI，注册简单，性价比高，API 兼容 OpenAI 格式
- **localStorage**：排行榜数据存浏览器本地，无需数据库

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

- API Key 存储在 `.env` 文件，已通过 `.gitignore` 排除
- 前端代码中不包含任何密钥
- 后端作为 API 代理，前端不直接调用 AI 服务

## 📝 License

MIT

---

*一个编程初学者的学习项目 — 2026年6月*
