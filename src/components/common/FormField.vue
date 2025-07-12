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
        :maxlength="maxlength || undefined"
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
        :min="min || undefined"
        :max="(max !== null && min !== null && max >= min) ? max : undefined"
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
        :maxlength="maxlength || undefined"
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
        format="MM/DD/YYYY"
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
          <span>Auto-Calculated</span>
        </div>
      </div>
    </div>

    <!-- 字段说明 -->
    <div v-if="description" class="field-description">
      {{ description }}
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QuestionFilled, Edit } from '@element-plus/icons-vue'

// 类型定义
interface Option {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

interface Props {
  // 基础属性
  label: string
  modelValue?: string | number | string[] | boolean | Date | null
  type?: 'text' | 'email' | 'number' | 'textarea' | 'date' | 'select' | 'checkbox' | 'radio'
  prop?: string

  // 验证和状态
  required?: boolean
  rules?: any[]
  disabled?: boolean
  readonly?: boolean
  isCalculated?: boolean

  // 输入属性
  placeholder?: string
  maxlength?: number | null
  showWordLimit?: boolean

  // 数字输入属性
  min?: number | null
  max?: number | null
  precision?: number
  step?: number

  // 文本域属性
  rows?: number

  // 选择器属性
  options?: Option[]
  multiple?: boolean
  filterable?: boolean
  clearable?: boolean

  // 提示和说明
  tooltip?: string
  description?: string

  // 计算字段显示值
  displayValue?: string
}

// Props定义
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  prop: '',
  required: false,
  rules: () => [],
  disabled: false,
  readonly: false,
  isCalculated: false,
  placeholder: '',
  maxlength: null,
  showWordLimit: false,
  min: null,
  max: null,
  precision: 2,
  step: 1,
  rows: 3,
  options: () => [],
  multiple: false,
  filterable: false,
  clearable: true,
  tooltip: '',
  description: '',
  displayValue: ''
})

// 事件定义
interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'blur', value: string): void
}

const emit = defineEmits<Emits>()

// 计算属性
const fieldClasses = computed(() => ({
  'required-field': props.required,
  'calculated-field': props.isCalculated,
  'disabled-field': props.disabled
}))

const fieldRules = computed(() => {
  const rules = [...(props.rules || [])]
  if (props.required && !props.isCalculated) {
    rules.unshift({
      required: true,
      message: `${props.label} is required`,
      trigger: props.type === 'select' || props.type === 'date' ? 'change' : 'blur'
    })
  }
  return rules
})

// 事件处理
const handleInput = (value: any) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('blur', target.value)
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
  display: none; /* 隐藏自动计算标签 */
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
.calculated-field :deep(.el-input__wrapper),
.calculated-field :deep(.el-input-number__wrapper) {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe) !important;
  border-color: var(--info-color) !important;
}

.calculated-field :deep(.el-input__inner) {
  color: var(--info-color) !important;
  font-weight: 600;
}

/* 必填字段样式 */
/* .required-field :deep(.el-form-item__label::after) {
  content: ' ';
  color: var(--danger-color);
  font-weight: bold;
} */

/* 禁用字段样式 */
.disabled-field :deep(.el-input__wrapper) {
  background-color: var(--background-light) !important;
}

/* 复选框组样式 - 一行一个选项 */
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-checkbox-group .el-checkbox) {
  width: 100%;
  margin-right: 0 !important;
}

:deep(.el-checkbox-group .el-checkbox__label) {
  width: 100%;
  padding-left: 8px;
}
</style>
