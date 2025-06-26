<template>
  <div class="answer-form">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        label-width="160px"
        size="default"
    >
      <!-- Basic Information -->
      <FormGroup
          title="Basic Information"
          description="Basic information for court reply documents"
          icon="Document"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Letter Date" prop="letterDate">
          <el-date-picker
              v-model="formData.letterDate"
              type="date"
              placeholder="e.g. June 23, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Last Date to Respond" prop="respDate">
          <el-date-picker
              v-model="formData.respDate"
              type="date"
              placeholder="e.g. June 30, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- Opposing Counsel Information -->
      <FormGroup
          title="Opposing Counsel Information"
          description="Detailed information of opposing counsel and law firm"
          icon="Avatar"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Opposing Counsel's Name"
            v-model="formData.ocName"
            prop="ocName"
            type="textarea"
            placeholder="e.g. Amy Doe\nBryant Doe"
            :rows="3"
            required
            description="Allow line break for multiple counsel names"
        />

        <FormField
            label="Opposing Firm Name"
            v-model="formData.ocFirm"
            prop="ocFirm"
            type="text"
            placeholder="e.g. ABC, PC"
            required
        />

        <FormField
            label="Opposing Firm Address"
            v-model="formData.ocAddress"
            prop="ocAddress"
            type="textarea"
            placeholder="e.g. 123 Grand Ave, Los Angeles, CA 90019"
            :rows="4"
            required
            description="Allow line break for complete mailing address"
        />
      </FormGroup>

      <!-- Case Information -->
      <FormGroup
          title="Case Information"
          description="Detailed information of the related case"
          icon="FolderOpened"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Case Name"
            v-model="formData.caseName"
            prop="caseName"
            type="text"
            placeholder="e.g. James Doe v. Chris Wu"
            required
        />

        <FormField
            label="Case Number"
            v-model="formData.caseNumber"
            prop="caseNumber"
            type="text"
            placeholder="e.g. LASC123456"
            required
        />

        <FormField
            label="Defendant Name"
            v-model="formData.defendantName"
            prop="defendantName"
            type="text"
            placeholder="e.g. Chris Wu"
            required
        />

        <FormField
            label="Affirmative Defense Number Subject to Demurrer"
            v-model="formData.adNumber"
            prop="adNumber"
            type="text"
            placeholder="e.g. First through Twentieth"
            required
            description="Enter the range of affirmative defense numbers subject to demurrer"
        />
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import {useFormStore} from '@/stores/formStore'
import {VALIDATION_RULES} from '@/utils/constants'
import {formatLegalDate} from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = formStore.answerForm

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
  return formData.value?.letterDate ? formatLegalDate(formData.value.letterDate) : 'To be selected'
})

const formattedRespDate = computed(() => {
  return formData.value?.respDate ? formatLegalDate(formData.value.respDate) : 'To be selected'
})

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateAnswerForm(field, value)
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

/* 响应式调整 */
@media (max-width: 768px) {
  .answer-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style>
