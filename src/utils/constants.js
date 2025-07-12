/**
 * Legal Document Form Constants Definition
 */

// Form Type Options
export const FORM_TYPES = [
  {
    value: 'complaint',
    label: 'Complaint/Damages Form',
    description: 'Create labor law complaint and damage calculation documents'
  },
  {
    value: 'answer',
    label: 'M&C RE Answer Form',
    description: 'Create court reply documents'
  },
  {
    value: 'settlement',
    label: 'Settlement Agreement (Payments) Form',
    description: 'Create settlement agreement and payment arrangement documents'
  },
  {
    value: 'demurrer',
    label: 'Demurrer Motion Form',
    description: 'Create demurrer motion against affirmative defenses'
  },
  {
    value: 'motionToStrike',
    label: 'Motion to Strike Form',
    description: 'Create motion to strike document'
  },
  {
    value: 'requestForProduction',
    label: 'Request for Production Form',
    description: 'Create request for production of documents'
  },
  {
    value: 'pmpDepo',
    label: 'PMP Depo Form',
    description: 'Create PMP deposition related documents'
  },
  {
    value: 'ntcOfDepo',
    label: 'NTC of Depo Form',
    description: 'Create notice of deposition documents'
  }
]

// 起诉原因选项（根据加州劳动法）- 专为 Complaint/Damages Form 使用
export const CAUSES_OF_ACTION = [
  {
    value: 'cause_01',
    label: 'FAILURE TO PAY ALL WAGES [California Labor Code §§ 201-202, 218, 218.5, 1194, 1194.2]'
  },
  {
    value: 'cause_03',
    label: 'FAILURE TO PROVIDE MEAL PERIODS [Labor Code §§ 226.7(a), 512]'
  },
  {
    value: 'cause_04',
    label: 'FAILURE TO PROVIDE REST PERIODS [Labor Code §§ 226.7(a), 512]'
  },
  {
    value: 'cause_05',
    label: 'FAILURE TO PAY OVERTIME WAGES [Labor Code §§ 510 and 1194 et seq.]'
  },
  {
    value: 'cause_06',
    label: 'FAILURE TO PAY WAGES DUE UPON TERMINATION: WAITING TIME PENALTIES [Labor Code §§ 201, 202 and 203]'
  },
  {
    value: 'cause_07',
    label: 'FAILURE TO ISSUE ACCURATE ITEMIZED WAGE STATEMENTS [Labor Code § 226 et seq.]'
  },
  {
    value: 'cause_08',
    label: 'UNLAWFUL/UNFAIR BUSINESS PRACTICES [Business and Professions Code § 17200 et seq.]'
  },
  {
    value: 'cause_09',
    label: 'FAILURE TO REMIBURSE WORK RELATED EXPENSES [Labor Code § 2802]'
  },
  {
    value: 'cause_10',
    label: 'RETALIATION FOR FILING A WORKERS\' COMPENSATION CLAIM [Labor Code § 132(a)]'
  },
  {
    value: 'cause_11',
    label: 'DISCRIMINATION BASED ON DISABILITY OR RELATED MEDICAL CONDITION [Government Code § 12940 et seq.]'
  },
  {
    value: 'cause_12',
    label: 'FAILURE TO PROVIDE REASONABLE ACCOMMODATION FOR DISABILITY / MEDICAL CONDITION [Govt. Code § 12940 et seq.]'
  },
  {
    value: 'cause_13',
    label: 'FAILURE TO ENTER INTO AN INTERACTIVE PROCESS [Govt. Code § 12940 et seq.]'
  },
  {
    value: 'cause_14',
    label: 'RETALIATION: UNLAWFUL DISCHARGE FOR TAKING MEDICAL LEAVE AND REQUEST FOR ACCOMMODATION [Govt. Code § 12940 et seq.]'
  },
  {
    value: 'cause_15',
    label: 'DISCRIMINATION BASED UPON SEX AND/OR RACE/ETHNICITY – DISPARATE IMPACT [CAL. GOV. CODE §§ 12940, ET SEQ.]'
  },
  {
    value: 'cause_16',
    label: 'FAILURE TO PREVENT DISCRIMINATION AND HARASSMENT [Government Code § 12940 et seq.]'
  },
  {
    value: 'cause_17',
    label: 'WHISTLEBLOWER RETALIATION [Cal. Lab. Code § 1102.5]'
  },
  {
    value: 'cause_18',
    label: 'WRONGFUL TERMINATION IN VIOLATION OF PUBLIC POLICY'
  },
  {
    value: 'cause_19',
    label: 'SEXUAL HARASSMENT (HOSTILE WORK ENVIRONMENT) [Government Code § 12940 et seq.]'
  },
  {
    value: 'cause_20',
    label: 'RETALIATION IN VIOLATION OF FEHA [Cal. Gov. Code §§ 12940, et seq.]'
  },
  {
    value: 'cause_21',
    label: 'INTENTIONAL INFLICTION OF EMOTIONAL DISTRESS'
  },
  {
    value: 'cause_22',
    label: 'NEGLIGENT INFLICTION OF EMOTIONAL DISTRESS'
  }
]

