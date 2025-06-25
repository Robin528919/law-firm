<template>
  <div class="answer-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本信息 -->
      <FormGroup
        title="基本信息"
        description="法庭回复文书的基本信息"
        icon="Document"
        variant="card"
        :columns="2"
      >
        <FormField
          label="信件日期"
          :model-value="formData.letterDate"
          prop="letterDate"
          type="date"
          placeholder="请选择信件日期"
          required
          @change="(value) => handleFieldChange(value, 'letterDate')"
        />
        
        <FormField
          label="回复截止日期"
          :model-value="formData.respDate"
          prop="respDate"
          type="date"
          placeholder="请选择回复截止日期"
          required
          @change="(value) => handleFieldChange(value, 'respDate')"
        />
      </FormGroup>

      <!-- 案件信息 -->
      <FormGroup
        title="案件信息"
        description="相关案件的详细信息"
        icon="FolderOpened"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="案件名称"
          v-model="formData.caseName"
          prop="caseName"
          type="text"
          placeholder="请输入完整的案件名称"
          required
        />
        
        <FormField
          label="案件号"
          v-model="formData.caseNumber"
          prop="caseNumber"
          type="text"
          placeholder="请输入案件编号"
          required
        />
        
        <FormField
          label="被告姓名"
          v-model="formData.defendantName"
          prop="defendantName"
          type="text"
          placeholder="请输入被告姓名"
          required
        />
        
        <FormField
          label="抗辩编号"
          v-model="formData.adNumber"
          prop="adNumber"
          type="text"
          placeholder="例如：First through Twentieth"
          required
          description="输入需要抗辩的编号范围，例如：First through Twentieth"
        />
      </FormGroup>

      <!-- 对方律师信息 -->
      <FormGroup
        title="对方律师信息"
        description="对方律师和律师事务所的详细信息"
        icon="Avatar"
        variant="card"
        :columns="1"
      >
        <FormField
          label="对方律师姓名"
          v-model="formData.ocName"
          prop="ocName"
          type="textarea"
          placeholder="请输入对方律师姓名，支持多行输入"
          :rows="3"
          required
          description="支持多个律师姓名，可使用换行分隔"
        />
        
        <FormField
          label="对方律师事务所"
          v-model="formData.ocFirm"
          prop="ocFirm"
          type="text"
          placeholder="请输入对方律师事务所名称"
          required
        />
        
        <FormField
          label="对方事务所地址"
          v-model="formData.ocAddress"
          prop="ocAddress"
          type="textarea"
          placeholder="请输入对方律师事务所的完整地址"
          :rows="4"
          required
          description="请输入完整的邮寄地址，支持多行格式"
        />
      </FormGroup>

      <!-- 格式化预览 -->
      <FormGroup
        title="格式化预览"
        description="根据输入信息生成的标准化格式预览"
        icon="View"
        variant="default"
        :columns="1"
      >
        <div class="preview-section">
          <h4>信件头部信息：</h4>
          <div class="preview-content">
            <p><strong>日期：</strong> {{ formattedLetterDate }}</p>
            <p><strong>案件：</strong> {{ formData.caseName || '待输入' }}</p>
            <p><strong>案件号：</strong> {{ formData.caseNumber || '待输入' }}</p>
          </div>
          
          <h4 style="margin-top: 20px;">对方律师信息：</h4>
          <div class="preview-content">
            <div v-if="formData.ocName" style="white-space: pre-line;">
              {{ formData.ocName }}
            </div>
            <div v-else class="placeholder-text">对方律师姓名 - 待输入</div>
            
            <div v-if="formData.ocFirm" style="margin-top: 8px;">
              {{ formData.ocFirm }}
            </div>
            <div v-else class="placeholder-text">律师事务所 - 待输入</div>
            
            <div v-if="formData.ocAddress" style="margin-top: 8px; white-space: pre-line;">
              {{ formData.ocAddress }}
            </div>
            <div v-else class="placeholder-text">事务所地址 - 待输入</div>
          </div>
          
          <h4 style="margin-top: 20px;">关键信息：</h4>
          <div class="preview-content">
            <p><strong>被告：</strong> {{ formData.defendantName || '待输入' }}</p>
            <p><strong>抗辩编号：</strong> {{ formData.adNumber || '待输入' }}</p>
            <p><strong>回复截止：</strong> {{ formattedRespDate }}</p>
          </div>
        </div>
      </FormGroup>

      <!-- 表单统计 -->
      <FormGroup
        title="表单统计"
        description="当前表单的完成状态和数据统计"
        icon="DataAnalysis"
        variant="bordered"
        :columns="2"
      >
        <FormField
          label="必填字段完成度"
          :model-value="completionPercentage"
          type="number"
          :is-calculated="true"
          :display-value="`${completionPercentage}%`"
        />
        
        <FormField
          label="表单状态"
          :model-value="formStatus"
          type="text"
          :is-calculated="true"
          :display-value="formStatus"
        />
        
        <FormField
          label="总字段数"
          :model-value="totalFields"
          type="number"
          :is-calculated="true"
          :display-value="`${totalFields} 个`"
        />
        
        <FormField
          label="已填写字段"
          :model-value="filledFields"
          type="number"
          :is-calculated="true"
          :display-value="`${filledFields} 个`"
        />
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES } from '@/utils/constants'
import { formatLegalDate } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据
const formData = computed({
  get: () => formStore.answerForm,
  set: (value) => {
    // 这里可以添加额外的处理逻辑
  }
})

