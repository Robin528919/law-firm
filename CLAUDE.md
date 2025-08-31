# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个法律文档表单系统（Legal Document Forms System），用于生成各类法律文档，包括起诉书、答辩书、和解协议等。系统使用 Vue 3 + Vite + Element Plus 构建。

## 常用命令

### 开发环境
```bash
# 安装依赖
npm install

# 开发环境运行（默认）
npm run dev

# 测试环境运行
npm run dev:test

# 生产环境配置运行
npm run dev:prod
```

### 构建部署
```bash
# 生产环境构建
npm run build
npm run build:prod

# 测试环境构建
npm run build:test

# 开发环境构建
npm run build:dev

# 预览构建结果
npm run preview
npm run preview:prod
```

## 项目架构

### 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 框架**: Element Plus
- **状态管理**: Pinia
- **样式**: SCSS

### 核心目录结构
- `src/components/forms/` - 各类法律表单组件（17种不同类型的表单）
- `src/components/common/` - 公共组件（布局、表单字段、表单组等）
- `src/stores/formStore.js` - 表单状态管理，处理所有表单数据和提交逻辑
- `src/utils/constants.js` - 表单类型定义、字段配置等常量
- `src/utils/calculations.js` - 表单相关计算逻辑

### 环境配置
项目包含三个环境配置文件：
- `.env.development` - 开发环境，启用测试数据显示和调试模式
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境，关闭调试模式

关键环境变量：
- `VITE_API_WEBHOOK_URL` - N8N webhook API 端点
- `VITE_SHOW_TEST_DATA` - 是否显示测试数据按钮
- `VITE_DEBUG` - 调试模式开关

### 表单系统架构

1. **表单类型管理**: 通过 `formStore` 管理当前表单类型和数据
2. **动态表单渲染**: App.vue 根据 `currentFormType` 动态渲染对应表单组件
3. **数据提交流程**: 表单数据通过 webhook 提交到 N8N 工作流系统处理
4. **模板映射**: 每种表单类型对应特定的 N8N 模板 ID（在 formStore 中配置）

### API 集成
系统通过 N8N webhook 与后端集成，提交表单时会：
1. 根据表单类型选择对应的模板 ID
2. 将表单数据和模板 ID 发送到配置的 webhook URL
3. N8N 工作流处理数据并生成相应的法律文档

### 开发注意事项
- 所有表单组件都继承自公共的 FormField 和 FormGroup 组件
- 使用 Element Plus 的表单验证机制
- 支持中英文双语（通过 i18n 配置）
- 生产环境自动隐藏测试功能和调试信息

## 开发规范与编码标准