// 初始化案由对象 - 所有案由默认为 { selected: false, order: "" }
export const getInitialCausesObject = () => {
  const causesObject = {}
  CAUSES_OF_ACTION.forEach(cause => {
    causesObject[cause.value] = {
      selected: false,
      order: ""
    }
  })
  return causesObject
}

// 英文序号数组
export const ORDINAL_NUMBERS = [
  'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH', 
  'NINTH', 'TENTH', 'ELEVENTH', 'TWELFTH', 'THIRTEENTH', 'FOURTEENTH', 'FIFTEENTH', 
  'SIXTEENTH', 'SEVENTEENTH', 'EIGHTEENTH', 'NINETEENTH', 'TWENTIETH', 'TWENTY-FIRST', 'TWENTY-SECOND'
]

// 更新案由序号
export const updateCausesOrder = (causesObject) => {
  // 获取所有选中的案由，按照 CAUSES_OF_ACTION 的顺序
  const selectedCauses = CAUSES_OF_ACTION
    .map(cause => cause.value)
    .filter(causeKey => causesObject[causeKey]?.selected === true)
  
  // 重置所有序号
  Object.keys(causesObject).forEach(key => {
    if (causesObject[key]) {
      causesObject[key].order = ""
    }
  })
  
  // 为选中的案由分配序号
  selectedCauses.forEach((causeKey, index) => {
    if (causesObject[causeKey] && index < ORDINAL_NUMBERS.length) {
      causesObject[causeKey].order = ORDINAL_NUMBERS[index]
    }
  })
  
  return causesObject
}

// 生成选中案由的 label 数组
export const generateSelectedCausesLabels = (causesObject) => {
  // 获取所有选中的案由，按照 CAUSES_OF_ACTION 的顺序
  const selectedCausesLabels = CAUSES_OF_ACTION
    .filter(cause => causesObject[cause.value]?.selected === true)
    .map(cause => cause.label)
  
  return selectedCausesLabels
}

// Pay Period Options
export const PAY_PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-monthly', label: 'Bi-Monthly' },
  { value: 'quarterly', label: 'Quarterly' }
]

// Contact Method Options
export const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'facsimile', label: 'Facsimile' }
]

// Entity Type Options for Defendant
export const ENTITY_TYPE_OPTIONS = [
  { value: 'corporation', label: 'Corporation' },
  { value: 'llc', label: 'LLC' },
  { value: 'partnership', label: 'Partnership' }
]

// 美国州列表（用于公司类型）
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]

