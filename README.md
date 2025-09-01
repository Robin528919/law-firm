# 法律文档表单系统

基于 Vue 3、Element Plus 和 Pinia 构建的专业法律文档生成系统。该系统通过直观的网页界面，帮助律师和法律专业人士创建各种类型的法律文档。

## 🎯 项目概述

法律文档表单系统旨在通过以下功能简化法律文档的创建：

- **17种不同的法律表单类型**：支持从投诉到和解协议的各种法律程序
- **智能表单验证**：内置验证确保所有必填字段都已完成
- **进度跟踪**：每个表单的实时完成百分比
- **多环境支持**：开发、测试和生产环境
- **响应式设计**：在桌面和移动设备上完美运行
- **测试数据工具**：内置测试和开发工具

## 🏗️ 技术栈

- **前端框架**：Vue 3 (组合式 API)
- **UI 组件库**：Element Plus
- **状态管理**：Pinia
- **构建工具**：Vite
- **样式系统**：SCSS + CSS 自定义属性
- **日期处理**：Day.js
- **开发语言**：JavaScript/ES6+

## 📋 支持的法律表单

1. **投诉/损害赔偿表单** - 包含工资和工时违规的民事投诉
2. **答辩表单** - 对法律投诉的回应
3. **和解协议表单** - 和解谈判和协议
4. **抗辩动议表单** - 对投诉的法律质疑
5. **删除动议表单** - 要求删除诉状部分内容的动议
6. **证据调取请求表单** - 发现程序文档请求
7. **PMP 证词表单** - 最有资格人员作证通知
8. **开庭通知表单** - 作证时间安排通知
9. **性骚扰案件证据调取表单** - 骚扰案件的专门发现程序
10. **裁决通知表单** - 法院裁决通知
11. **案件管理会议通知表单** - 案件管理会议通知
12. **案件重新分配通知表单** - 法官重新分配通知
13. **SROGS01 加班表单** - 加班案件的特殊审问
14. **继续 OSC 宣誓书表单** - 显示原因令的延续
15. **继续 CMC 宣誓书表单** - CMC 延续请求
16. **延续听证通知表单** - 听证重新安排通知
17. **抗辩动议和删除答辩表单** - 组合回应诉状

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装

```bash
# 克隆仓库
git clone [repository-url]
cd law-firm

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 以测试环境启动
npm run dev:test

# 以生产环境启动
npm run dev:prod
```

访问 http://localhost:5173 查看应用程序。

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 构建特定环境版本
npm run build:dev
npm run build:test
npm run build:prod
```

### 预览生产构建

```bash
# 预览生产构建
npm run preview