### 语言与注释规范
- **项目注释**：代码中的所有注释必须使用中文
- **交流语言**：与用户交流时使用中文
- **界面文本**：界面显示的文字使用英文（如按钮文本、placeholder等）
- **日志输出**：console.log等调试信息使用中文
- **Vue模板**：属性值不能包含双引号(")，必须使用单引号(')替代

### Git 操作规范
- 只有在用户明确要求时才执行 Git 操作
- 不要主动进行 Git 提交或推送
- 新文件创建后使用 `git add` 添加到版本控制

### 表单开发统一规范

#### 表单组件风格统一
- **测试数据按钮**：使用FormGroup包装，warning类型，DocumentCopy图标，包含loading状态
- **表单布局**：使用FormGroup和FormField组件进行分组和字段展示
- **验证规则**：使用VALIDATION_RULES常量定义验证规则
- **组件结构**：必须包含validate方法，支持父组件调用

#### 日期处理统一规范
- **日期选择器格式**：统一使用 `format="MMMM D, YYYY"` 和 `value-format="MMMM D, YYYY"`
- **测试数据格式**：测试数据中的日期必须与表单格式一致（如：January 13, 2017）
- **Trial Date特殊处理**：必须支持"Not Set"和具体日期两种模式
- **提交格式**：日期字段提交前必须转换为美式格式

#### 字段类型与组件对应
严格按照需求文档中的Type字段选择对应的Vue组件：
- **Text类型** → FormField组件（type="text"或type="textarea"）
- **Date类型** → el-date-picker组件（format="MMMM D, YYYY" value-format="MMMM D, YYYY"）
- **Time类型** → el-time-picker组件（format="h:mm A" value-format="h:mm A"）
- **Number类型** → FormField组件（type="number"）
- **Select类型** → el-select组件
- **Boolean类型** → el-switch或el-checkbox组件

#### 特殊字段处理规范
- **复数形式字段**：必须自动计算且disabled显示
- **执行日期字段**：必须自动计算为当前日期
- **自动计算字段**：使用FormField组件，disabled状态，placeholder显示"Auto-calculated"
- **自动计算字段不在测试数据填充范围内**

### 状态管理规范
- **数据访问**：formData直接使用，不要使用formData.value（除非明确是ref包装）
- **属性检查**：使用Object.prototype.hasOwnProperty.call()检查属性存在性
- **计算字段**：必须通过store的computed属性实现
- **数据导出**：exportFormData和importFormData必须包含新表单支持

### 新增表单完整开发流程
1. **constants.js** - 添加表单类型定义和测试数据常量
2. **formStore.js** - 添加完整状态管理（数据结构、计算属性、重置逻辑、导入导出）
3. **创建Vue组件** - 包含validate方法、测试数据支持、完整验证规则
4. **App.vue集成** - 引入组件、条件渲染、进度计算、表单引用、提交处理
5. **字段验证** - 所有字段必须包含适当的验证规则和描述信息
6. **Git管理** - 新文件添加到Git版本控制

### 数据处理与映射规范
- **字段命名**：变量命名必须与需求文档中的字段名保持一致
- **数据提交**：提交时必须包含所有输入字段和计算字段
- **日期转换**：日期字段提交前必须转换为美式格式
- **数据合并**：输入字段与计算字段正确合并后提交

### 错误处理与调试
- **错误捕获**：使用mcp工具获取控制台错误并及时修复
- **调试信息**：console.log输出必须使用中文
- **异步处理**：测试数据填充必须包含异步处理和错误捕获
- **用户反馈**：适当的loading状态和错误提示

### 代码重用与一致性
- **参考现有实现**：新功能开发前必须先查看相似功能的现有实现
- **风格一致性**：保持代码风格和架构的一致性
- **组件复用**：充分复用现有的组件和工具函数
- **模式遵循**：严格遵循现有的开发模式和数据流

## 表单数据流程

### 提交流程
1. **表单验证**: 使用 Element Plus 验证机制（非阻塞，验证失败仍可提交）
2. **数据处理**: 
   - 根据表单类型获取对应的表单数据
   - 合并计算字段（如日期格式化、复数形式等）
   - 日期统一转换为美式格式（MM/DD/YYYY）
3. **API 提交**:
   - 构建提交数据（包含 submissionEmail、formType、formData、timestamp）
   - 通过 fetch API POST 到配置的 webhook URL
   - 根据环境显示不同的成功/失败消息

### 表单进度计算
每个表单都有独立的进度计算函数，基于必填字段的填写情况计算完成百分比。

### 测试数据工具
- 仅在开发环境显示（通过 `VITE_SHOW_TEST_DATA` 控制）
- 使用 TestDataTool 组件快速填充测试数据
- 支持字段排除和特殊处理器

## 表单类型列表
项目包含 18 种法律表单：
1. **complaint** - 起诉/损害赔偿表单
2. **answer** - M&C RE 答辩表单
3. **settlement** - 和解协议（付款）表单
4. **demurrer** - 抗辩动议表单
5. **motionToStrike** - 删除动议表单
6. **requestForProduction** - 证据调取请求表单
7. **pmpDepo** - PMP 证词表单
8. **ntcOfDepo** - 开庭通知表单
9. **rfpSexualHarassment** - RFP 性骚扰案件表单
10. **ntcOfRuling** - 裁决通知表单
11. **cmcNotice** - 案件管理会议通知表单
12. **ntcCaseReassignment** - 案件重新分配通知表单
13. **srogs01Overtime** - 特殊审问加班表单
14. **declContcOsc** - 继续 OSC 宣誓书表单
15. **declToContCmc** - 继续 CMC 宣誓书表单
16. **ntcOfContHearing** - 继续听证通知表单
17. **demurrerMotionStrikeAnswer** - 抗辩动议和删除动议答复表单

## API 配置工具
项目包含 `API_CONFIG` 工具（在 constants.js 中）：
- 环境感知的 webhook URL 获取
- 条件性调试日志输出
- 环境变量统一管理

## 代码质量
- 项目暂无配置 ESLint、Prettier 等代码质量工具
- 项目暂无单元测试或集成测试