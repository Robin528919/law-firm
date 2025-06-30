<template>
  <form @submit.prevent>
    <!-- Plaintiff Name -->
    <FormField label="Plaintiff Name" v-model="form.PlaintiffName" :required="true" />
    <!-- Defendant Name -->
    <FormField label="Defendant Name" v-model="form.DefendantName" :required="true" />
    <!-- PlaintiffPlurality1 自动填充，不可编辑 -->
    <FormField label="Plaintiff(s)" v-model="form.PlaintiffPlurality1" :readonly="true" />
    <!-- DefendantPlurality1 自动填充，不可编辑 -->
    <FormField label="Defendant(s)" v-model="form.DefendantPlurality1" :readonly="true" />
    <!-- Court County Location (All Capital) -->
    <FormField label="Court County Location (All Capital)" v-model="form.CourtLocation" :required="true" @input="onCourtLocationInput" placeholder="LOS ANGELES" />
    <!-- Court Name -->
    <FormField label="Court Name" v-model="form.CourtName" :required="true" placeholder="STANLEY MOSK COURTHOUSE" />
    <!-- Court Address -->
    <FormField label="Court Address" v-model="form.CourtAddress" :required="true" placeholder="111 North Hill Street, Room 307 Los Angeles, CA 90012" />
    <!-- Hearing Date -->
    <FormField label="Hearing Date" v-model="form.HearingDate" type="date" :required="true" />
    <!-- Hearing Time -->
    <FormField label="Hearing Time" v-model="form.HearingTime" type="time" :required="true" placeholder="08:30" />
    <!-- Hearing Department -->
    <FormField label="Hearing Department" v-model="form.HearingDept" :required="true" placeholder="26" />
    <!-- Reservation ID -->
    <FormField label="Reservation ID" v-model="form.ResID" :required="true" placeholder="354359308862" />
    <!-- Complaint filing date or expected filing date -->
    <FormField label="Complaint Filing Date" v-model="form.ComplaintFilingDate" type="date" :required="true" />
    <!-- Trial Date (if not set, type Not Set) -->
    <FormField label="Trial Date (if not set, type Not Set)" v-model="form.TrialDate" :required="true" placeholder="June 23, 2025 or Not Set" />
    <!-- Judge Name -->
    <FormField label="Judge Name" v-model="form.JudgeName" :required="true" placeholder="Michael Doe" />
    <!-- Case Number -->
    <FormField label="Case Number" v-model="form.CaseNumber" :required="true" placeholder="LASC123456" />
    <!-- Executed Date -->
    <FormField label="Executed Date" v-model="form.ExecutedDate" type="date" :required="true" />
    <!-- Case Type -->
    <FormSelector label="Case Type" v-model="form.CaseType" :options="caseTypeOptions" :required="true" />
    <!-- Selected Causes -->
    <FormSelector label="Choose Causes of Action" v-model="form.SelectedCauses" :options="causesOptions" multiple :required="true" />
    <!-- Answer Filing Date -->
    <FormField label="Answer Filing Date" v-model="form.AnswerFilingDate" type="date" :required="true" />
    <!-- Affirmative defenses subject to the demurrer -->
    <FormField label="Affirmative Defenses Subject to the Demurrer" v-model="form.ChosenAD" :required="true" />
    <!-- Service Info -->
    <FormField label="Service Info" v-model="form.ServiceInfo" :required="true" />
    <!-- Server Name -->
    <FormField label="Server Name" v-model="form.ServerName" :required="true" />
    <!-- Meet and Confer Date -->
    <FormField label="Meet and Confer Date" v-model="form.MnCDate" type="date" :required="true" />
    <!-- Requested Response Date -->
    <FormField label="Requested Response Date" v-model="form.MnCRespDate" type="date" :required="true" />
    <!-- Defendant's Response -->
    <FormField label="Defendant's Response" v-model="form.MnCResp" type="textarea" :required="false" />
    <!-- 操作按钮 -->
    <FormActions :onReset="onReset" :onExport="onExport" :onImport="onImport" :progress="progress" />
  </form>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { CAUSES_OF_ACTION, CASE_TYPE_OPTIONS } from '@/utils/constants'
import FormField from '../common/FormField.vue'
import FormSelector from '../common/FormSelector.vue'
import FormActions from '../common/FormActions.vue'

// 使用 Pinia store
const store = useFormStore()
const form = store.motionToStrikeForm

// 案件类型选项
const caseTypeOptions = CASE_TYPE_OPTIONS
// 诉因选项，格式化为 "1) ..."，不带括号内容
const causesOptions = CAUSES_OF_ACTION.map((item, idx) => `${idx + 1}) ${item.split('(')[0].trim()}`)

// 进度条
const progress = computed(() => {
  const total = Object.keys(form).length
  let filled = 0
  for (const key in form) {
    if (Array.isArray(form[key]) && form[key].length > 0) filled++
    else if (typeof form[key] === 'string' && form[key].trim() !== '') filled++
    else if (form[key] !== null && form[key] !== '' && form[key] !== undefined) filled++
  }
  return Math.round((filled / total) * 100)
})

// CourtLocation 自动大写
function onCourtLocationInput(val) {
  if (typeof val === 'string') {
    store.updateMotionToStrikeForm('CourtLocation', val.toUpperCase())
  } else {
    store.updateMotionToStrikeForm('CourtLocation', String(val).toUpperCase())
  }
}

// 重置
function onReset() {
  store.resetForm('motionToStrike')
}
// 导出
function onExport() {
  store.exportFormDataWithDownload()
}
// 导入
function onImport(e) {
  // 这里可根据实际导入逻辑补充
}

// 自动填充复数形式
watch(() => [form.PlaintiffName, form.DefendantName], ([p, d]) => {
  // 这里可调用已有的复数判断逻辑
  // 例如 store 里已有 getPlurality 方法
  if (store.complaintCalculations) {
    const pPlural = store.complaintCalculations.plaintiffPlurality1 || 'Plaintiff'
    const dPlural = store.complaintCalculations.defendantPlurality1 || 'Defendant'
    store.updateMotionToStrikeForm('PlaintiffPlurality1', pPlural)
    store.updateMotionToStrikeForm('DefendantPlurality1', dPlural)
  }
})
</script>

<!--
  中文注释：
  1. 字段、交互、校验、重置、导入导出、进度条等逻辑与 DemurrerForm 保持一致
  2. 字段名、顺序、特殊处理严格按用户表格
  3. CourtLocation 自动大写，复数自动填充
  4. 代码注释中文，界面英文
--> 