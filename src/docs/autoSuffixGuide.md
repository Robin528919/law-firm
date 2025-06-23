# 自动后缀功能使用指南

## 📋 功能概述

自动后缀功能允许您在 `formConfig.json` 中为文本字段配置自动添加的后缀，当用户输入完成并失去焦点时，系统会自动添加预设的后缀内容。

## 🚀 配置方法

### 基本配置

在字段配置中添加 `autoSuffix` 属性：

```json
{
  "id": "plaintiffName",
  "label": "Plaintiff Name",
  "type": "text",
  "variable": "d.PlaintiffName",
  "placeholder": "请输入原告姓名",
  "autoSuffix": ", an individual,"
}
```

### 支持的字段类型

- ✅ **text** - 单行文本输入
- ✅ **textarea** - 多行文本输入
- ✅ **multiple text** - 多值文本输入

### 配置示例

#### 1. 原告姓名自动添加个人身份
```json
{
  "id": "plaintiffName",
  "type": "text",
  "autoSuffix": ", an individual,"
}
```

#### 2. 被告公司自动添加企业类型
```json
{
  "id": "defendantName", 
  "type": "text",
  "autoSuffix": ", a California corporation"
}
```

#### 3. 律师姓名自动添加职业后缀
```json
{
  "id": "attorneyName",
  "type": "text", 
  "autoSuffix": ", Esq."
}
```

#### 4. 多值字段的自动后缀
```json
{
  "id": "witnessNames",
  "type": "text",
  "multiple": true,
  "autoSuffix": " (证人)"
}
```

#### 5. 复杂后缀示例
```json
{
  "id": "corporationName",
  "type": "text",
  "autoSuffix": ", a Delaware corporation authorized to do business in California"
}
```

#### 6. 文本域的自动后缀
```json
{
  "id": "propertyDescription",
  "type": "textarea",
  "autoSuffix": ", located in Los Angeles County, California"
}
```

## 💡 使用说明

### 触发时机
- 用户在输入框中输入内容
- **失去焦点时**（blur 事件）自动添加后缀
- 只有当输入不为空且尚未包含该后缀时才会添加

### 智能检测
- 系统会检查当前输入是否已经包含指定的后缀
- 如果已经包含，不会重复添加
- 支持任意长度和复杂度的后缀内容

### 多值字段支持
- 每个输入框都会独立处理后缀添加
- 支持动态添加/删除多个值
- 每个值都会应用相同的后缀规则

## 🎯 实际应用场景

### 法律文档场景
```json
{
  "fields": [
    {
      "id": "plaintiff",
      "autoSuffix": ", an individual,"
    },
    {
      "id": "defendant", 
      "autoSuffix": ", a corporation"
    },
    {
      "id": "attorney",
      "autoSuffix": ", Esq."
    }
  ]
}
```

### 企业信息场景
```json
{
  "fields": [
    {
      "id": "companyName",
      "autoSuffix": " LLC"
    },
    {
      "id": "businessAddress",
      "autoSuffix": ", USA"
    }
  ]
}
```

### 多语言支持
```json
{
  "fields": [
    {
      "id": "chineseName",
      "autoSuffix": "（先生）"
    },
    {
      "id": "englishName", 
      "autoSuffix": ", Mr."
    }
  ]
}
```

## 🔧 测试方法

1. 在应用中点击 **"自动后缀演示"** 按钮
2. 测试不同类型的字段：
   - 单行文本输入
   - 多行文本输入  
   - 多值字段输入
3. 观察失去焦点时的后缀添加效果

## ⚠️ 注意事项

1. **后缀内容**：可以包含任意字符，包括标点符号、空格、中文等
2. **性能影响**：后缀检查是轻量级操作，不会影响性能
3. **用户体验**：后缀在失去焦点时添加，不会干扰用户输入过程
4. **数据保存**：后缀会成为字段值的一部分被保存
5. **兼容性**：与现有的表单验证、计算字段等功能完全兼容

## 🚫 不支持的场景

- ❌ 数字输入字段 (number)
- ❌ 日期选择器 (date)  
- ❌ 下拉选择器 (select)
- ❌ 计算字段 (computed)

## 📝 配置模板

```json
{
  "id": "fieldName",
  "label": "Field Label", 
  "type": "text",
  "variable": "d.FieldName",
  "placeholder": "请输入...",
  "description": "字段描述",
  "autoSuffix": "您的自定义后缀",
  "required": false,
  "multiple": false
}
```

通过这个强大的自动后缀功能，您可以大大提高法律文档填写的效率和规范性！ 