// Form Validation Rules
export const VALIDATION_RULES = {
  required: { required: true, message: 'This field is required', trigger: 'blur' },
  email: { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' },
  number: { type: 'number', message: 'Please enter a valid number', trigger: 'blur' },
  date: { type: 'date', message: 'Please select a valid date', trigger: 'change' },
  phone: { 
    pattern: /^\d{3}-\d{3}-\d{4}$/, 
    message: 'Please enter a valid phone number format (XXX-XXX-XXXX)', 
    trigger: 'blur' 
  }
}

// Field Tooltip Information
export const FIELD_TOOLTIPS = {
  PlaintiffName: 'Plaintiff name, multiple plaintiffs separated by commas, each name will automatically add ", an individual,"',
  DefendantName: 'Defendant name, if corporation, please select the state of incorporation, e.g. "a California corporation."',
  CourtLocation: 'County name where the court is located, please use all capital letters, e.g. "LOS ANGELES"',
  CaseNumber: 'Case number, leave empty if not available yet',
  doe: 'Number of weeks employed automatically calculated based on employment period and statute of limitations',
  HourlyRate: 'Employee hourly rate, used to calculate various damage compensations',
  WeeklyHours: 'Actual hours worked by employee per week',
  overtimeHours: 'Overtime hours exceeding 40 hours per week',
  damageCalculated: 'This amount is automatically calculated based on input data and cannot be manually modified'
}

// 案件类型选项（用于 Demurrer 表单）
export const CASE_TYPE_OPTIONS = [
  { label: 'Wage and Hour', value: 'wage and hour' },
  { label: 'Discrimination', value: 'discrimination' },
  { label: 'Harassment', value: 'harassment' },
  { label: 'Retaliation', value: 'retaliation' },
  { label: 'Wrongful Termination', value: 'wrongful termination' }
]

// Demurrer 起诉原因选项（从 CAUSES_OF_ACTION 中提取，去掉括号内容，格式化为编号列表）
export const DEMURRER_CAUSES_OPTIONS = CAUSES_OF_ACTION.map((cause, index) => {
  const cleanLabel = cause.label.split('(')[0].trim()
  return {
    label: `${index + 1})${cleanLabel}`,
    value: `${index + 1})${cleanLabel}`
  }
})

// NTC of Depo 表单测试数据
export const NTC_OF_DEPO_TEST_DATA = {
  PlaintiffNames: ['JUSTINO VALERIANO JIMENEZ', 'MARIA ELENA RODRIGUEZ'],
  DefendantNames: ['CASA LEADERS HP, INC', 'LEADERSHIP CONSTRUCTION LLC'],
  CourtName: 'STANLEY MOSK COURTHOUSE',
  CaseNumber: '20STCV09196',
  JudgeName: 'Hon. Rafael A. Ongkeko, Dept. \'73\'',
  HearingDate: '2024-03-15',
  HearingTime: '10:30 AM',
  ComplaintFilingDate: '2023-12-01',
  TrialDate: 'Not Set',
  LetterDate: '2024-01-15',
  ExecutedDate: '2024-02-01',
  RequestNumber: 1,
  ServerName: 'Professional Process Service, Inc.'
}

// PMP Depo 表单测试数据
export const PMP_DEPO_TEST_DATA = {
  PlaintiffName: 'JUSTINO VALERIANO JIMENEZ',
  CaseNumber: '20STCV09196',
  DefendantName: 'CASA LEADERS HP, INC',
  OCName: 'Abraham Sandoval',
  OCFirm: 'SANDOVAL LAW, APC',
  OCAddress: '3435 Wilshire Boulevard, Suite 1620, Los Angeles, California 90010',
  MnCDate: 'September 17, 2020, September 22, 2020, September 24, 2020',
  LetterDate: '2024-01-15'
}

// Request for Production 表单测试数据
export const REQUEST_FOR_PRODUCTION_TEST_DATA = {
  PlaintiffNames: ['JUSTINO VALERIANO JIMENEZ', 'MARIA ELENA RODRIGUEZ'],
  CaseNumber: '20STCV09196',
  DefendantNames: ['CASA LEADERS HP, INC', 'LEADERSHIP CONSTRUCTION LLC'],
  JudgeName: 'Hon. Rafael A. Ongkeko, Dept. \'73\'',
  ComplaintFilingDate: '2023-12-01',
  LetterDate: '2024-01-15',
  TrialDate: 'March 20, 2025',
  ExecutedDate: '2024-02-01',
  OCName: 'Abraham Sandoval',
  OCFirm: 'SANDOVAL LAW, APC'
}

// Complaint/Damages 表单测试数据
export const COMPLAINT_TEST_DATA = {
  PlaintiffName: 'James Doe, an individual',
  PlaintiffJob: 'Chef',
  DefendantName: 'ABC Restaurant Corp',
  DefendantState: 'CA',
  DefendantEntityType: 'corporation',
  CourtLocation: 'LOS ANGELES',
  CourtName: 'STANLEY MOSK COURTHOUSE',
  CaseNumber: 'LASC123456',
  JudgeName: 'Michael Doe',
  ComplaintFilingDate: '2024-06-23',
  SelectedCauses: {
    cause_01: { selected: true, order: "FIRST" },   // FAILURE TO PAY ALL WAGES
    cause_03: { selected: true, order: "SECOND" },  // FAILURE TO PROVIDE MEAL PERIODS  
    cause_04: { selected: true, order: "THIRD" },   // FAILURE TO PROVIDE REST PERIODS
    cause_05: { selected: true, order: "FOURTH" },  // FAILURE TO PAY OVERTIME WAGES
    cause_06: { selected: true, order: "FIFTH" },   // FAILURE TO PAY WAGES DUE UPON TERMINATION: WAITING TIME PENALTIES
    cause_07: { selected: false, order: "" },
    cause_08: { selected: false, order: "" },
    cause_09: { selected: false, order: "" },
    cause_10: { selected: false, order: "" },
    cause_11: { selected: false, order: "" },
    cause_12: { selected: false, order: "" },
    cause_13: { selected: false, order: "" },
    cause_14: { selected: false, order: "" },
    cause_15: { selected: false, order: "" },
    cause_16: { selected: false, order: "" },
    cause_17: { selected: false, order: "" },
    cause_18: { selected: false, order: "" },
    cause_19: { selected: false, order: "" },
    cause_20: { selected: false, order: "" },
    cause_21: { selected: false, order: "" },
    cause_22: { selected: false, order: "" }
  },
  SelectedCausesLabels: [
    'FAILURE TO PAY ALL WAGES [California Labor Code §§ 201-202, 218, 218.5, 1194, 1194.2]',
    'FAILURE TO PROVIDE MEAL PERIODS [Labor Code §§ 226.7(a), 512]',
    'FAILURE TO PROVIDE REST PERIODS [Labor Code §§ 226.7(a), 512]',
    'FAILURE TO PAY OVERTIME WAGES [Labor Code §§ 510 and 1194 et seq.]',
    'FAILURE TO PAY WAGES DUE UPON TERMINATION: WAITING TIME PENALTIES [Labor Code §§ 201, 202 and 203]'
  ],
  PlaintiffResidence: 'Los Angeles, California',
  DefendantBusinessType: 'restaurant',
  DefendantBusinessAddress: '123 Broadway, Los Angeles, CA 90016',
  EmploymentStartDate: '2022-05-01',
  EmploymentEndDate: '2024-06-23',
  HourlyRate: 25,
  UnpaidHours: 300,
  WeeklyHours: 80,
  DoubleOvertimeHours: 5,
  IwcOrder: 5,
  PayPeriods: 20,
  PayPeriodInterval: 'weekly',
  MissedMealBreaks: 5,
  MissedRestBreaks: 5,
  BusinessExpenseType: 'Gas',
  BusinessExpenseAmount: 1000
}

// API 配置
export const API_CONFIG = {
  // 环境配置
  ENVIRONMENT: import.meta.env.MODE || 'development', // development | production
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Law Firm Forms',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  
  // API 端点配置 - 从环境变量读取
  WEBHOOK_URL: import.meta.env.VITE_API_WEBHOOK_URL,
  
  // 备用配置（兼容原有代码）
  ENDPOINTS: {
    // 测试环境webhook地址
    WEBHOOK_TEST: 'https://n8n-jacklaw-u42541.vm.elestio.app/webhook-test/b881c94b-a224-4df4-af9c-c2d5cbe337cd',
    
    // 生产环境webhook地址  
    WEBHOOK_PROD: 'https://n8n-jacklaw-u42541.vm.elestio.app/webhook/b881c94b-a224-4df4-af9c-c2d5cbe337cd'
  },
  
  // 获取当前环境的webhook地址
  getWebhookUrl() {
    // 优先使用环境变量中的配置
    if (this.WEBHOOK_URL) {
      return this.WEBHOOK_URL
    }
    
    // 兼容原有逻辑
    return this.ENVIRONMENT === 'production' 
      ? this.ENDPOINTS.WEBHOOK_PROD 
      : this.ENDPOINTS.WEBHOOK_TEST
  },
  
  // 调试日志输出
  log(...args) {
    if (this.DEBUG) {
      console.log('[API_CONFIG]', ...args)
    }
  }
} 