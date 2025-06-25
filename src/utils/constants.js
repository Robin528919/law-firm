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
  plaintiffName: 'Plaintiff name, multiple plaintiffs separated by commas, each name will automatically add ", an individual,"',
  defendantName: 'Defendant name, if corporation, please select the state of incorporation, e.g. "a California corporation."',
  courtLocation: 'County name where the court is located, please use all capital letters, e.g. "LOS ANGELES"',
  caseNumber: 'Case number, leave empty if not available yet',
  doe: 'Number of weeks employed automatically calculated based on employment period and statute of limitations',
  hourlyRate: 'Employee hourly rate, used to calculate various damage compensations',
  weeklyHours: 'Actual hours worked by employee per week',
  overtimeHours: 'Overtime hours exceeding 40 hours per week',
  damageCalculated: 'This amount is automatically calculated based on input data and cannot be manually modified'
} 