// 验证规则
const validationRules = {
  letterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ocName: [VALIDATION_RULES.required],
  ocFirm: [VALIDATION_RULES.required],
  ocAddress: [VALIDATION_RULES.required],
  caseName: [VALIDATION_RULES.required],
  caseNumber: [VALIDATION_RULES.required],
  defendantName: [VALIDATION_RULES.required],
  adNumber: [VALIDATION_RULES.required],
  respDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
}

// 格式化日期
const formattedLetterDate = computed(() => {
  return formData.value.letterDate ? formatLegalDate(formData.value.letterDate) : '待选择'
})

const formattedRespDate = computed(() => {
  return formData.value.respDate ? formatLegalDate(formData.value.respDate) : '待选择'
})

// 表单统计
const totalFields = computed(() => {
  return Object.keys(formData.value).length
})

const filledFields = computed(() => {
  return Object.values(formData.value).filter(value => {
    if (typeof value === 'string') return value.trim() !== ''
    return value !== null && value !== undefined
  }).length
})

const completionPercentage = computed(() => {
  const percentage = totalFields.value > 0 ? Math.round((filledFields.value / totalFields.value) * 100) : 0
  return Math.min(percentage, 100)
})

const formStatus = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) return '已完成'
  if (percentage >= 80) return '接近完成'
  if (percentage >= 50) return '半数完成'
  if (percentage >= 20) return '已开始'
  return '未开始'
})

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateAnswerForm(field, value)
  }
}

// 表单提交
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('回复表单验证通过，可以提交')
    }
  } catch (error) {
    console.log('回复表单验证失败:', error)
  }
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields(),
  formRef
})
</script>

<style scoped>
.answer-form {
  width: 100%;
}

.preview-section {
  background: var(--background-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border);
}

.preview-section h4 {
  color: var(--primary-color);
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  align-items: center;
}

.preview-section h4::before {
  content: '';
  width: 3px;
  height: 16px;
  background: var(--primary-color);
  margin-right: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.preview-content {
  background: var(--background);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
  font-family: 'Courier New', monospace;
  font-size: var(--font-sm);
  line-height: 1.6;
}

.preview-content p {
  margin: 0 0 var(--spacing-xs) 0;
}

.preview-content strong {
  color: var(--text-primary);
  font-weight: 600;
}

.placeholder-text {
  color: var(--text-light);
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .answer-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
  
  .preview-content {
    font-size: var(--font-xs);
  }
}
</style> 