/**
 * 法律文书表单常量定义
 */

// 表单类型选项
export const FORM_TYPES = [
  {
    value: 'complaint',
    label: '起诉/损害赔偿表单 (Complaint/Damages)',
    description: '用于创建劳动法起诉和损害赔偿文书'
  },
  {
    value: 'answer',
    label: '回复表单 (M&C RE Answer)',
    description: '用于创建法庭回复文书'
  },
  {
    value: 'settlement',
    label: '和解协议表单 (Settlement Agreement - Payments)',
    description: '用于创建和解协议和付款安排文书'
  }
]

// 起诉原因选项（根据加州劳动法）
export const CAUSES_OF_ACTION = [
  {
    value: 'unpaid_wages',
    label: 'FAILURE TO PAY ALL WAGES',
    description: '[California Labor Code §§ 201-202, 218, 218.5, 1194, 1194.2]'
  },
  {
    value: 'meal_periods',
    label: 'FAILURE TO PROVIDE MEAL PERIODS',
    description: '[Labor Code §§ 226.7(a), 512]'
  },
  {
    value: 'rest_periods',
    label: 'FAILURE TO PROVIDE REST PERIODS',
    description: '[Labor Code §§ 226.7(a), 512]'
  },
  {
    value: 'overtime_wages',
    label: 'FAILURE TO PAY OVERTIME WAGES',
    description: '[Labor Code §§ 510, 1194]'
  },
  {
    value: 'wage_statements',
    label: 'FAILURE TO PROVIDE ACCURATE WAGE STATEMENTS',
    description: '[Labor Code § 226]'
  },
  {
    value: 'waiting_time',
    label: 'WAITING TIME PENALTIES',
    description: '[Labor Code §§ 201-203]'
  },
  {
    value: 'business_expenses',
    label: 'FAILURE TO REIMBURSE BUSINESS EXPENSES',
    description: '[Labor Code § 2802]'
  },
  {
    value: 'unfair_business',
    label: 'UNFAIR BUSINESS PRACTICES',
    description: '[Business and Professions Code § 17200 et seq.]'
  }
]

// 薪资周期选项
export const PAY_PERIOD_OPTIONS = [
  { value: 'daily', label: '日薪 (Daily)' },
  { value: 'weekly', label: '周薪 (Weekly)' },
  { value: 'bi-weekly', label: '双周薪 (Bi-Weekly)' },
  { value: 'monthly', label: '月薪 (Monthly)' },
  { value: 'bi-monthly', label: '双月薪 (Bi-Monthly)' },
  { value: 'quarterly', label: '季薪 (Quarterly)' }
]

// 联系方式选项
export const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: '邮件 (Email)' },
  { value: 'facsimile', label: '传真 (Facsimile)' }
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

// 表单验证规则
export const VALIDATION_RULES = {
  required: { required: true, message: '此字段为必填项', trigger: 'blur' },
  email: { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  number: { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
  date: { type: 'date', message: '请选择有效的日期', trigger: 'change' },
  phone: { 
    pattern: /^\d{3}-\d{3}-\d{4}$/, 
    message: '请输入有效的电话号码格式 (XXX-XXX-XXXX)', 
    trigger: 'blur' 
  }
}

// 字段提示信息
export const FIELD_TOOLTIPS = {
  plaintiffName: '原告姓名，多个原告请用逗号分隔，每个姓名后会自动添加 ", an individual,"',
  defendantName: '被告姓名，如果是公司请选择注册州，例如 "a California corporation."',
  courtLocation: '法院所在县名，请使用全大写字母，例如 "LOS ANGELES"',
  caseNumber: '案件编号，如果暂无请留空',
  doe: '根据雇佣期间和诉讼时效自动计算的雇佣周数',
  hourlyRate: '员工的时薪，用于计算各项损害赔偿',
  weeklyHours: '员工每周实际工作小时数',
  overtimeHours: '每周超过40小时以上的加班时间',
  damageCalculated: '此金额根据输入的数据自动计算，不可手动修改'
} 