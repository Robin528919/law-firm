<template>
  <div class="demurrer-form">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        label-width="200px"
        size="default"
    >
      <!-- 当事人信息 -->
      <FormGroup
          title="Parties Information"
          description="Plaintiff and defendant information"
          icon="UserFilled"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Plaintiff Name"
            v-model="formData.PlaintiffName"
            prop="PlaintiffName"
            type="text"
            placeholder="e.g. James Doe"
            required
        />

        <FormField
            label="Defendant Name"
            v-model="formData.DefendantName"
            prop="DefendantName"
            type="text"
            placeholder="e.g. Chris Wu"
            required
        />
      </FormGroup>

      <!-- 法院信息 -->
      <FormGroup
          title="Court Information"
          description="Court location and details"
          icon="ScaleToOriginal"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Court County Location"
            v-model="formData.CourtLocation"
            prop="CourtLocation"
            type="text"
            placeholder="e.g. LOS ANGELES"
            description="All capital letters"
            required
            @input="handleCourtLocationChange"
        />

        <FormField
            label="Court Name"
            v-model="formData.CourtName"
            prop="CourtName"
            type="text"
            placeholder="e.g. STANLEY MOSK COURTHOUSE"
            required
        />

        <FormField
            label="Court Address"
            v-model="formData.CourtAddress"
            prop="CourtAddress"
            type="textarea"
            :rows="3"
            placeholder="e.g. 111 North Hill Street, Room 307 Los Angeles, CA 90012"
            required
        />
      </FormGroup>

      <!-- 听证信息 -->
      <FormGroup
          title="Hearing Information"
          description="Hearing schedule and details"
          icon="Calendar"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Hearing Date" prop="HearingDate">
          <el-date-picker
              v-model="formData.HearingDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Hearing Time" prop="HearingTime">
          <el-time-picker
              v-model="formData.HearingTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="Select time"
              style="width: 100%"
          />
        </el-form-item>

        <FormField
            label="Hearing Department"
            v-model="formData.HearingDept"
            prop="HearingDept"
            type="text"
            placeholder="e.g. 26"
            required
        />

        <FormField
            label="Reservation ID"
            v-model="formData.ResID"
            prop="ResID"
            type="text"
            placeholder="e.g. 354359308862"
            required
        />
      </FormGroup>

      <!-- 案件信息 -->
      <FormGroup
          title="Case Information"
          description="Case details and filing information"
          icon="FolderOpened"
          variant="default"
          :columns="1"
      >
        <FormField
            label="Case Number"
            v-model="formData.CaseNumber"
            prop="CaseNumber"
            type="text"
            placeholder="e.g. LASC123456"
            required
        />

        <FormField
            label="Judge Name"
            v-model="formData.JudgeName"
            prop="JudgeName"
            type="text"
            placeholder="e.g. Michael Doe (without Hon.)"
            required
        />

        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate">
          <el-date-picker
              v-model="formData.ComplaintFilingDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Answer Filing Date" prop="AnswerFilingDate">
          <el-date-picker
              v-model="formData.AnswerFilingDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Executed Date" prop="ExecutedDate">
          <el-date-picker
              v-model="formData.ExecutedDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <!-- Trial Date 特殊处理：切换按钮 -->
        <el-form-item label="Trial Date" prop="TrialDate">
          <div class="trial-date-field">
            <el-radio-group v-model="trialDateMode" @change="handleTrialDateModeChange" size="small">
              <el-radio-button :value="'date'">Set Date</el-radio-button>
              <el-radio-button :value="'notSet'">Not Set</el-radio-button>
            </el-radio-group>
            
            <el-date-picker
                v-if="trialDateMode === 'date'"
                v-model="trialDateValue"
                type="date"
                placeholder="Select trial date"
                style="width: 100%; margin-top: 8px;"
                value-format="MMMM D, YYYY"
                format="MMMM D, YYYY"
                @change="handleTrialDateChange"
            />
            
            <div v-else class="not-set-display">
              Trial Date: Not Set
            </div>
          </div>
        </el-form-item>

        <FormField
            label="Case Type"
            v-model="formData.CaseType"
            prop="CaseType"
            type="select"
            :options="caseTypeOptions"
            placeholder="Select case type"
            required
        />

        <FormField
            label="Selected Causes of Action"
            v-model="formData.SelectedCauses"
            prop="SelectedCauses"
            type="select"
            multiple
            :options="demurrerCausesOptions"
            placeholder="Select multiple causes"
            description="Multiple selection allowed"
            required
        />

        <FormField
            label="Affirmative Defenses Subject to Demurrer"
            v-model="formData.ChosenAD"
            prop="ChosenAD"
            type="text"
            placeholder="e.g. First through Twenty-First"
            required
        />
      </FormGroup>

      <!-- Service Information - 结构化输入 -->
      <FormGroup
          title="Service Information"
          description="Counsel contact and service details"
          icon="Postcard"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Counsel Name"
            v-model="serviceInfo.counselName"
            type="text"
            placeholder="e.g. John Smith"
            @input="updateServiceInfo"
        />

        <FormField
            label="Firm Name"
            v-model="serviceInfo.firmName"
            type="text"
            placeholder="e.g. Smith & Associates"
            @input="updateServiceInfo"
        />

        <FormField
            label="Address"
            v-model="serviceInfo.address"
            type="textarea"
            :rows="3"
            placeholder="e.g. 123 Main St, Los Angeles, CA 90012"
            @input="updateServiceInfo"
        />

        <FormField
            label="Phone Number"
            v-model="serviceInfo.phoneNumber"
            type="text"
            placeholder="e.g. (213) 123-4567"
            @input="updateServiceInfo"
        />

        <FormField
            label="Fax Number"
            v-model="serviceInfo.faxNumber"
            type="text"
            placeholder="e.g. (213) 123-4568"
            @input="updateServiceInfo"
        />

        <FormField
            label="Email Address"
            v-model="serviceInfo.emailAddress"
            type="email"
            placeholder="e.g. john@smithlaw.com"
            @input="updateServiceInfo"
        />

        <FormField
            label="Server Name"
            v-model="formData.ServerName"
            prop="ServerName"
            type="text"
            placeholder="e.g. Professional Process Server"
            description="Who will serve the document"
        />
      </FormGroup>

      <!-- Meet & Confer 信息 -->
      <FormGroup
          title="Meet & Confer Information"
          description="Meet and confer correspondence details"
          icon="ChatDotRound"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Meet and Confer Date" prop="MnCDate">
          <el-date-picker
              v-model="formData.MnCDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Requested Response Date" prop="MnCRespDate">
          <el-date-picker
              v-model="formData.MnCRespDate"
              type="date"
              placeholder="e.g. July 21, 2025"
              style="width: 100%"
              value-format="MMMM D, YYYY"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
            label="Defendant's Response"
            v-model="formData.MnCResp"
            prop="MnCResp"
            type="textarea"
            :rows="4"
            placeholder="e.g. On July 21, 2025, Defendant's Counsel sent a letter for clarification or By July 21, 2025, I did not receive any response from Defendant's Counsel"
            description="Can put multiple paragraphs if there were back and forth correspondences"
        />
      </FormGroup>

      <!-- 语法助手（自动计算复数形式） -->
      <FormGroup
          title="Grammar Helper"
          description="Automatically generated grammar forms based on number of parties"
          icon="EditPen"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Plaintiff"
            v-model="formData.PlaintiffPlurality1"
            type="text"
            :is-calculated="true"
            description="Plaintiff or Plaintiffs. Automatically applied based on single or multiple plaintiff"
        />

        <FormField
            label="Defendant"
            v-model="formData.DefendantPlurality1"
            type="text"
            :is-calculated="true"
            description="Defendant or Defendants. Automatically applied based on single or multiple defendants"
        />
      </FormGroup>

      <!-- 测试数据工具 -->
      <TestDataTool
        :test-data="DEMURRER_TEST_DATA"
        :form-data="formData"
        :update-field="updateField"
        form-name="DEMURRER"
        :exclude-fields="['ExecutedDate']"
      />
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { useFormStore } from '@/stores/formStore'
import {
  CASE_TYPE_OPTIONS,
  DEMURRER_CAUSES_OPTIONS,
  VALIDATION_RULES,
  DEMURRER_TEST_DATA
} from '@/utils/constants'
import { getPlurality } from '@/utils/calculations'

