<template>
  <div class="demurrer-motion-strike-answer-form">
    <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        label-width="200px"
        size="default"
    >
      <!-- 测试数据工具 -->
      <TestDataTool
          :test-data="testData"
          :form-data="formData"
          :update-field="updateField"
          form-name="Demurrer and Motion to Strike Answer"
      />

      <!-- 法院信息 -->
      <FormGroup
          title="Court Information"
          description="Court location and case details"
          icon="ScaleToOriginal"
          variant="card"
          :columns="1"
      >
        <FormField
            label="Court County"
            v-model="formData.CourtCounty"
            prop="CourtCounty"
            type="text"
            placeholder="e.g. Orange"
            required
        />

        <FormField
            label="Court Name"
            v-model="formData.CourtName"
            prop="CourtName"
            type="text"
            placeholder="e.g. Central Justice Center"
            required
        />

        <FormField
            label="Case Number"
            v-model="formData.CaseNumber"
            prop="CaseNumber"
            type="text"
            placeholder="e.g. 30-2025-01486169-CU-OE-CJC"
            required
        />

        <FormField
            label="Judge Name"
            v-model="formData.JudgeName"
            prop="JudgeName"
            type="text"
            placeholder="e.g. Hon. H. Shania Colover"
            required
        />

        <FormField
            label="Department Number"
            v-model="formData.DeptNumber"
            prop="DeptNumber"
            type="text"
            placeholder="e.g. C34"
            required
        />
      </FormGroup>

      <!-- 当事人信息 -->
      <FormGroup
          title="Parties Information"
          description="Plaintiff and defendant information"
          icon="UserFilled"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Plaintiff Names"
            v-model="formData.PlaintiffNames"
            prop="PlaintiffNames"
            type="text"
            placeholder="e.g. Yintao Fu, Qi Lin"
            description="Multiple plaintiffs separated by commas"
            required
        />

        <FormField
            label="Defendant Names"
            v-model="formData.DefendantNames"
            prop="DefendantNames"
            type="text"
            placeholder="e.g. Kexin USA, Inc."
            description="Multiple defendants separated by commas"
            required
        />
      </FormGroup>

      <!-- 案件信息 -->
      <FormGroup
          title="Case Information"
          description="Complaint and answer details"
          icon="Document"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Complaint Filed Date" prop="ComplaintFiledDate">
          <el-date-picker
              v-model="formData.ComplaintFiledDate"
              type="date"
              placeholder="e.g. May 29, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
            label="Causes of Action"
            v-model="formData.CausesOfAction"
            prop="CausesOfAction"
            type="textarea"
            :rows="4"
            placeholder="e.g. Plaintiffs' Complaint alleges causes of action for: (1) Failure to Pay Wages..."
            description="List all causes of action in the complaint"
            required
        />

        <el-form-item label="Answer Filed Date" prop="AnswerFiledDate">
          <el-date-picker
              v-model="formData.AnswerFiledDate"
              type="date"
              placeholder="e.g. August 5, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>

      <!-- 听证信息 -->
      <FormGroup
          title="Hearing Information"
          description="Hearing schedule and details"
          icon="Calendar"
          variant="bordered"
          :columns="1"
      >
        <el-form-item label="Hearing Date" prop="HearingDate">
          <el-date-picker
              v-model="formData.HearingDate"
              type="date"
              placeholder="e.g. March 12, 2026"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
            label="Hearing Time"
            v-model="formData.HearingTime"
            prop="HearingTime"
            type="text"
            placeholder="e.g. 1:30 PM"
            required
        />

        <FormField
            label="Reservation ID"
            v-model="formData.ReservationID"
            prop="ReservationID"
            type="text"
            placeholder="e.g. 74647545"
        />

        <FormField
            label="Trial Date"
            v-model="formData.TrialDate"
            prop="TrialDate"
            type="text"
            placeholder="e.g. Not Set"
        />
      </FormGroup>

      <!-- 抗辩信息 -->
      <FormGroup
          title="Defense Information"
          description="Defense attack and response details"
          icon="Warning"
          variant="card"
          :columns="1"
      >
        <FormField
            label="AD Attack"
            v-model="formData.ADAttack"
            prop="ADAttack"
            type="textarea"
            :rows="3"
            placeholder="e.g. AI Generate"
            description="Describe which defenses are attacked"
        />

        <FormField
            label="Demurrer Defenses"
            v-model="formData.DemurrerDefenses"
            prop="DemurrerDefenses"
            type="textarea"
            :rows="2"
            placeholder="e.g. First through Thirty-First Affirmative Defenses"
            description="Defenses subject to demurrer"
            required
        />

        <FormField
            label="Strike Defenses"
            v-model="formData.StrikeDefenses"
            prop="StrikeDefenses"
            type="textarea"
            :rows="3"
            placeholder="e.g. Third, Sixth, Seventh, Eighth, Ninth, Tenth..."
            description="Defenses subject to motion to strike"
            required
        />
      </FormGroup>

      <!-- 律师信息 -->
      <FormGroup
          title="Defense Counsel Information"
          description="Defense attorney contact details"
          icon="User"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Defense Counsel Name"
            v-model="formData.DefenseCounselName"
            prop="DefenseCounselName"
            type="text"
            placeholder="e.g. Peter S. Deng"
            required
        />

        <FormField
            label="Defense Attorney Firm"
            v-model="formData.DefenseAttorneyFirm"
            prop="DefenseAttorneyFirm"
            type="text"
            placeholder="e.g. Law Offices of Peter S. Deng"
            required
        />

        <FormField
            label="Defense Attorney Address"
            v-model="formData.DefenseAttorneyAddress"
            prop="DefenseAttorneyAddress"
            type="textarea"
            :rows="2"
            placeholder="e.g. 123 E. Valley Blvd., Suite 107, San Gabriel, CA 91776"
            required
        />

        <FormField
            label="Defense Attorney Phone"
            v-model="formData.DefenseAttorneyPhone"
            prop="DefenseAttorneyPhone"
            type="text"
            placeholder="e.g. 626-688-7170"
            required
        />

        <FormField
            label="Defense Attorney Email"
            v-model="formData.DefenseAttorneyEmail"
            prop="DefenseAttorneyEmail"
            type="email"
            placeholder="e.g. peterdenglaw@gmail.com"
            required
        />
      </FormGroup>

      <!-- 会议协商信息 -->
      <FormGroup
          title="Meet & Confer Information"
          description="Meeting and conference details"
          icon="ChatDotRound"
          variant="card"
          :columns="1"
      >
        <el-form-item label="Meet & Confer Date" prop="MeetConferDate">
          <el-date-picker
              v-model="formData.MeetConferDate"
              type="date"
              placeholder="e.g. August 8, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <el-form-item label="Telephonic Meet Date" prop="TelephonicMeetDate">
          <el-date-picker
              v-model="formData.TelephonicMeetDate"
              type="date"
              placeholder="e.g. August 19, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>

        <FormField
            label="Amendment Response"
            v-model="formData.AmendAnswerResponse"
            prop="AmendAnswerResponse"
            type="textarea"
            :rows="3"
            placeholder="e.g. Defense counsel stated they would file an amended answer by August 22, 2025, but no filing was made."
            description="Defense counsel's response to amendment"
        />
      </FormGroup>

      <!-- 签署信息 -->
      <FormGroup
          title="Proof of Service"
          description="Service declaration information"
          icon="Edit"
          variant="bordered"
          :columns="1"
      >
        <FormField
            label="Declarant Name"
            v-model="formData.DeclarantName"
            prop="DeclarantName"
            type="text"
            placeholder="e.g. Qihao Qin"
            required
        />

        <el-form-item label="Execution Date" prop="ExecutionDate">
          <el-date-picker
              v-model="formData.ExecutionDate"
              type="date"
              placeholder="e.g. August 29, 2025"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              format="MMMM D, YYYY"
          />
        </el-form-item>
      </FormGroup>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFormStore } from '@/stores/formStore'
