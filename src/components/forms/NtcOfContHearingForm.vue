<template>
  <div class="ntc-of-cont-hearing-form">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        label-width="200px"
        size="default"
    >
      <!-- 基础案件信息 -->
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
            placeholder="e.g. GUSTAVO ARCE CORDERO"
            required
            description="Name of the plaintiff in the case"
        />

        <FormField
            label="Defendant Name"
            v-model="formData.DefendantName"
            prop="DefendantName"
            type="text"
            placeholder="e.g. BROADWAY EXCHANGE, LP"
            required
            description="Name of the defendant in the case"
        />

        <FormField
            label="Case Number"
            v-model="formData.CaseNumber"
            prop="CaseNumber"
            type="text"
            placeholder="e.g. 24STCV25513"
            required
            description="Court case identification number"
        />

        <FormField
            label="What's the proceeding that's been continued?"
            v-model="formData.ProceedingName"
            prop="ProceedingName"
            type="text"
            placeholder="e.g. Motion to Compel Production"
            required
            description="Name of the proceeding being continued"
        />
      </FormGroup>

      <!-- 法院信息 -->
      <FormGroup
          title="Court Information"
          description="Court location and judicial information"
          icon="Location"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Court Location (County)"
            v-model="formData.CourtLocation"
            prop="CourtLocation"
            type="text"
            placeholder="e.g. COUNTY OF LOS ANGELES"
            required
            description="County where the court is located (all capitals)"
        />

        <FormField
            label="Court Name"
            v-model="formData.CourtName"
            prop="CourtName"
            type="text"
            placeholder="e.g. STANLEY MOSK COURTHOUSE"
            required
            description="Name of the courthouse"
        />

        <FormField
            label="Court Address"
            v-model="formData.CourtAddress"
            prop="CourtAddress"
            type="text"
            placeholder="e.g. 111 N. Hill Street, Los Angeles, CA 90012"
            required
            description="Full address of the court"
        />

        <FormField
            label="Judge Name"
            v-model="formData.JudgeName"
            prop="JudgeName"
            type="text"
            placeholder="e.g. Hon. Upinder S. Kalra"
            required
            description="Name of the presiding judge"
        />
      </FormGroup>

      <!-- 原听证信息 -->
      <FormGroup
          title="Original Hearing Information"
          description="Original hearing date, time and department"
          icon="Calendar"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Old Hearing Department"
            v-model="formData.HearingDept"
            prop="HearingDept"
            type="text"
            placeholder="e.g. Dept. '51'"
            required
            description="Original hearing department number"
        />

        <el-form-item label="Old Hearing Date" prop="HearingDate" required>
          <el-date-picker
              v-model="formData.HearingDate"
              type="date"
              placeholder="Select original hearing date"
              format="MMMM D, YYYY"
              value-format="MMMM D, YYYY"
              style="width: 100%"
          />
          <div class="field-description">Date of the original hearing</div>
        </el-form-item>

        <el-form-item label="Old Hearing Time" prop="HearingTime" required>
          <el-time-picker
              v-model="formData.HearingTime"
              placeholder="Select original hearing time"
              format="h:mm A"
              value-format="h:mm A"
              style="width: 100%"
          />
          <div class="field-description">Time of the original hearing</div>
        </el-form-item>
      </FormGroup>

      <!-- 新听证信息 -->
      <FormGroup
          title="New Hearing Information"
          description="New hearing date, time and department"
          icon="Calendar"
          variant="card"
          :columns="1"
      >
        <FormField
            label="New Hearing Department"
            v-model="formData.HearingDept2"
            prop="HearingDept2"
            type="text"
            placeholder="e.g. Dept. '51'"
            required
            description="New hearing department number"
        />

        <el-form-item label="New Hearing Date" prop="HearingDate2" required>
          <el-date-picker
              v-model="formData.HearingDate2"
              type="date"
              placeholder="Select new hearing date"
              format="MMMM D, YYYY"
              value-format="MMMM D, YYYY"
              style="width: 100%"
          />
          <div class="field-description">Date of the new hearing</div>
        </el-form-item>

        <el-form-item label="New Hearing Time" prop="HearingTime2" required>
          <el-time-picker
              v-model="formData.HearingTime2"
              placeholder="Select new hearing time"
              format="h:mm A"
              value-format="h:mm A"
              style="width: 100%"
          />
          <div class="field-description">Time of the new hearing</div>
        </el-form-item>
      </FormGroup>

      <!-- 案件相关日期 -->
      <FormGroup
          title="Case Related Dates"
          description="Important case dates and trial information"
          icon="Timer"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Complaint Filing Date" prop="ComplaintFilingDate" required>
          <el-date-picker
              v-model="formData.ComplaintFilingDate"
              type="date"
              placeholder="Select complaint filing date"
              format="MMMM D, YYYY"
              value-format="MMMM D, YYYY"
              style="width: 100%"
          />
          <div class="field-description">Date when the complaint was filed</div>
        </el-form-item>

        <!-- Trial Date 特殊处理：支持 "Not Set" 和具体日期 -->
        <el-form-item label="Trial Date" prop="TrialDate" required>
          <div class="trial-date-container">
            <el-radio-group v-model="trialDateMode" @change="handleTrialDateModeChange">
              <el-radio value="not-set">Not Set</el-radio>
              <el-radio value="date">Specific Date</el-radio>
            </el-radio-group>
            <el-date-picker
                v-if="trialDateMode === 'date'"
                v-model="trialDateValue"
                type="date"
                placeholder="Select trial date"
                format="MMMM D, YYYY"
                value-format="MMMM D, YYYY"
                style="width: 100%; margin-top: 8px"
                @change="handleTrialDateChange"
            />
          </div>
          <div class="field-description">Trial date if set, otherwise 'Not Set'</div>
        </el-form-item>

        <el-form-item label="Letter Date" prop="LetterDate" required>
          <el-date-picker
              v-model="formData.LetterDate"
              type="date"
              placeholder="Select letter date"
              format="MMMM D, YYYY"
              value-format="MMMM D, YYYY"
              style="width: 100%"
          />
          <div class="field-description">Date of the letter</div>
        </el-form-item>
      </FormGroup>

      <!-- 其他信息 -->
      <FormGroup
          title="Additional Information"
          description="Reservation, service and server information"
          icon="InfoFilled"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Reservation ID"
            v-model="formData.ResID"
            prop="ResID"
            type="text"
            placeholder="e.g. 526290823671"
            required
            description="Court reservation identification number"
        />

        <FormField
            label="Service Info"
            v-model="formData.ServiceInfo"
            prop="ServiceInfo"
            type="textarea"
            placeholder="e.g. Email: brianu@jbulaw.com"
            :rows="3"
            required
            description="Service information including counsel details"
        />

        <FormField
            label="Server Name"
            v-model="formData.ServerName"
            prop="ServerName"
            type="text"
            placeholder="e.g. Jennifer Ontiveros"
            required
            description="Name of the person who will serve the document"
        />
      </FormGroup>

      <!-- 自动计算字段 -->
      <FormGroup
          title="Auto-Calculated Fields"
          description="These fields are automatically calculated"
          icon="Calculator"
          variant="info"
          :columns="1"
      >
        <FormField
            label="Plaintiff Plurality"
            :model-value="calculations.plaintiffPlurality1"
            type="text"
            disabled
            placeholder="Auto-calculated"
            description="Automatically determined based on plaintiff names"
        />

        <FormField
            label="Defendant Plurality"
            :model-value="calculations.defendantPlurality1"
            type="text"
            disabled
            placeholder="Auto-calculated"
            description="Automatically determined based on defendant names"
        />

        <FormField
            label="Executed Date"
            :model-value="calculations.executedDate"
            type="text"
            disabled
            placeholder="Auto-calculated"
            description="Automatically set to current date"
        />
      </FormGroup>

      <!-- 测试数据按钮 -->
      <FormGroup
          v-if="isDevelopment"
          title="Development Tools"
          description="Testing utilities for development"
          icon="DocumentCopy"
          variant="warning"
          :columns="1"
      >
        <el-button
            type="warning"
            @click="fillTestData"
            :loading="isLoadingTestData"
            :icon="DocumentCopy"
            style="width: 100%"
        >
          Fill Test Data
        </el-button>
        <div class="field-description">
          Automatically fill the form with test data for development purposes
          <br>Environment: {{ environment }} | Debug Mode: {{ debugMode }}
        </div>
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { VALIDATION_RULES, NTC_OF_CONT_HEARING_TEST_DATA, API_CONFIG } from '@/utils/constants'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import { DocumentCopy } from '@element-plus/icons-vue'