// 使用表单状态管理
const formStore = useFormStore()
const formRef = ref()

// 表单数据 - 直接使用 ref，支持双向绑定
const formData = computed(() => formStore.demurrerForm)

// 表单字段更新方法
const updateField = (field, value) => {
  formStore.updateDemurrerForm(field, value)
}

// 选择选项
const caseTypeOptions = CASE_TYPE_OPTIONS
const demurrerCausesOptions = DEMURRER_CAUSES_OPTIONS

// Trial Date 特殊处理
const trialDateMode = ref('notSet')
const trialDateValue = ref(null)

// 初始化 trial date mode
watchEffect(() => {
  if (formData.value?.TrialDate === 'Not Set') {
    trialDateMode.value = 'notSet'
    trialDateValue.value = null
  } else if (formData.value?.TrialDate) {
    trialDateMode.value = 'date'
    trialDateValue.value = formData.value.TrialDate
  }
})

const handleTrialDateModeChange = (mode) => {
  if (mode === 'notSet') {
    formStore.updateDemurrerForm('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    formStore.updateDemurrerForm('TrialDate', '')
    trialDateValue.value = null
  }
}

const handleTrialDateChange = (value) => {
  formStore.updateDemurrerForm('TrialDate', value)
}

// Court Location 大写转换
const handleCourtLocationChange = (value) => {
  formStore.updateDemurrerForm('CourtLocation', value.toUpperCase())
}

// ServiceInfo 结构化处理
const serviceInfo = ref({
  counselName: '',
  firmName: '',
  address: '',
  phoneNumber: '',
  faxNumber: '',
  emailAddress: ''
})

const updateServiceInfo = () => {
  // 格式化为单个字符串，只包含非空字段
  const fields = [
    serviceInfo.value.counselName && `Counsel: ${serviceInfo.value.counselName}`,
    serviceInfo.value.firmName && `Firm: ${serviceInfo.value.firmName}`,
    serviceInfo.value.address && `Address: ${serviceInfo.value.address}`,
    serviceInfo.value.phoneNumber && `Phone: ${serviceInfo.value.phoneNumber}`,
    serviceInfo.value.faxNumber && `Fax: ${serviceInfo.value.faxNumber}`,
    serviceInfo.value.emailAddress && `Email: ${serviceInfo.value.emailAddress}`
  ].filter(Boolean)
  
  formStore.updateDemurrerForm('ServiceInfo', fields.join('; '))
}

// 复数形式自动计算
watchEffect(() => {
  const plaintiffPlurality = getPlurality(formData.value?.PlaintiffName || '')
  formStore.updateDemurrerForm('PlaintiffPlurality1', plaintiffPlurality.form1)

  const defendantPlurality = getPlurality(formData.value?.DefendantName || '')
  formStore.updateDemurrerForm('DefendantPlurality1', defendantPlurality.form1Defendant)
})

// Selected Causes 格式化输出
const formattedSelectedCauses = computed(() => {
  return formData.value?.SelectedCauses?.join(', ') || ''
})

// 验证规则
const validationRules = {
  PlaintiffName: [VALIDATION_RULES.required],
  DefendantName: [VALIDATION_RULES.required],
  CourtLocation: [VALIDATION_RULES.required],
  CourtName: [VALIDATION_RULES.required],
  CourtAddress: [VALIDATION_RULES.required],
  HearingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  HearingTime: [VALIDATION_RULES.required],
  HearingDept: [VALIDATION_RULES.required],
  ResID: [VALIDATION_RULES.required],
  CaseNumber: [VALIDATION_RULES.required],
  JudgeName: [VALIDATION_RULES.required],
  ComplaintFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  AnswerFilingDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  ExecutedDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  CaseType: [VALIDATION_RULES.required],
  SelectedCauses: [VALIDATION_RULES.required],
  ChosenAD: [VALIDATION_RULES.required],
  MnCDate: [VALIDATION_RULES.required, VALIDATION_RULES.date],
  MnCRespDate: [VALIDATION_RULES.required, VALIDATION_RULES.date]
}

// 字段变更处理
const handleFieldChange = (value, field) => {
  if (field) {
    formStore.updateDemurrerForm(field, value)
  }
}

// 暴露方法给父组件
defineExpose({
  validate: () => formRef.value?.validate(),
  resetForm: () => formRef.value?.resetFields()
})
</script>

<style scoped>
.demurrer-form {
  width: 100%;
}

.trial-date-field {
  width: 100%;
}

.trial-date-field .el-radio-group {
  margin-bottom: 8px;
}

.not-set-display {
  padding: 8px 0;
  color: var(--text-secondary);
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .demurrer-form :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style> 