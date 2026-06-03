# CLAUDE.md — AI 表情猜谜王

> AI 助手工作指引。每次 Claude 在此项目中工作时，应首先阅读本文件。

## 项目概述

一款网页游戏：AI 生成 emoji 谜题，玩家看 emoji 猜词语。纯前端 + 简易 Node.js 后端。本地运行，面向编程初学者。

## 快速启动

```bash
# 一键启动（后端 + 前端）
node server.js
# 浏览器打开 http://localhost:3000

# 或分离启动：
# 终端 1：node server.js
# 终端 2：VS Code 右键 index.html → Open with Live Server (http://127.0.0.1:5500)
```

## 标准文件路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求文档 | [docs/requirements.md](docs/requirements.md) | 功能需求、非功能需求、用户流程 |
| 技术规范 | [docs/technical-spec.md](docs/technical-spec.md) | 技术栈、架构、数据流、兼容性 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 配色、字体、动画、组件、响应式 |
| 开发步骤 | [docs/development-steps.md](docs/development-steps.md) | 分阶段开发计划、待办、约定 |
| API 文档 | [docs/api-docs.md](docs/api-docs.md) | 后端接口说明 |
| 开发日志 | [devlog/](devlog/) | 每日开发记录（按日期命名） |

## 项目文件

| 文件 | 说明 |
|------|------|
| [index.html](index.html) | 前端主页面（5 个 page div） |
| [style.css](style.css) | 全局样式（CSS 变量 + 动画） |
| [script.js](script.js) | 游戏逻辑（状态机 + API 调用 + localStorage） |
| [server.js](server.js) | Express 后端（AI API 代理 + 兜底题库） |
| [package.json](package.json) | npm 依赖（express, cors, dotenv） |
| [.env.example](.env.example) | 环境变量模板 |

## 工作约定

### 开发模式
- **小步快跑**：每次只做一个功能增量，验证通过再继续
- **先跑通再优化**：功能可用优先于代码完美
- **每次改动后**：确保 `node server.js` 能正常启动，游戏能走通完整一局
- **记录日志**：每次开发完成后更新 `devlog/YYYY-MM-DD.md`

### 命名规范
- HTML id/class → `kebab-case`
- JS 变量/函数 → `camelCase`
- JS 常量 → `UPPER_SNAKE_CASE`
- CSS 类名 → `kebab-case`

### 技术约束
- 前端：**纯原生 HTML/CSS/JS**，不引入任何框架
- 后端：仅 Express + 内置模块，不引入额外库（除非讨论确认）
- API Key 绝对不可写入前端代码
- `.env` 文件决不提交到版本控制

### 测试检查点
每次改动后至少验证：
1. `node server.js` 启动正常
2. 游戏从输入昵称 → 选难度 → 答 5 题 → 结算页 → 排行榜，全程无 JS 报错
3. 无 API Key 时兜底题库正常工作

### 面向用户
- 用户是**编程初学者**，解释技术问题时用简单语言
- 改动代码后，告诉用户改了哪些文件、为什么改、如何验证
- 遇到技术决策时，给出推荐方案并解释理由

## 当前状态

- **Phase 1 已完成**：基础游戏可玩（2026-06-02）
- **Phase 2 待规划**：功能增强（题目数配置、音效、动画、多语言）
- **Phase 3 待规划**：工程化（Git、错误监控、部署）
- 详见 [docs/development-steps.md](docs/development-steps.md)