// Store
const formStore = useFormStore()

// 响应式数据
const formRef = ref(null)
const isLoadingTestData = ref(false)
const trialDateMode = ref('not-set')
const trialDateValue = ref(null)

// 环境信息
const environment = computed(() => API_CONFIG.ENVIRONMENT)
const debugMode = computed(() => API_CONFIG.DEBUG)
const isDevelopment = computed(() => environment.value === 'development')

// 表单数据
const formData = computed(() => formStore.ntcOfContHearingForm)

// 计算字段
const calculations = computed(() => formStore.ntcOfContHearingCalculations)

// 验证规则
const validationRules = {
  PlaintiffName: [{ ...VALIDATION_RULES.REQUIRED }],
  DefendantName: [{ ...VALIDATION_RULES.REQUIRED }],
  ProceedingName: [{ ...VALIDATION_RULES.REQUIRED }],
  CaseNumber: [{ ...VALIDATION_RULES.REQUIRED }],
  JudgeName: [{ ...VALIDATION_RULES.REQUIRED }],
  CourtLocation: [{ ...VALIDATION_RULES.REQUIRED }],
  CourtName: [{ ...VALIDATION_RULES.REQUIRED }],
  CourtAddress: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingDept: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingDate: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingTime: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingDept2: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingDate2: [{ ...VALIDATION_RULES.REQUIRED }],
  HearingTime2: [{ ...VALIDATION_RULES.REQUIRED }],
  ComplaintFilingDate: [{ ...VALIDATION_RULES.REQUIRED }],
  TrialDate: [{ ...VALIDATION_RULES.REQUIRED }],
  LetterDate: [{ ...VALIDATION_RULES.REQUIRED }],
  ResID: [{ ...VALIDATION_RULES.REQUIRED }],
  ServiceInfo: [{ ...VALIDATION_RULES.REQUIRED }],
  ServerName: [{ ...VALIDATION_RULES.REQUIRED }]
}

