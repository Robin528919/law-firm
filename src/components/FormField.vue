<template>
  <!-- 普通文本输入框 -->
  <el-form-item
    v-if="field.type === 'text'"
    :label="field.label"
    :prop="field.id"
    :required="field.required"
  >
    <!-- 支持多个值的文本输入 -->
    <div v-if="field.multiple" class="multiple-input-container">
      <div
        v-for="(value, index) in getMultipleValues()"
        :key="index"
        class="multiple-input-item"
      >
        <el-input
          :model-value="formData[field.id] ? formData[field.id][index] : ''"
          @update:model-value="(val) => updateMultipleValue(index, val)"
          @blur="(event) => handleMultipleTextBlur(index, event)"
          :placeholder="field.placeholder"
          class="multiple-input"
        />
        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          @click="removeMultipleValue(index)"
          v-if="getMultipleValues().length > 1"
        />
      </div>
      <el-button
        type="primary"
        :icon="Plus"
        @click="addMultipleValue"
        class="add-button"
      >
        添加{{ field.label }}
      </el-button>
    </div>
    <!-- 单个文本输入 -->
    <div v-else>
      <el-input
        :model-value="formData[field.id] === '' ? null : formData[field.id]"
        @update:model-value="(val) => updateFieldValue(val)"
        @blur="handleTextBlur"
        :placeholder="field.placeholder"
      />
      <!-- 特殊逻辑：当被告是公司时显示州选择器 -->
      <el-select
        v-if="field.id === 'defendantName' && isCompany(formData[field.id])"
        :model-value="formData[field.id + '_state']"
        @update:model-value="(val) => updateFieldValue(val, '_state')"
        placeholder="选择州"
        style="margin-top: 10px; width: 100%;"
      >
        <el-option label="California" value="CA"></el-option>
        <el-option label="New York" value="NY"></el-option>
        <el-option label="Texas" value="TX"></el-option>
        <el-option label="Florida" value="FL"></el-option>
        <el-option label="Illinois" value="IL"></el-option>
      </el-select>
    </div>
    <!-- 字段描述 -->
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 多行文本输入框 -->
  <el-form-item
    v-else-if="field.type === 'textarea'"
    :label="field.label"
    :prop="field.id"
    :required="field.required"
  >
    <el-input
      :model-value="formData[field.id] === '' ? null : formData[field.id]"
      @update:model-value="(val) => updateFieldValue(val)"
      @blur="handleTextBlur"
      type="textarea"
      :placeholder="field.placeholder"
      :rows="3"
    />
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 数字输入框 -->
  <el-form-item
    v-else-if="field.type === 'number'"
    :label="field.label"
    :prop="field.id"
    :required="field.required"
  >
    <el-input-number
      :model-value="formData[field.id] === '' ? null : formData[field.id]"
      @update:model-value="(val) => updateFieldValue(val)"
      :min="field.min || 0"
      :max="field.max"
      :step="field.step || 1"
      :placeholder="field.placeholder"
      style="width: 100%"
    />
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 日期选择器 -->
  <el-form-item
    v-else-if="field.type === 'date'"
    :label="field.label"
    :prop="field.id"
    :required="field.required"
  >
    <el-date-picker
      :model-value="formData[field.id] === '' ? null : formData[field.id]"
      @update:model-value="(val) => updateFieldValue(val)"
      type="date"
      :placeholder="field.placeholder"
      format="MMMM DD, YYYY"
      value-format="YYYY-MM-DD"
      style="width: 100%"
    />
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 计算字段 -->
  <el-form-item
    v-else-if="field.type === 'computed'"
    :label="field.label"
    :prop="field.id"
  >
    <el-input
      :model-value="computedValues[field.id]"
      disabled
      :placeholder="'自动计算中...'"
    />
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 选择器 -->
  <el-form-item
    v-else-if="field.type === 'select'"
    :label="field.label"
    :prop="field.id"
    :required="field.required"
  >
    <el-select
      :model-value="formData[field.id] === '' ? null : formData[field.id]"
      @update:model-value="(val) => updateFieldValue(val)"
      :placeholder="field.placeholder"
      :multiple="field.multiple"
      style="width: 100%"
    >
      <el-option
        v-for="option in field.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>

  <!-- 计算字段（只读显示） -->
  <el-form-item
    v-else-if="field.type === 'computed'"
    :label="field.label"
    :prop="field.id"
  >
    <el-input
      :model-value="getComputedValue()"
      readonly
      class="computed-field"
    />
    <div v-if="field.description" class="field-description">
      {{ field.description }}
    </div>
  </el-form-item>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'

