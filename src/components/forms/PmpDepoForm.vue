<template>
  <div class="pmp-depo-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="validationRules"
      label-width="160px"
      label-position="top"
      size="default"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本案件信息组 -->
      <FormGroup
        title="Basic Case Information"
        description="Basic case and party information"
        icon="Document"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Plaintiff Name"
          v-model="formData.PlaintiffName"
          prop="PlaintiffName"
          type="text"
          placeholder="e.g. JUSTINO VALERIANO JIMENEZ"
          required
          description="Name of the plaintiff in the case"
        />

        <FormField
          label="Case Number"
          v-model="formData.CaseNumber"
          prop="CaseNumber"
          type="text"
          placeholder="e.g. 20STCV09196"
          required
          description="Court case number"
        />

        <FormField
          label="Defendant Name"
          v-model="formData.DefendantName"
          prop="DefendantName"
          type="text"
          placeholder="e.g. CASA LEADERS HP, INC"
          required
          description="Name of the defendant in the case"
        />
      </FormGroup>

      <!-- 对方律师信息组 -->
      <FormGroup
        title="Opposing Counsel Information"
        description="Information about opposing counsel and law firm"
        icon="Avatar"
        variant="bordered"
        :columns="1"
      >
        <FormField
          label="Opposing Counsel's Name"
          v-model="formData.OCName"
          prop="OCName"
          type="text"
          placeholder="e.g. Abraham Sandoval"
          required
          description="Name of the opposing counsel"
        />

        <FormField
          label="Opposing Firm Name"
          v-model="formData.OCFirm"
          prop="OCFirm"
          type="text"
          placeholder="e.g. SANDOVAL LAW, APC"
          required
          description="Name of the opposing law firm"
        />

        <FormField
          label="Opposing Firm Address"
          v-model="formData.OCAddress"
          prop="OCAddress"
          type="textarea"
          placeholder="e.g. 3435 Wilshire Boulevard, Suite 1620, Los Angeles, California 90010"
          :rows="3"
          required
          description="Complete address of the opposing law firm"
        />
      </FormGroup>

      <!-- 日期信息组 -->
      <FormGroup
        title="Date Information"
        description="Important dates related to the case"
        icon="Calendar"
        variant="card"
        :columns="1"
      >
        <FormField
          label="Meet and Confer Date"
          v-model="formData.MnCDate"
          prop="MnCDate"
          type="textarea"
          placeholder="e.g. September 17, 2020, September 22, 2020, September 24, 2020"
          :rows="2"
          required
          description="Enter multiple dates separated by commas (the date the m&c letter was sent)"
        />

        <el-form-item label="Letter Date" prop="LetterDate">
          <el-date-picker
            v-model="formData.LetterDate"
            type="date"
            placeholder="Select letter date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="PMP_DEPO_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="PMP DEPO"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES, PMP_DEPO_TEST_DATA } from '@/utils/constants'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = computed(() => formStore.pmpDepoForm)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updatePmpDepoForm(field, value)
}

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  OCName: [VALIDATION_RULES.required],
  OCFirm: [VALIDATION_RULES.required],
  OCAddress: [VALIDATION_RULES.required],
  MnCDate: [VALIDATION_RULES.required],
  LetterDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
}

// 表单提交处理
const handleSubmit = () => {
  // 表单提交逻辑在父组件中处理
}

// 表单验证方法
const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    console.log('PMP Depo 表单验证失败:', error)
    return false
  }
}



// 重置表单方法
const resetForm = () => {
  formStore.resetForm('pmpDepo')
}

defineExpose({
  validate,
  resetForm
})
</script>

<style scoped>
.pmp-depo-form {
  max-width: 100%;
  margin: 0 auto;
}
</style> 