// 表单更新方法
const updateField = (field, value) => {
  formStore.updateNtcOfContHearingForm(field, value)
}

// Trial Date 处理
const handleTrialDateModeChange = (mode) => {
  if (mode === 'not-set') {
    updateField('TrialDate', 'Not Set')
    trialDateValue.value = null
  } else {
    updateField('TrialDate', '')
  }
}

const handleTrialDateChange = (date) => {
  if (date) {
    updateField('TrialDate', date)
  }
}

// 初始化 Trial Date 模式
const initializeTrialDateMode = () => {
  if (formData.value.TrialDate === 'Not Set' || !formData.value.TrialDate) {
    trialDateMode.value = 'not-set'
    trialDateValue.value = null
  } else {
    trialDateMode.value = 'date'
    trialDateValue.value = formData.value.TrialDate
  }
}

// 监听 formData.TrialDate 变化
watch(() => formData.value.TrialDate, (newValue) => {
  if (newValue === 'Not Set') {
    trialDateMode.value = 'not-set'
    trialDateValue.value = null
  } else if (newValue && newValue !== 'Not Set') {
    trialDateMode.value = 'date'
    trialDateValue.value = newValue
  }
}, { immediate: true })

// 填充测试数据
const fillTestData = async () => {
  try {
    isLoadingTestData.value = true
    console.log('开始填充 NTC OF CONTINUED HEARING 表单测试数据...')
    
    // 填充除自动计算字段外的所有数据
    Object.keys(NTC_OF_CONT_HEARING_TEST_DATA).forEach(key => {
      // ExecutedDate 是自动计算字段，不需要填充
      if (key !== 'ExecutedDate' && Object.prototype.hasOwnProperty.call(formData.value, key)) {
        updateField(key, NTC_OF_CONT_HEARING_TEST_DATA[key])
      }
    })
    
    // 特殊处理 Trial Date
    const trialDateTestValue = NTC_OF_CONT_HEARING_TEST_DATA.TrialDate
    if (trialDateTestValue === 'Not Set') {
      trialDateMode.value = 'not-set'
      trialDateValue.value = null
    } else {
      trialDateMode.value = 'date'
      trialDateValue.value = trialDateTestValue
    }
    
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('NTC OF CONTINUED HEARING 表单测试数据填充完成')
  } catch (error) {
    console.error('填充测试数据时出错:', error)
  } finally {
    isLoadingTestData.value = false
  }
}

// 表单验证方法
const validate = async () => {
  if (!formRef.value) return false
  
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    console.error('表单验证失败:', error)
    return false
  }
}

// 组件挂载时初始化
onMounted(() => {
  initializeTrialDateMode()
})

// 暴露验证方法给父组件
defineExpose({
  validate
})
</script>

<style scoped lang="scss">
.ntc-of-cont-hearing-form {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.trial-date-container {
  .el-radio-group {
    margin-bottom: 8px;
  }
}

.field-description {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-time-picker) {
  width: 100%;
}
</style> 