// 组件属性定义
const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  computedValues: { type: Object, required: true }
})

// 组件事件定义
const emit = defineEmits(['update-field', 'add-multiple', 'remove-multiple'])

// 获取多值字段的值数组
const getMultipleValues = () => {
  return props.formData[props.field.id] || []
}

// 更新字段值
const updateFieldValue = (value, suffix = '') => {
  const fieldId = props.field.id + suffix
  emit('update-field', fieldId, value)
}

// 更新多值字段的特定索引值
const updateMultipleValue = (index, value) => {
  const currentValues = [...(props.formData[props.field.id] || [])]
  currentValues[index] = value
  emit('update-field', props.field.id, currentValues)
}

// 添加多值字段的新值
const addMultipleValue = () => {
  emit('add-multiple', props.field.id)
}

// 删除多值字段的指定值
const removeMultipleValue = (index) => {
  emit('remove-multiple', props.field.id, index)
}

// 获取计算字段值
const getComputedValue = () => {
  const value = props.computedValues[props.field.id]

  // 如果是日期相关的计算，已经在引擎中格式化了
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return value.toFixed(2)
  }

  return value || ''
}

// 判断是否为公司
const isCompany = (name) => {
  if (!name) return false
  const companyKeywords = ['corporation', 'corp.', 'inc.', 'llc', 'ltd.', 'limited']
  const lowerCaseName = name.toLowerCase()
  return companyKeywords.some(keyword => lowerCaseName.includes(keyword))
}

// 处理文本失去焦点时的后缀添加
const handleTextBlur = (event) => {
  if (!props.field.autoSuffix) return
  
  const currentValue = event.target.value.trim()
  if (!currentValue) return
  
  // 如果还没有后缀，则添加后缀
  if (!currentValue.endsWith(props.field.autoSuffix)) {
    const newValue = currentValue + props.field.autoSuffix
    updateFieldValue(newValue)
  }
}

// 处理多值文本字段失去焦点时的后缀添加
const handleMultipleTextBlur = (index, event) => {
  if (!props.field.autoSuffix) return
  
  const currentValue = event.target.value.trim()
  if (!currentValue) return
  
  // 如果还没有后缀，则添加后缀
  if (!currentValue.endsWith(props.field.autoSuffix)) {
    const newValue = currentValue + props.field.autoSuffix
    updateMultipleValue(index, newValue)
  }
}

// 处理自动后缀功能的辅助方法
const addAutoSuffix = (value) => {
  if (!props.field.autoSuffix || !value) return value
  
  const trimmedValue = value.trim()
  if (!trimmedValue) return value
  
  // 如果还没有后缀，则添加后缀
  if (!trimmedValue.endsWith(props.field.autoSuffix)) {
    return trimmedValue + props.field.autoSuffix
  }
  
  return value
}

// 处理自动后缀功能的移除方法（用于编辑时）
const removeAutoSuffix = (value) => {
  if (!props.field.autoSuffix || !value) return value
  
  if (value.endsWith(props.field.autoSuffix)) {
    return value.slice(0, -props.field.autoSuffix.length)
  }
  
  return value
}
</script>

<style scoped>
.multiple-input-container {
  width: 100%;
}

.multiple-input-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.multiple-input {
  flex: 1;
}

.add-button {
  margin-top: 8px;
}

.field-description {
  font-size: 0.875rem;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* 计算字段样式 */
:deep(.computed-field .el-input__wrapper) {
  background-color: #F5F5F5 !important;
  border-color: #E4E7ED !important;
  cursor: not-allowed;
}

:deep(.computed-field .el-input__inner) {
  color: #606266 !important;
  background-color: transparent !important;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .multiple-input-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>