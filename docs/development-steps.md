# 开发执行步骤 — AI 表情猜谜王

> 版本：v1.0 | 更新：2026-06-02

## 开发原则

- **小步快跑**：每个 Step 聚焦一个可交付的增量，完成后验证再进入下一步
- **先跑通再优化**：优先保证功能可用，不要过早优化
- **每一步可回退**：代码改动前确保当前版本是可运行的
- **记录即文档**：每个 Step 完成后在 `devlog/` 中记录

---

## Phase 1：项目地基 ✅ 已完成

### Step 1.1 — 项目初始化 ✅
- [x] `npm init -y` 创建 package.json
- [x] 安装依赖：express, cors, dotenv
- [x] 创建 .env.example 模板
- **验证**：`node -e "require('express')"` 无报错

### Step 1.2 — 后端 API 搭建 ✅
- [x] 创建 server.js，Express 服务监听 3000 端口
- [x] POST `/api/generate-puzzle` 端点
- [x] 预设题库 FALLBACK_PUZZLES（30 题，三个难度）
- [x] AI API 调用逻辑（Anthropic + OpenAI 双支持）
- [x] 错误兜底：AI 失败自动用预设题
- [x] GET `/api/health` 健康检查
- **验证**：curl 测试三个端点均正常返回

### Step 1.3 — 前端页面骨架 ✅
- [x] index.html 五个 page div
- [x] 引入 style.css 和 script.js
- **验证**：浏览器打开能看到所有页面切换

### Step 1.4 — CSS 样式 ✅
- [x] CSS 变量定义配色体系
- [x] 毛玻璃卡片效果
- [x] 所有按钮、输入框样式
- [x] 动画（fadeInUp、shake、pop、bounce、pulse）
- [x] 计时器进度条
- [x] 反馈条（答对/答错）
- [x] 响应式（≤400px 断点）
- **验证**：各页面视觉效果符合设计规范

### Step 1.5 — 游戏逻辑 ✅
- [x] 状态管理（state 对象）
- [x] 5 个页面切换函数
- [x] 昵称输入 + 验证
- [x] 难度选择
- [x] API 调用获取谜题
- [x] 答案判定（大小写不敏感）
- [x] 计分 + combo 系统
- [x] 困难模式计时器
- [x] 跳过功能
- [x] 结算页数据展示
- [x] localStorage 排行榜读写
- **验证**：端到端完成一局游戏全程无报错

---

## Phase 2：功能增强 🔜 待规划

### Step 2.1 — 题目数量可配置
- [ ] 让玩家可选 5 题 / 10 题 / 无限模式
- **依赖**：无
- **预计工作量**：小

### Step 2.2 — 音效反馈
- [ ] 答对音效、答错音效、倒计时滴答声
- **依赖**：无（可用 Web Audio API 或免费音效）
- **预计工作量**：中

### Step 2.3 — Emoji 动画增强
- [ ] 答对时放烟花/撒花效果
- [ ] emoji 逐个弹入动画
- **依赖**：无
- **预计工作量**：中

### Step 2.4 — 多语言支持
- [ ] 中英文切换
- [ ] AI prompt 中英文版本
- **依赖**：无
- **预计工作量**：中

---

## Phase 3：工程化 🔜 待规划

### Step 3.1 — Git 初始化
- [ ] `git init`，配置 .gitignore（node_modules, .env）
- [ ] 首次 commit
- **依赖**：无

### Step 3.2 — 错误监控
- [ ] 前端全局错误捕获
- [ ] 后端请求日志
- **依赖**：无

### Step 3.3 — 部署
- [ ] 学习如何部署到免费平台（Vercel / Netlify 前端 + Railway / Render 后端）
- **依赖**：Git 仓库

---

## 开发约定

### 命名规范
- HTML id/class：kebab-case（`page-start`, `btn-submit`）
- JS 变量/函数：camelCase（`fetchPuzzle`, `currentPage`）
- JS 常量：UPPER_SNAKE_CASE（`API_BASE`, `LEADERBOARD_KEY`）
- CSS 类：kebab-case（`.emoji-display`, `.btn-primary`）

### 提交规范（Git 启用后）
- `feat:` 新功能
- `fix:` 修 bug
- `style:` 样式调整
- `refactor:` 重构
- `docs:` 文档更新

### 测试规范
- 每个 Step 完成后手动跑通完整游戏流程
- 重点测试边界：空输入、网络断开、API 超时
- 在 Chrome 和移动端均测试一次
