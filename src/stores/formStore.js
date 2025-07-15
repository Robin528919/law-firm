import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import * as calculations from '@/utils/calculations'
import {formatDefendantName, formatLegalDate} from '@/utils/calculations'
import {getInitialCausesObject} from '@/utils/constants'

export const useFormStore = defineStore('form', () => {
  // 当前选中的表单类型
  const currentFormType = ref('complaint')

  // 通用提交邮箱地址
  const submissionEmail = ref('')

  // 起诉/损害赔偿表单数据
  const complaintForm = ref({
    // 基础信息
    PlaintiffName: '',
    PlaintiffJob: '',
    DefendantName: '',
    DefendantState: '',
    DefendantEntityType: '',
    CourtLocation: '',
    CourtName: '',
    CaseNumber: ' ', // 默认空格
    JudgeName: '',
    ComplaintFilingDate: null,

    // 选择字段
    SelectedCauses: getInitialCausesObject(),
    SelectedCausesLabels: [], // 存储选中案由的 label 数组
    PayPeriodInterval: '',

    // 地址信息
    PlaintiffResidence: '',
    DefendantBusinessType: '',
    DefendantBusinessAddress: '',

    // 雇佣信息
    EmploymentStartDate: null,
    EmploymentEndDate: null,
    HourlyRate: 0,
    UnpaidHours: 0,
    WeeklyHours: 0,
    DoubleOvertimeHours: 0,

    // 其他字段
    IwcOrder: 0,
    PayPeriods: 0,
    MissedMealBreaks: 0,
    MissedRestBreaks: 0,
    BusinessExpenseType: '',
    BusinessExpenseAmount: 0
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
    PlaintiffPlurality1: '',
    DefendantPlurality1: '',
    CourtLocation: '',
    CourtName: '',
    CourtAddress: '',
    HearingDate: null,
    HearingTime: '',
    HearingDept: '',
    ResID: '',
    ComplaintFilingDate: null,
    TrialDate: '',
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

  // Request for Production 表单数据
  const requestForProductionForm = ref({
    PlaintiffNames: [''],
    CaseNumber: '',
    DefendantNames: [''],
    JudgeName: '',
    ComplaintFilingDate: null,
    LetterDate: null,
    TrialDate: '',
    ExecutedDate: null,
    OCName: '',
    OCFirm: ''
  })

  // PMP Depo 表单数据
  const pmpDepoForm = ref({
    PlaintiffName: '',
    CaseNumber: '',
    DefendantName: '',
    OCName: '',
    OCFirm: '',
    OCAddress: '',
    MnCDate: '',
    LetterDate: null
  })

  // NTC of Depo 表单数据
  const ntcOfDepoForm = ref({
    PlaintiffNames: [''],
    DefendantNames: [''],
    PlaintiffPlurality1: '',
    DefendantPlurality1: '',
    CourtName: '',
    CaseNumber: '',
    JudgeName: '',
    HearingTime: '',
    HearingDate: null,
    ComplaintFilingDate: null,
    TrialDate: '',
    RequestNumber: 1,
    LetterDate: null,
    ExecutedDate: null,
    ServerName: ''
  })

  // RFP Sexual Harassment 表单数据
  const rfpSexualHarassmentForm = ref({
    PlaintiffName: '',
    DefendantName: '',
    CaseNumber: '',
    DefendantBusinessAddress: '',
    CourtName: '',
    CourtLocation: '',
    EmploymentStartDate: '', // 改为字符串
    EmploymentEndDate: ''    // 改为字符串
  })

  // NTC of Ruling 表单数据
  const ntcOfRulingForm = ref({
    PlaintiffName: '',
    DefendantName: '',
    CaseNumber: '',
    JudgeName: '',
    HearingDept: '',
    HearingDate: null,
    HearingTime: '',
    HearingDate2: null,
    HearingTime2: '',
    HearingDept2: '',
    ComplaintFilingDate: null,
    TrialDate: '',
    CourtLocation: '',
    CourtName: '',
    CourtAddress: '',
    LetterDate: null,
    ServiceInfo: '',
    ExecutedDate: null,
    ServerName: ''
  })

  // 格式化的被告名称（起诉表单）
  const formattedComplaintDefendantName = computed(() => {
    const form = complaintForm.value
    return formatDefendantName(form.DefendantName, form.DefendantState, form.DefendantEntityType)
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

  // 格式化的被告名称（Request for Production表单）
  const formattedRequestForProductionDefendantName = computed(() => {
    const form = requestForProductionForm.value
    // Request for Production表单数组格式的名称
      return form.DefendantNames?.filter(name => name.trim()).join(', ') || ''
  })

  // 格式化的被告名称（PMP Depo表单）
  const formattedPmpDepoDefendantName = computed(() => {
    const form = pmpDepoForm.value
    // PMP Depo表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // 格式化的被告名称（NTC of Depo表单）
  const formattedNtcOfDepoDefendantName = computed(() => {
    const form = ntcOfDepoForm.value
    // NTC of Depo表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // 格式化的被告名称（RFP Sexual Harassment表单）
  const formattedRfpSexualHarassmentDefendantName = computed(() => {
    const form = rfpSexualHarassmentForm.value
    // RFP Sexual Harassment表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // 格式化的被告名称（NTC of Ruling表单）
  const formattedNtcOfRulingDefendantName = computed(() => {
    const form = ntcOfRulingForm.value
    // NTC of Ruling表单只有被告名称，没有州和实体类型信息
    return form.DefendantName || ''
  })

  // Motion to Strike 表单的计算字段
  const motionToStrikeCalculations = computed(() => {
    const form = motionToStrikeForm.value

    // 复数形式计算 - 只有当有姓名输入时才计算
    const plaintiffPlurality = form.PlaintiffName ? calculations.getPlurality(form.PlaintiffName) : { form1: '' }
    const defendantPlurality = form.DefendantName ? calculations.getPlurality(form.DefendantName) : { form1Defendant: '' }

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

  // NTC of Depo 表单的计算字段
  const ntcOfDepoCalculations = computed(() => {
    const form = ntcOfDepoForm.value

    // 将数组格式的名称转换为字符串用于复数计算
    const plaintiffNamesString = form.PlaintiffNames?.filter(name => name.trim()).join(', ') || ''
    const defendantNamesString = form.DefendantNames?.filter(name => name.trim()).join(', ') || ''

    // 复数形式计算 - 只有当有姓名输入时才计算
    const plaintiffPlurality = plaintiffNamesString ? calculations.getPlurality(plaintiffNamesString) : { form1: '' }
    const defendantPlurality = defendantNamesString ? calculations.getPlurality(defendantNamesString) : { form1Defendant: '' }

    return {
      // 复数形式
      plaintiffPlurality1: plaintiffPlurality.form1,
      defendantPlurality1: defendantPlurality.form1Defendant
    }
  })

  // Request for Production 表单的计算字段
  const requestForProductionCalculations = computed(() => {
    const form = requestForProductionForm.value

    // 将数组格式的名称转换为字符串用于复数计算
    const plaintiffNamesString = form.PlaintiffNames?.filter(name => name.trim()).join(', ') || ''
    const defendantNamesString = form.DefendantNames?.filter(name => name.trim()).join(', ') || ''

    // 复数形式计算 - 只有当有姓名输入时才计算
    const plaintiffPlurality = plaintiffNamesString ? calculations.getPlurality(plaintiffNamesString) : { form1: '' }
    const defendantPlurality = defendantNamesString ? calculations.getPlurality(defendantNamesString) : { form1Defendant: '' }

    return {
      // 复数形式
      plaintiffPlurality1: plaintiffPlurality.form1,
      defendantPlurality1: defendantPlurality.form1Defendant
    }
  })

  // RFP Sexual Harassment 表单的计算字段
  const rfpSexualHarassmentCalculations = computed(() => {
    const form = rfpSexualHarassmentForm.value

    // 复数形式计算 - 只有当有姓名输入时才计算
    const plaintiffPlurality = form.PlaintiffName ? calculations.getPlurality(form.PlaintiffName) : { form1: '' }
    const defendantPlurality = form.DefendantName ? calculations.getPlurality(form.DefendantName) : { form1Defendant: '' }

    return {
      // 复数形式
      plaintiffPlurality1: plaintiffPlurality.form1,
      defendantPlurality1: defendantPlurality.form1Defendant
    }
  })

  // NTC of Ruling 表单的计算字段
  const ntcOfRulingCalculations = computed(() => {
    const form = ntcOfRulingForm.value

    // 复数形式计算 - 只有当有姓名输入时才计算
    const plaintiffPlurality = form.PlaintiffName ? calculations.getPlurality(form.PlaintiffName) : { form1: '' }
    const defendantPlurality = form.DefendantName ? calculations.getPlurality(form.DefendantName) : { form1Defendant: '' }

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
      form.ComplaintFilingDate,
      form.EmploymentStartDate,
      form.EmploymentEndDate
    )

    const oneAndHalfOvertimeHours = calculations.calculate1_5OvertimeHours(
      form.WeeklyHours,
      form.DoubleOvertimeHours
    )

    const overtimeHoursTotal = calculations.calculateOvertimeHoursTotal(
      oneAndHalfOvertimeHours,
      form.DoubleOvertimeHours
    )

    // 损害赔偿计算
    const damageUnpaidWages = calculations.calculateDamageUnpaidWages(
      form.UnpaidHours,
      form.HourlyRate
    )

    const damageMealBreaks = calculations.calculateDamageMealBreaks(
      form.MissedMealBreaks,
      doe,
      form.HourlyRate
    )

    const damageRestBreaks = calculations.calculateDamageRestBreaks(
      form.MissedRestBreaks,
      doe,
      form.HourlyRate
    )

    const damageOvertime = calculations.calculateDamageOvertime(
      oneAndHalfOvertimeHours,
      form.DoubleOvertimeHours,
      form.HourlyRate,
      doe
    )

    const damageWaitingTime = calculations.calculateDamageWaitingTime(form.HourlyRate)

    const wageStatementPenalty = calculations.calculateWageStatementPenalty(form.PayPeriods)

    const damages = {
      damageUnpaidWages,
      damageMealBreaks,
      damageRestBreaks,
      damageOvertime,
      damageWaitingTime,
      businessExpenseAmount: form.BusinessExpenseAmount,
      wageStatementPenalty
    }

    const damageTotal = calculations.calculateDamageTotal(damages)

    // 利息计算
    const interestPeriod = calculations.calculateInterestPeriod(
      form.ComplaintFilingDate,
      form.EmploymentEndDate
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
    const plaintiffPlurality = calculations.getPlurality(form.PlaintiffName)
    const defendantPlurality = calculations.getPlurality(formattedComplaintDefendantName.value)

    // 状态判断
    const overtimeStatus = calculations.calculateOvertimeStatus(form.WeeklyHours)

    // 日期字段
    const executedDate = formatLegalDate(new Date())
    const sol3 = calculations.calculate3SOL(form.ComplaintFilingDate)
    const sol4 = calculations.calculate4SOL(form.ComplaintFilingDate)

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

  const updateRequestForProductionForm = (field, value) => {
    requestForProductionForm.value[field] = value
  }

  const updatePmpDepoForm = (field, value) => {
    pmpDepoForm.value[field] = value
  }

  const updateNtcOfDepoForm = (field, value) => {
    ntcOfDepoForm.value[field] = value
  }

  const updateRfpSexualHarassmentForm = (field, value) => {
    rfpSexualHarassmentForm.value[field] = value
  }

  const updateNtcOfRulingForm = (field, value) => {
    ntcOfRulingForm.value[field] = value
  }

  const updateSubmissionEmail = (email) => {
    submissionEmail.value = email
  }

  const resetForm = (type = null) => {
    const targetType = type || currentFormType.value

    if (targetType === 'complaint') {
      Object.keys(complaintForm.value).forEach(key => {
        if (key === 'CaseNumber') {
          complaintForm.value[key] = ' '
        } else if (key === 'SelectedCauses') {
          complaintForm.value[key] = getInitialCausesObject()
        } else if (key === 'SelectedCausesLabels') {
          complaintForm.value[key] = []
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
        if (typeof motionToStrikeForm.value[key] === 'string') {
          motionToStrikeForm.value[key] = ''
        } else if (Array.isArray(motionToStrikeForm.value[key])) {
          motionToStrikeForm.value[key] = []
        } else {
          motionToStrikeForm.value[key] = null
        }
      })
    } else if (targetType === 'requestForProduction') {
      Object.keys(requestForProductionForm.value).forEach(key => {
        if (key === 'PlaintiffNames' || key === 'DefendantNames') {
          requestForProductionForm.value[key] = ['']
        } else if (typeof requestForProductionForm.value[key] === 'string') {
          requestForProductionForm.value[key] = ''
        } else if (Array.isArray(requestForProductionForm.value[key])) {
          requestForProductionForm.value[key] = []
        } else {
          requestForProductionForm.value[key] = null
        }
      })
    } else if (targetType === 'pmpDepo') {
      Object.keys(pmpDepoForm.value).forEach(key => {
        if (typeof pmpDepoForm.value[key] === 'string') {
          pmpDepoForm.value[key] = ''
        } else if (Array.isArray(pmpDepoForm.value[key])) {
          pmpDepoForm.value[key] = []
        } else {
          pmpDepoForm.value[key] = null
        }
      })
    } else if (targetType === 'ntcOfDepo') {
      Object.keys(ntcOfDepoForm.value).forEach(key => {
        if (key === 'RequestNumber') {
          ntcOfDepoForm.value[key] = 1
        } else if (key === 'PlaintiffNames' || key === 'DefendantNames') {
          ntcOfDepoForm.value[key] = ['']
        } else if (typeof ntcOfDepoForm.value[key] === 'string') {
          ntcOfDepoForm.value[key] = ''
        } else if (Array.isArray(ntcOfDepoForm.value[key])) {
          ntcOfDepoForm.value[key] = []
        } else {
          ntcOfDepoForm.value[key] = null
        }
      })
    } else if (targetType === 'rfpSexualHarassment') {
      Object.keys(rfpSexualHarassmentForm.value).forEach(key => {
        if (typeof rfpSexualHarassmentForm.value[key] === 'string') {
          rfpSexualHarassmentForm.value[key] = ''
        } else if (typeof rfpSexualHarassmentForm.value[key] === 'number') {
          rfpSexualHarassmentForm.value[key] = 0
        } else if (Array.isArray(rfpSexualHarassmentForm.value[key])) {
          rfpSexualHarassmentForm.value[key] = []
        } else {
          rfpSexualHarassmentForm.value[key] = null
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
        motionToStrike: motionToStrikeForm.value,
        requestForProduction: requestForProductionForm.value,
        pmpDepo: pmpDepoForm.value,
        ntcOfDepo: ntcOfDepoForm.value,
        rfpSexualHarassment: rfpSexualHarassmentForm.value,
        ntcOfRuling: ntcOfRulingForm.value
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
      if (data.forms.requestForProduction) {
        Object.assign(requestForProductionForm.value, data.forms.requestForProduction)
      }
      if (data.forms.pmpDepo) {
        Object.assign(pmpDepoForm.value, data.forms.pmpDepo)
      }
      if (data.forms.ntcOfDepo) {
        Object.assign(ntcOfDepoForm.value, data.forms.ntcOfDepo)
      }
      if (data.forms.rfpSexualHarassment) {
        Object.assign(rfpSexualHarassmentForm.value, data.forms.rfpSexualHarassment)
      }
      if (data.forms.ntcOfRuling) {
        Object.assign(ntcOfRulingForm.value, data.forms.ntcOfRuling)
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
      case 'requestForProduction':
        return requestForProductionForm.value
      case 'pmpDepo':
        return pmpDepoForm.value
      case 'ntcOfDepo':
        return ntcOfDepoForm.value
      case 'rfpSexualHarassment':
        return rfpSexualHarassmentForm.value
      case 'ntcOfRuling':
        return ntcOfRulingForm.value
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
    requestForProductionForm,
    pmpDepoForm,
    ntcOfDepoForm,
    rfpSexualHarassmentForm,
    ntcOfRulingForm,
    formErrors,
    isLoading,

    // 计算属性
    complaintCalculations,
    motionToStrikeCalculations,
    ntcOfDepoCalculations,
    requestForProductionCalculations,
    rfpSexualHarassmentCalculations,
    ntcOfRulingCalculations,
    formattedComplaintDefendantName,
    formattedAnswerDefendantName,
    formattedSettlementDefendantName,
    formattedDemurrerDefendantName,
    formattedMotionToStrikeDefendantName,
    formattedRequestForProductionDefendantName,
    formattedPmpDepoDefendantName,
    formattedNtcOfDepoDefendantName,
    formattedRfpSexualHarassmentDefendantName,
    formattedNtcOfRulingDefendantName,
    isFormValid,

    // 方法
    setCurrentFormType,
    updateComplaintForm,
    updateAnswerForm,
    updateSettlementForm,
    updateDemurrerForm,
    updateMotionToStrikeForm,
    updateRequestForProductionForm,
    updatePmpDepoForm,
    updateNtcOfDepoForm,
    updateRfpSexualHarassmentForm,
    updateNtcOfRulingForm,
    updateSubmissionEmail,
    resetForm,
    resetCurrentForm,
    clearCurrentForm,
    getCurrentFormData,
    exportFormData,
    exportFormDataWithDownload,
    importFormData,
    saveFormData,
    setFormError,
    clearFormErrors,
    setLoading
  }
})