import FormGroup from '@/components/common/FormGroup.vue'
import FormField from '@/components/common/FormField.vue'
import TestDataTool from '@/components/common/TestDataTool.vue'
import { DEMURRER_MOTION_STRIKE_ANSWER_TEST_DATA } from '@/utils/constants'

// 使用表单存储
const formStore = useFormStore()

// 表单引用
const formRef = ref()

// 表单数据
const formData = computed(() => formStore.demurrerMotionStrikeAnswerForm)

// 测试数据
const testData = DEMURRER_MOTION_STRIKE_ANSWER_TEST_DATA

// 更新字段方法
const updateField = (field, value) => {
  formStore.demurrerMotionStrikeAnswerForm[field] = value
}

// 表单验证规则
const validationRules = {
  CourtCounty: [
    { required: true, message: 'Court county is required', trigger: 'blur' }
  ],
  CourtName: [
    { required: true, message: 'Court name is required', trigger: 'blur' }
  ],
  CaseNumber: [
    { required: true, message: 'Case number is required', trigger: 'blur' }
  ],
  JudgeName: [
    { required: true, message: 'Judge name is required', trigger: 'blur' }
  ],
  DeptNumber: [
    { required: true, message: 'Department number is required', trigger: 'blur' }
  ],
  PlaintiffNames: [
    { required: true, message: 'Plaintiff names are required', trigger: 'blur' }
  ],
  DefendantNames: [
    { required: true, message: 'Defendant names are required', trigger: 'blur' }
  ],
  ComplaintFiledDate: [
    { required: true, message: 'Complaint filed date is required', trigger: 'change' }
  ],
  CausesOfAction: [
    { required: true, message: 'Causes of action are required', trigger: 'blur' }
  ],
  AnswerFiledDate: [
    { required: true, message: 'Answer filed date is required', trigger: 'change' }
  ],
  HearingDate: [
    { required: true, message: 'Hearing date is required', trigger: 'change' }
  ],
  HearingTime: [
    { required: true, message: 'Hearing time is required', trigger: 'blur' }
  ],
  DemurrerDefenses: [
    { required: true, message: 'Demurrer defenses are required', trigger: 'blur' }
  ],
  StrikeDefenses: [
    { required: true, message: 'Strike defenses are required', trigger: 'blur' }
  ],
  DefenseCounselName: [
    { required: true, message: 'Defense counsel name is required', trigger: 'blur' }
  ],
  DefenseAttorneyFirm: [
    { required: true, message: 'Defense attorney firm is required', trigger: 'blur' }
  ],
  DefenseAttorneyAddress: [
    { required: true, message: 'Defense attorney address is required', trigger: 'blur' }
  ],
  DefenseAttorneyPhone: [
    { required: true, message: 'Defense attorney phone is required', trigger: 'blur' }
  ],
  DefenseAttorneyEmail: [
    { required: true, message: 'Defense attorney email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  DeclarantName: [
    { required: true, message: 'Declarant name is required', trigger: 'blur' }
  ],
  ExecutionDate: [
    { required: true, message: 'Execution date is required', trigger: 'change' }
  ]
}

// 表单验证方法
const validate = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    console.log('Validation failed:', error)
    return false
  }
}

// 暴露方法给父组件
defineExpose({
  validate
})
</script>

<style scoped lang="scss">
.demurrer-motion-strike-answer-form {
  padding: 20px 0;
}
</style>