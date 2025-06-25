<template>
  <el-form-item 
    :label="label" 
    :prop="prop"
    :class="fieldClasses"
    :rules="fieldRules"
  >
    <!-- 字段标签区域 -->
    <template #label>
      <div class="field-label">
        <span>{{ label }}</span>
        <el-tooltip v-if="tooltip" :content="tooltip" placement="top">
          <el-icon class="field-tooltip"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </template>

    <!-- 字段输入区域 -->
    <div class="field-wrapper">
      <!-- 文本输入 -->
      <el-input
        v-if="type === 'text' || type === 'email'"
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled || isCalculated"
        :readonly="readonly || isCalculated"
        :maxlength="maxlength"
        :show-word-limit="showWordLimit"
        clearable
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- 数字输入 -->
      <el-input-number
        v-else-if="type === 'number'"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled || isCalculated"
        :readonly="readonly || isCalculated"
        :min="min"
        v-bind="max !== null && min !== null && max >= min ? { max } : {}"
        :precision="precision"
        :step="step"
        :controls="!isCalculated"
        style="width: 100%"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- 文本域 -->
      <el-input
        v-else-if="type === 'textarea'"
        :model-value="modelValue"
        type="textarea"
        :placeholder="placeholder"
        :disabled="disabled || isCalculated"
        :readonly="readonly || isCalculated"
        :rows="rows"
        :maxlength="maxlength"
        :show-word-limit="showWordLimit"
        resize="vertical"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="type === 'date'"
        :model-value="modelValue"
        type="date"
        :placeholder="placeholder"
        :disabled="disabled || isCalculated"
        :readonly="readonly || isCalculated"
        value-format="YYYY-MM-DD"
        format="YYYY年MM月DD日"
        style="width: 100%"
        @change="handleInput"
      />

      <!-- 单选框 -->
      <el-select
        v-else-if="type === 'select'"
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled || isCalculated"
        :readonly="readonly || isCalculated"
        :multiple="multiple"
        :filterable="filterable"
        :clearable="clearable"
        style="width: 100%"
        @change="handleInput"
      >
        <el-option
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled"
        >
          <div v-if="option.description" class="option-with-desc">
            <div>{{ option.label }}</div>
            <div class="option-desc">{{ option.description }}</div>
          </div>
        </el-option>
      </el-select>

      <!-- 多选框组 -->
      <el-checkbox-group
        v-else-if="type === 'checkbox'"
        :model-value="modelValue"
        :disabled="disabled || isCalculated"
        @change="handleInput"
      >
        <el-checkbox
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          <div class="checkbox-content">
            <div class="checkbox-label">{{ option.label }}</div>
            <div v-if="option.description" class="checkbox-desc">{{ option.description }}</div>
          </div>
        </el-checkbox>
      </el-checkbox-group>

      <!-- 单选按钮组 -->
      <el-radio-group
        v-else-if="type === 'radio'"
        :model-value="modelValue"
        :disabled="disabled || isCalculated"
        @change="handleInput"
      >
        <el-radio
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </el-radio>
      </el-radio-group>

      <!-- 计算字段显示值 -->
      <div v-if="isCalculated && displayValue" class="calculated-display">
        <el-input
          :model-value="displayValue"
          readonly
          :placeholder="placeholder"
        />
        <div class="calculated-label">
          <el-icon><Edit /></el-icon>
          <span>自动计算</span>
        </div>
      </div>
    </div>

    <!-- 字段说明 -->
    <div v-if="description" class="field-description">
      {{ description }}
    </div>
  </el-form-item>
</template>

<script setup>
import { computed } from 'vue'
import { QuestionFilled, Edit } from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  // 基础属性
  label: { type: String, required: true },
  modelValue: { type: [String, Number, Array, Boolean, Date], default: '' },
  type: { type: String, default: 'text' },
  prop: { type: String, default: '' },
  
  // 验证和状态
  required: { type: Boolean, default: false },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  isCalculated: { type: Boolean, default: false },
  
  // 输入属性
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: null },
  showWordLimit: { type: Boolean, default: false },
  
  // 数字输入属性
  min: { type: Number, default: null },
  max: { type: Number, default: null },
  precision: { type: Number, default: 2 },
  step: { type: Number, default: 1 },
  
  // 文本域属性
  rows: { type: Number, default: 3 },
  
  // 选择器属性
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  
  // 提示和说明
  tooltip: { type: String, default: '' },
  description: { type: String, default: '' },
  
  // 计算字段显示值
  displayValue: { type: String, default: '' }
})

// 事件定义
const emit = defineEmits(['update:modelValue', 'change', 'blur'])

// 计算属性
const fieldClasses = computed(() => ({
  'required-field': props.required,
  'calculated-field': props.isCalculated,
  'disabled-field': props.disabled
}))

const fieldRules = computed(() => {
  const rules = [...props.rules]
  if (props.required && !props.isCalculated) {
    rules.unshift({
      required: true,
      message: `${props.label}为必填项`,
      trigger: props.type === 'select' || props.type === 'date' ? 'change' : 'blur'
    })
  }
  return rules
})

// 事件处理
const handleInput = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event) => {
  emit('blur', event.target.value)
}
</script>

<style scoped>
.field-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-wrapper {
  position: relative;
  width: 100%;
}

.option-with-desc {
  padding: 4px 0;
}

.option-desc {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 2px;
}

.checkbox-content {
  margin-left: 8px;
}

.checkbox-label {
  font-weight: 500;
}

.checkbox-desc {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 2px;
}

.calculated-display {
  position: relative;
}

.calculated-label {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--info-color);
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

.field-description {
  font-size: var(--font-xs);
  color: var(--text-light);
  margin-top: 4px;
  line-height: 1.4;
}

/* 计算字段样式增强 */
:deep(.calculated-field .el-input__wrapper) {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
  border-color: var(--info-color) !important;
}

:deep(.calculated-field .el-input__inner) {
  color: var(--info-color) !important;
  font-weight: 600;
}

:deep(.calculated-field .el-input-number__wrapper) {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
  border-color: var(--info-color) !important;
}

/* 必填字段样式 */
:deep(.required-field .el-form-item__label::after) {
  content: ' *';
  color: var(--danger-color);
  font-weight: bold;
}

/* 禁用字段样式 */
:deep(.disabled-field .el-input__wrapper) {
  background-color: var(--background-light) !important;
}
</style> 