# 预览特定环境构建
npm run preview:dev
npm run preview:prod
```

## 📁 项目结构

```
legal-document-forms/
├── src/
│   ├── components/
│   │   ├── common/                 # 可重用组件
│   │   │   ├── AppLayout.vue       # 主布局组件
│   │   │   ├── AppHeader.vue       # 导航头部
│   │   │   ├── AppFooter.vue       # 底部组件
│   │   │   ├── FormSelector.vue    # 表单类型选择器
│   │   │   ├── FormActions.vue     # 表单操作按钮
│   │   │   ├── FormField.vue       # 通用表单字段
│   │   │   ├── FormGroup.vue       # 表单字段分组
│   │   │   └── TestDataTool.vue    # 开发测试工具
│   │   └── forms/                  # 法律表单组件
│   │       ├── ComplaintForm.vue   # 投诉/损害赔偿表单
│   │       ├── AnswerForm.vue      # 答辩表单
│   │       ├── SettlementForm.vue  # 和解协议
│   │       └── [其他14个表单]       # 其他法律表单
│   ├── stores/                     # Pinia 状态管理
│   │   └── formStore.js           # 集中的表单状态
│   ├── utils/                      # 工具函数
│   │   ├── constants.js           # 应用常量和配置
│   │   └── calculations.js        # 表单计算
│   ├── styles/                     # 全局样式
│   │   └── variables.scss         # SCSS 变量
│   ├── App.vue                    # 根组件
│   └── main.js                    # 应用程序入口点
├── public/                        # 静态资源
├── package.json                   # 项目配置
├── vite.config.js                # Vite 配置
└── README.md                     # 本文件
```

## 🔧 开发指南

### 环境配置

应用程序支持多种环境：

- **开发环境**：启用调试功能的本地开发
- **测试环境**：带有测试数据工具的测试环境
- **生产环境**：优化设置的生产环境

环境特定配置在 `src/utils/constants.js` 中处理。

### 添加新表单类型

1. 在 `src/components/forms/` 中创建新的表单组件
2. 在 `src/stores/formStore.js` 中添加表单状态管理
3. 在 `App.vue` 中注册表单
4. 添加进度计算逻辑
5. 包含表单验证规则

### 表单字段类型

系统支持各种字段类型：
- 文本输入
- 文本域（多行）
- 下拉选择
- 单选按钮
- 复选框
- 日期选择器
- 数字输入
- 多姓名字段
- 地址字段

### 状态管理

所有表单数据通过 Pinia 存储管理（`src/stores/formStore.js`）：
- 集中的表单状态
- 进度计算
- 数据持久化
- 表单验证
- 导出功能

## 🎨 样式系统

应用程序使用一致的设计系统：
- CSS 自定义属性主题
- SCSS 高级样式功能
- Element Plus 组件库
- 响应式设计原则
- 一致的间距和排版

## 🧪 测试和开发工具

### 测试数据工具

在开发模式下，测试数据工具可用于：
- 使用示例数据填充表单
- 测试表单验证
- 验证计算
- 导出测试数据

### 环境指示器

应用程序在以下位置显示当前环境：
- 头部徽章
- 底部信息
- 控制台日志
- 表单提交反馈

## 📤 数据导出和提交

### 导出功能
- JSON 数据导出
- 表单进度跟踪
- 本地存储持久化
- 邮件提交集成

### 提交流程
- 表单验证（非阻塞）
- 进度计算
- 数据格式化
- Webhook 集成
- 成功/错误反馈

## 🔗 n8n 流水线

### 总体说明
- 本系统通过 n8n Webhook 接收前端提交，调用 Carbone 渲染多个模板，最后以邮件附件形式发送至用户填写的 `submissionEmail`。
- 前端提交的数据结构见“请求格式”，不同表单类型会触发不同模板集合（在 n8n 的 Code 节点中路由）。

### 生产流水线：sample-management
- 名称：`sample-management`（n8n 中的生产工作流）。
- 职责：接收表单数据 → 按 `formType` 分发模板 → 调用 Carbone 生成 PDF → 汇总附件 → 发送邮件给 `submissionEmail`。
- Webhook：建议通过环境变量配置 `VITE_API_WEBHOOK_URL` 指向生产工作流的 webhook 地址。
- 备注：若未配置 `VITE_API_WEBHOOK_URL`，将回退到 `src/utils/constants.js` 中的 `ENDPOINTS.WEBHOOK_PROD`。

### 测试流水线：Complaint/Damages
- 名称：`Complaint/Damages`（示例测试工作流，见仓库 `n8n.json`）。
- Webhook：默认示例已在 `src/utils/constants.js` 的 `ENDPOINTS.WEBHOOK_TEST` 中配置（`/webhook-test/...`）。
- 主要节点：
  - `Webhook`：接收前端 POST。
  - `Edit/Set Fields + Code`：根据 `formType` 选取模板 ID（参考 `n8n-js-code.js`）。
  - `HTTP Request`：调用 Carbone Render API 生成文档并下载。
  - `处理附件`：将多文件作为二进制附件聚合。
  - `发送邮件`：给 `submissionEmail` 发送所有生成的 PDF。

### 请求格式（前端 → n8n Webhook）
```json
{
  "submissionEmail": "user@example.com",
  "formType": "complaint", // 对应 `src/utils/constants.js` 中的表单类型值
  "formData": { /* 当前表单的字段数据，已做必要的日期/计算处理 */ },
  "timestamp": "2025-07-14T12:34:56.000Z"
}
```

### 前端对接与环境配置
- `VITE_API_WEBHOOK_URL`：优先级最高。配置后前端将直接向该 URL 提交（适合指向生产的 `sample-management`）。
- 回退地址：未设置时按构建环境选择
  - 开发/测试：`ENDPOINTS.WEBHOOK_TEST`
  - 生产：`ENDPOINTS.WEBHOOK_PROD`
- 代码位置：`src/utils/constants.js` 的 `API_CONFIG.getWebhookUrl()` 与 `ENDPOINTS`。

### 在 n8n 中导入与启用
- 测试示例：在 n8n 中导入仓库根目录的 `n8n.json`，激活后即可接受请求。
- 自定义模板路由：可参考 `n8n-js-code.js` 中 `formType → templateIds` 的映射规则。
- 生产工作流：在 n8n 中创建/维护名为 `sample-management` 的工作流，发布其 webhook，并将地址配置到 `VITE_API_WEBHOOK_URL`。

### 快速验证（可选）
- 将应用运行在期望环境后，提交任一表单，观察 n8n 执行记录与收件邮箱附件。
- 也可用 curl 直接验证 Webhook（将 `<WEBHOOK_URL>` 替换为实际地址）：
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"submissionEmail":"user@example.com","formType":"complaint","formData":{}}' \
  <WEBHOOK_URL>
```

## 🛠️ IDE 设置

**推荐配置**：[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

**重要提示**：使用 Volar 时请禁用 Vetur 扩展。

### 推荐的 VSCode 扩展
- Volar (Vue 语言功能)
- Vue VSCode Snippets
- SCSS Formatter
- Prettier - 代码格式化
- ESLint

## 📚 文档链接

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vite 配置参考](https://vite.dev/config/)
- [Day.js 文档](https://day.js.org/)

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发准则
- 遵循 Vue 3 组合式 API 模式
- 使用 TypeScript 风格的 JSDoc 注释
- 保持一致的代码格式
- 彻底测试新功能
- 根据需要更新文档

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 📧 技术支持

如有问题、建议或贡献：
- 在仓库中创建 issue
- 提交 pull request
- 联系开发团队

---

**法律文档表单系统** - 用现代网络技术简化法律文档创建。

© 2025年 法律文档表单系统。保留所有权利。
