import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as calculations from '@/utils/calculations'
import { formatLegalDate, formatDefendantName } from '@/utils/calculations'

export const useFormStore = defineStore('form', () => {
  // 当前选中的表单类型
  const currentFormType = ref('complaint')
  
  // 通用提交邮箱地址
  const submissionEmail = ref('')
  
  // 起诉/损害赔偿表单数据
  const complaintForm = ref({
    // 基础信息
    plaintiffName: '',
    plaintiffJob: '',
    defendantName: '',
    defendantState: '',
    defendantEntityType: '',
    courtLocation: '',
    courtName: '',
    caseNumber: ' ', // 默认空格
    judgeName: '',
    complaintFilingDate: null,
    
    // 选择字段
    selectedCauses: [],
    payPeriodInterval: '',
    
    // 地址信息
    plaintiffResidence: '',
    defendantBusinessType: '',
    defendantBusinessAddress: '',
    
    // 雇佣信息
    employmentStartDate: null,
    employmentEndDate: null,
    hourlyRate: 0,
    unpaidHours: 0,
    weeklyHours: 0,
    doubleOvertimeHours: 0,
    
    // 其他字段
    iwcOrder: 0,
    payPeriods: 0,
    missedMealBreaks: 0,
    missedRestBreaks: 0,
    businessExpenseType: '',
    businessExpenseAmount: 0
  })
  
  // 回复表单数据
  const answerForm = ref({
    LetterDate: null,
    OCName: '',
    OCFirm: '',
    OCAddress: '',
    CaseName: '',
    CaseNumber: '',
    DefendantName: '',
    ADNumber: '',
    RespDate: null
  })
  
  // 和解协议表单数据
  const settlementForm = ref({
    PlaintiffName: '',
    DefendantName: '',
    DefendantState: '',
    DefendantEntityType: '',
    CourtName: '',
    CaseName: '',
    CaseNumber: ' ', // 默认空格
    SettlementWrittenAmount: '',
    SettlementNumericalAmount: 0,
    InstallmentPayment: '',
    DefenseContactMethod: '',
    DefenseEmail: '',
    DefenseFax: '',
    DefenseCounselName: '',
    DefenseCounselFirm: '',
    DefenseFirmAddress: '',
    PlaintiffPlurality1: 'Plaintiff',
    DefendantPlurality1: 'Defendant'
  })

  // Demurrer 表单数据
  const demurrerForm = ref({
    PlaintiffName: '',
    DefendantName: '',
    PlaintiffPlurality1: 'Plaintiff',
    DefendantPlurality1: 'Defendant',
    CourtLocation: '',
    CourtName: '',
    CourtAddress: '',
    HearingDate: null,
    HearingTime: '',
    HearingDept: '',
    ResID: '',
    ComplaintFilingDate: null,
    TrialDate: 'Not Set',
    JudgeName: '',
    CaseNumber: '',
    ExecutedDate: null,
    CaseType: '',
    SelectedCauses: [],
    AnswerFilingDate: null,
    ChosenAD: '',
    ServiceInfo: '',
    ServerName: '',
    MnCDate: null,
    MnCRespDate: null,
    MnCResp: ''
  })

  // Motion to Strike 表单数据
  const motionToStrikeForm = ref({
    PlaintiffName: '',
    DefendantName: '',
    PlaintiffPlurality1: 'Plaintiff',
    DefendantPlurality1: 'Defendant',
    CourtLocation: 'LOS ANGELES',
    CourtName: 'STANLEY MOSK COURTHOUSE',
    CourtAddress: '111 North Hill Street, Room 307 Los Angeles, CA 90012',
    HearingDate: null,
    HearingTime: '8:30 AM',
    HearingDept: '26',
    ResID: '354359308862',
    ComplaintFilingDate: null,
    TrialDate: 'Not Set',
    JudgeName: '',
    CaseNumber: '',
    ExecutedDate: null,
    CaseType: '',
    SelectedCauses: [],
    AnswerFilingDate: null,
    ChosenAD: '',
    ServiceInfo: '',
    ServerName: '',
    MnCDate: null,
    MnCRespDate: null,
    MnCResp: ''
  })
  
  // 格式化的被告名称（起诉表单）
  const formattedComplaintDefendantName = computed(() => {
    const form = complaintForm.value
    return formatDefendantName(form.defendantName, form.defendantState, form.defendantEntityType)
  })

  // 格式化的被告名称（回复表单）
  const formattedAnswerDefendantName = computed(() => {
    const form = answerForm.value
    // 回复表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // 格式化的被告名称（和解表单）
  const formattedSettlementDefendantName = computed(() => {
    const form = settlementForm.value
    return formatDefendantName(form.DefendantName, form.DefendantState, form.DefendantEntityType)
  })

  // 格式化的被告名称（Demurrer表单）
  const formattedDemurrerDefendantName = computed(() => {
    const form = demurrerForm.value
    // Demurrer表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // 格式化的被告名称（Motion to Strike表单）
  const formattedMotionToStrikeDefendantName = computed(() => {
    const form = motionToStrikeForm.value
    // Motion to Strike表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // Motion to Strike 表单的计算字段
  const motionToStrikeCalculations = computed(() => {
    const form = motionToStrikeForm.value
    
    // 复数形式计算
    const plaintiffPlurality = calculations.getPlurality(form.PlaintiffName)
    const defendantPlurality = calculations.getPlurality(form.DefendantName)
    
    // 执行日期 - 当前日期
    const executedDate = formatLegalDate(new Date())
    
    return {
      // 复数形式
      plaintiffPlurality1: plaintiffPlurality.form1,
      defendantPlurality1: defendantPlurality.form1Defendant,
      
      // 执行日期
      executedDate
    }
  })

  // 起诉表单的计算字段
  const complaintCalculations = computed(() => {
    const form = complaintForm.value
    
    // 基础计算
    const doe = calculations.calculateDOE(
      form.complaintFilingDate,
      form.employmentStartDate,
      form.employmentEndDate
    )
    
    const oneAndHalfOvertimeHours = calculations.calculate1_5OvertimeHours(
      form.weeklyHours,
      form.doubleOvertimeHours
    )
    
    const overtimeHoursTotal = calculations.calculateOvertimeHoursTotal(
      oneAndHalfOvertimeHours,
      form.doubleOvertimeHours
    )
    
    // 损害赔偿计算
    const damageUnpaidWages = calculations.calculateDamageUnpaidWages(
      form.unpaidHours,
      form.hourlyRate
    )
    
    const damageMealBreaks = calculations.calculateDamageMealBreaks(
      form.missedMealBreaks,
      doe,
      form.hourlyRate
    )
    
    const damageRestBreaks = calculations.calculateDamageRestBreaks(
      form.missedRestBreaks,
      doe,
      form.hourlyRate
    )
    
    const damageOvertime = calculations.calculateDamageOvertime(
      oneAndHalfOvertimeHours,
      form.doubleOvertimeHours,
      form.hourlyRate,
      doe
    )
    
    const damageWaitingTime = calculations.calculateDamageWaitingTime(form.hourlyRate)
    
    const wageStatementPenalty = calculations.calculateWageStatementPenalty(form.payPeriods)
    
    const damages = {
      damageUnpaidWages,
      damageMealBreaks,
      damageRestBreaks,
      damageOvertime,
      damageWaitingTime,
      businessExpenseAmount: form.businessExpenseAmount,
      wageStatementPenalty
    }
    
    const damageTotal = calculations.calculateDamageTotal(damages)
    
    // 利息计算
    const interestPeriod = calculations.calculateInterestPeriod(
      form.complaintFilingDate,
      form.employmentEndDate
    )
    
    const preJudgmentInterest = calculations.calculatePreJudgmentInterest(
      damageTotal,
      interestPeriod
    )
    
    const damageTotalIncludingInterest = calculations.calculateDamageTotalIncludingInterest(
      damageTotal,
      preJudgmentInterest
    )
    
    // 复数形式
    const plaintiffPlurality = calculations.getPlurality(form.plaintiffName)
    const defendantPlurality = calculations.getPlurality(formattedComplaintDefendantName.value)
    
    // 状态判断
    const overtimeStatus = calculations.calculateOvertimeStatus(form.weeklyHours)
    
    // 日期字段
    const executedDate = formatLegalDate(new Date())
    const sol3 = calculations.calculate3SOL(form.complaintFilingDate)
    const sol4 = calculations.calculate4SOL(form.complaintFilingDate)
    
    // 案件编号
    const causeNumber = calculations.generateCauseNumber(0)
    
    return {
      // 基础计算
      doe,
      oneAndHalfOvertimeHours,
      overtimeHoursTotal,
      
      // 损害赔偿
      damageUnpaidWages,
      damageMealBreaks,
      damageRestBreaks,
      damageOvertime,
      damageWaitingTime,
      wageStatementPenalty,
      damageTotal,
      
      // 利息
      interestPeriod,
      preJudgmentInterest,
      damageTotalIncludingInterest,
      
      // 复数形式
      plaintiffPlurality1: plaintiffPlurality.form1,
      plaintiffPlurality2: plaintiffPlurality.form2,
      defendantPlurality1: defendantPlurality.form1Defendant,
      defendantPlurality2: defendantPlurality.form2Defendant,
      
      // 状态
      overtimeStatus,
      
      // 日期
      executedDate,
      sol3,
      sol4,
      
      // 其他
      causeNumber
    }
  })
  
  // 表单验证状态
  const formErrors = ref({})
  const isFormValid = computed(() => {
    return Object.keys(formErrors.value).length === 0
  })
  
  // 操作方法
  const setCurrentFormType = (type) => {
    currentFormType.value = type
  }
  
  const updateComplaintForm = (field, value) => {
    complaintForm.value[field] = value
  }
  
  const updateAnswerForm = (field, value) => {
    answerForm.value[field] = value
  }
  
  const updateSettlementForm = (field, value) => {
    settlementForm.value[field] = value
  }

  const updateDemurrerForm = (field, value) => {
    demurrerForm.value[field] = value
  }

  const updateMotionToStrikeForm = (field, value) => {
    motionToStrikeForm.value[field] = value
  }
  
  const updateSubmissionEmail = (email) => {
    submissionEmail.value = email
  }
  
  const resetForm = (type = null) => {
    const targetType = type || currentFormType.value
    
    if (targetType === 'complaint') {
      Object.keys(complaintForm.value).forEach(key => {
        if (key === 'caseNumber') {
          complaintForm.value[key] = ' '
        } else if (typeof complaintForm.value[key] === 'string') {
          complaintForm.value[key] = ''
        } else if (typeof complaintForm.value[key] === 'number') {
          complaintForm.value[key] = 0
        } else if (Array.isArray(complaintForm.value[key])) {
          complaintForm.value[key] = []
        } else {
          complaintForm.value[key] = null
        }
      })
    } else if (targetType === 'answer') {
      Object.keys(answerForm.value).forEach(key => {
        if (typeof answerForm.value[key] === 'string') {
          answerForm.value[key] = ''
        } else {
          answerForm.value[key] = null
        }
      })
    } else if (targetType === 'settlement') {
      Object.keys(settlementForm.value).forEach(key => {
        if (key === 'CaseNumber') {
          settlementForm.value[key] = ' '
        } else if (typeof settlementForm.value[key] === 'string') {
          settlementForm.value[key] = ''
        } else if (typeof settlementForm.value[key] === 'number') {
          settlementForm.value[key] = 0
        } else {
          settlementForm.value[key] = null
        }
      })
    } else if (targetType === 'demurrer') {
      Object.keys(demurrerForm.value).forEach(key => {
        if (key === 'TrialDate') {
          demurrerForm.value[key] = 'Not Set'
        } else if (key === 'PlaintiffPlurality1') {
          demurrerForm.value[key] = 'Plaintiff'
        } else if (key === 'DefendantPlurality1') {
          demurrerForm.value[key] = 'Defendant'
        } else if (typeof demurrerForm.value[key] === 'string') {
          demurrerForm.value[key] = ''
        } else if (Array.isArray(demurrerForm.value[key])) {
          demurrerForm.value[key] = []
        } else {
          demurrerForm.value[key] = null
        }
      })
    } else if (targetType === 'motionToStrike') {
      Object.keys(motionToStrikeForm.value).forEach(key => {
        if (key === 'TrialDate') {
          motionToStrikeForm.value[key] = 'Not Set'
        } else if (key === 'PlaintiffPlurality1') {
          motionToStrikeForm.value[key] = 'Plaintiff'
        } else if (key === 'DefendantPlurality1') {
          motionToStrikeForm.value[key] = 'Defendant'
        } else if (key === 'CourtLocation') {
          motionToStrikeForm.value[key] = 'LOS ANGELES'
        } else if (key === 'CourtName') {
          motionToStrikeForm.value[key] = 'STANLEY MOSK COURTHOUSE'
        } else if (key === 'CourtAddress') {
          motionToStrikeForm.value[key] = '111 North Hill Street, Room 307 Los Angeles, CA 90012'
        } else if (key === 'HearingTime') {
          motionToStrikeForm.value[key] = '8:30 AM'
        } else if (key === 'HearingDept') {
          motionToStrikeForm.value[key] = '26'
        } else if (key === 'ResID') {
          motionToStrikeForm.value[key] = '354359308862'
        } else if (typeof motionToStrikeForm.value[key] === 'string') {
          motionToStrikeForm.value[key] = ''
        } else if (Array.isArray(motionToStrikeForm.value[key])) {
          motionToStrikeForm.value[key] = []
        } else {
          motionToStrikeForm.value[key] = null
        }
      })
    }
  }
  
  const exportFormData = () => {
    const data = {
      currentFormType: currentFormType.value,
      submissionEmail: submissionEmail.value,
      timestamp: new Date().toISOString(),
      forms: {
        complaint: complaintForm.value,
        answer: answerForm.value,
        settlement: settlementForm.value,
        demurrer: demurrerForm.value,
        motionToStrike: motionToStrikeForm.value
      }
    }
    
    if (currentFormType.value === 'complaint') {
      data.calculations = complaintCalculations.value
    }
    
    return data
  }
  
  const importFormData = (data) => {
    if (data.currentFormType) {
      currentFormType.value = data.currentFormType
    }
    
    if (data.submissionEmail) {
      submissionEmail.value = data.submissionEmail
    }
    
    if (data.forms) {
      if (data.forms.complaint) {
        Object.assign(complaintForm.value, data.forms.complaint)
      }
      if (data.forms.answer) {
        Object.assign(answerForm.value, data.forms.answer)
      }
      if (data.forms.settlement) {
        Object.assign(settlementForm.value, data.forms.settlement)
      }
      if (data.forms.demurrer) {
        Object.assign(demurrerForm.value, data.forms.demurrer)
      }
      if (data.forms.motionToStrike) {
        Object.assign(motionToStrikeForm.value, data.forms.motionToStrike)
      }
    }
  }
  
  const setFormError = (field, error) => {
    if (error) {
      formErrors.value[field] = error
    } else {
      delete formErrors.value[field]
    }
  }
  
  const clearFormErrors = () => {
    formErrors.value = {}
  }

  // 重置当前表单
  const resetCurrentForm = () => {
    resetForm(currentFormType.value)
  }

  // 清空当前表单
  const clearCurrentForm = () => {
    resetCurrentForm()
  }

  // 获取当前表单数据
  const getCurrentFormData = () => {
    switch (currentFormType.value) {
      case 'complaint':
        return complaintForm.value
      case 'answer':
        return answerForm.value
      case 'settlement':
        return settlementForm.value
      case 'demurrer':
        return demurrerForm.value
      case 'motionToStrike':
        return motionToStrikeForm.value
      default:
        return {}
    }
  }

  // 保存表单数据到本地存储
  const saveFormData = () => {
    try {
      const data = exportFormData()
      localStorage.setItem('legal-forms-data', JSON.stringify(data))
      return true
    } catch (error) {
      console.error('保存数据失败:', error)
      throw new Error('保存数据失败')
    }
  }

  // 从本地存储加载表单数据
  const loadFormData = () => {
    try {
      const saved = localStorage.getItem('legal-forms-data')
      if (saved) {
        const data = JSON.parse(saved)
        importFormData(data)
        return true
      }
      return false
    } catch (error) {
      console.error('加载数据失败:', error)
      return false
    }
  }

  // 改进的导出功能，包含文件下载
  const exportFormDataWithDownload = () => {
    try {
      const data = exportFormData()
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `legal-forms-${currentFormType.value || 'all'}-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return data
    } catch (error) {
      console.error('导出数据失败:', error)
      throw new Error('导出数据失败')
    }
  }

  // 应用加载状态
  const isLoading = ref(false)

  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  return {
    // 状态
    currentFormType,
    submissionEmail,
    complaintForm,
    answerForm,
    settlementForm,
    demurrerForm,
    motionToStrikeForm,
    formErrors,
    isLoading,
    
    // 计算属性
    complaintCalculations,
    motionToStrikeCalculations,
    formattedComplaintDefendantName,
    formattedAnswerDefendantName,
    formattedSettlementDefendantName,
    formattedDemurrerDefendantName,
    formattedMotionToStrikeDefendantName,
    isFormValid,
    
    // 方法
    setCurrentFormType,
    updateComplaintForm,
    updateAnswerForm,
    updateSettlementForm,
    updateDemurrerForm,
    updateMotionToStrikeForm,
    updateSubmissionEmail,
    resetForm,
    resetCurrentForm,
    clearCurrentForm,
    getCurrentFormData,
    exportFormData,
    exportFormDataWithDownload,
    importFormData,
    saveFormData,
    loadFormData,
    setFormError,
    clearFormErrors,
    setLoading
  }
}) 