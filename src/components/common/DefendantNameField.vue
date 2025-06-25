<template>
  <div class="defendant-name-field">
    <!-- 基础名称输入 -->
    <FormField
      label="Defendant Base Name"
      v-model="baseName"
      type="text"
      placeholder="e.g. ABC Inc"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
    />
    
    <!-- 州选择 -->
    <FormField
      label="State of Incorporation/Formation"
      v-model="state"
      type="select"
      placeholder="Select state"
      :options="stateOptions"
      :disabled="disabled"
      filterable
      @change="handleChange"
    />
    
    <!-- 主体类型选择 -->
    <FormField
      label="Entity Type"
      v-model="entityType"
      type="select" 
      placeholder="Select entity type"
      :options="entityTypeOptions"
      :disabled="disabled"
      @change="handleChange"
    />
    
    <!-- 格式化预览 -->
    <div v-if="formattedName" class="formatted-preview">
      <div class="preview-label">
        <el-icon class="preview-icon"><View /></el-icon>
        <span>Formatted Name Preview:</span>
      </div>
      <div class="preview-text">{{ formattedName }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { View } from '@element-plus/icons-vue'
import FormField from './FormField.vue'
import { US_STATES, ENTITY_TYPE_OPTIONS } from '@/utils/constants'
import { formatDefendantName } from '@/utils/calculations'

interface Props {
  // 基础值
  defendantName?: string
  defendantState?: string
  defendantEntityType?: string
  
  // 字段属性
  required?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'update:defendantName', value: string): void
  (e: 'update:defendantState', value: string): void
  (e: 'update:defendantEntityType', value: string): void
  (e: 'change', values: { defendantName: string, defendantState: string, defendantEntityType: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  defendantName: '',
  defendantState: '',
  defendantEntityType: '',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

// 内部状态
const baseName = ref('')
const state = ref('')
const entityType = ref('')

// 选项数据
const stateOptions = US_STATES
const entityTypeOptions = ENTITY_TYPE_OPTIONS

// 监听props变化，同步到内部状态
watch(() => props.defendantName, (newValue) => {
  baseName.value = newValue || ''
}, { immediate: true })

watch(() => props.defendantState, (newValue) => {
  state.value = newValue || ''
}, { immediate: true })

watch(() => props.defendantEntityType, (newValue) => {
  entityType.value = newValue || ''
}, { immediate: true })

// 格式化后的名称
const formattedName = computed(() => {
  return formatDefendantName(baseName.value, state.value, entityType.value)
})

// 处理变更
const handleChange = () => {
  // 发出单独的更新事件
  emit('update:defendantName', baseName.value)
  emit('update:defendantState', state.value)
  emit('update:defendantEntityType', entityType.value)
  
  // 发出组合变更事件
  emit('change', {
    defendantName: baseName.value,
    defendantState: state.value,
    defendantEntityType: entityType.value
  })
}
</script>

<style scoped>
.defendant-name-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.formatted-preview {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.preview-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.preview-icon {
  color: var(--info-color);
  font-size: 14px;
}

.preview-text {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  word-break: break-word;
}

@media (max-width: 768px) {
  .defendant-name-field {
    gap: var(--spacing-sm);
  }
  
  .formatted-preview {
    padding: var(--spacing-sm);
  }
}
</style> 