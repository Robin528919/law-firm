import dayjs from 'dayjs'

/**
 * 法律文书表单计算工具函数
 */

/**
 * 将日期格式化为法律文书所需格式 "June 15, 2025"
 * @param {Date|string} date - 输入日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatLegalDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('MMMM D, YYYY')
}

/**
 * 计算雇佣周数 (DOE)
 * @param {Date} complaintFilingDate - 起诉日期
 * @param {Date} employmentStartDate - 雇佣开始日期
 * @param {Date} employmentEndDate - 雇佣结束日期
 * @returns {number} 雇佣周数（向上取整）
 */
export const calculateDOE = (complaintFilingDate, employmentStartDate, employmentEndDate) => {
  if (!complaintFilingDate || !employmentStartDate || !employmentEndDate) return 0
  
  const startDate = dayjs(employmentStartDate)
  const endDate = dayjs(employmentEndDate)
  const filingDate = dayjs(complaintFilingDate)
  
  // 计算起诉日期与雇佣开始日期的差异（年）
  const yearsDiff = filingDate.diff(startDate, 'year', true)
  
  let weeks
  if (yearsDiff < 3) {
    // 如果少于3年，计算雇佣结束日期与开始日期的周数
    weeks = endDate.diff(startDate, 'week', true)
  } else {
    // 如果超过3年，计算雇佣结束日期与(起诉日期-3年)的周数
    const threeYearsAgo = filingDate.subtract(3, 'year')
    weeks = endDate.diff(threeYearsAgo, 'week', true)
  }
  
  return Math.ceil(weeks)
}

/**
 * 计算1.5倍加班小时数
 * @param {number} weeklyHours - 每周工作小时数
 * @param {number} doubleOvertimeHours - 双倍加班小时数
 * @returns {number} 1.5倍加班小时数
 */
export const calculate1_5OvertimeHours = (weeklyHours, doubleOvertimeHours) => {
  const hours = weeklyHours - doubleOvertimeHours - 40
  return Math.max(0, hours)
}

/**
 * 计算总加班小时数
 * @param {number} oneAndHalfOvertimeHours - 1.5倍加班小时数
 * @param {number} doubleOvertimeHours - 双倍加班小时数
 * @returns {number} 总加班小时数
 */
export const calculateOvertimeHoursTotal = (oneAndHalfOvertimeHours, doubleOvertimeHours) => {
  return oneAndHalfOvertimeHours + doubleOvertimeHours
}

/**
 * 计算未付工资损害
 * @param {number} unpaidHours - 未付小时数
 * @param {number} hourlyRate - 时薪
 * @returns {number} 未付工资损害
 */
export const calculateDamageUnpaidWages = (unpaidHours, hourlyRate) => {
  return unpaidHours * hourlyRate
}

/**
 * 计算用餐时间损害
 * @param {number} missedMealBreaks - 每周错过用餐时间
 * @param {number} doe - 雇佣周数
 * @param {number} hourlyRate - 时薪
 * @returns {number} 用餐时间损害
 */
export const calculateDamageMealBreaks = (missedMealBreaks, doe, hourlyRate) => {
  return missedMealBreaks * doe * hourlyRate
}

/**
 * 计算休息时间损害
 * @param {number} missedRestBreaks - 每周错过休息时间
 * @param {number} doe - 雇佣周数
 * @param {number} hourlyRate - 时薪
 * @returns {number} 休息时间损害
 */
export const calculateDamageRestBreaks = (missedRestBreaks, doe, hourlyRate) => {
  return missedRestBreaks * doe * hourlyRate
}

/**
 * 计算加班费损害
 * @param {number} oneAndHalfOvertimeHours - 1.5倍加班小时数
 * @param {number} doubleOvertimeHours - 双倍加班小时数
 * @param {number} hourlyRate - 时薪
 * @param {number} doe - 雇佣周数
 * @returns {number} 加班费损害
 */
export const calculateDamageOvertime = (oneAndHalfOvertimeHours, doubleOvertimeHours, hourlyRate, doe) => {
  const oneAndHalfDamage = oneAndHalfOvertimeHours * hourlyRate * doe * 1.5
  const doubleDamage = doubleOvertimeHours * hourlyRate * doe * 2
  return oneAndHalfDamage + doubleDamage
}

/**
 * 计算等待时间损害
 * @param {number} hourlyRate - 时薪
 * @returns {number} 等待时间损害
 */
export const calculateDamageWaitingTime = (hourlyRate) => {
  return hourlyRate * 8 * 30
}

/**
 * 计算工资单罚金
 * @param {number} payPeriods - 薪资期数
 * @returns {number} 工资单罚金
 */
export const calculateWageStatementPenalty = (payPeriods) => {
  const calculatedPenalty = 50 + payPeriods * 100
  return Math.min(calculatedPenalty, 4000)
}

/**
 * 计算总损害赔偿
 * @param {object} damages - 各项损害赔偿对象
 * @returns {number} 总损害赔偿
 */
export const calculateDamageTotal = (damages) => {
  const {
    damageUnpaidWages = 0,
    damageMealBreaks = 0,
    damageRestBreaks = 0,
    damageOvertime = 0,
    damageWaitingTime = 0,
    businessExpenseAmount = 0,
    wageStatementPenalty = 0
  } = damages
  
  return damageUnpaidWages + damageMealBreaks + damageRestBreaks + 
         damageOvertime + damageWaitingTime + businessExpenseAmount + 
         wageStatementPenalty
}

/**
 * 计算利息期间（月数）
 * @param {Date} complaintFilingDate - 起诉日期
 * @param {Date} employmentEndDate - 雇佣结束日期
 * @returns {number} 利息期间（月数）
 */
export const calculateInterestPeriod = (complaintFilingDate, employmentEndDate) => {
  if (!complaintFilingDate || !employmentEndDate) return 0
  return Math.ceil(dayjs(complaintFilingDate).diff(dayjs(employmentEndDate), 'month', true))
}

/**
 * 计算预判利息
 * @param {number} damageTotal - 总损害赔偿
 * @param {number} interestPeriod - 利息期间（月数）
 * @returns {number} 预判利息
 */
export const calculatePreJudgmentInterest = (damageTotal, interestPeriod) => {
  return damageTotal * interestPeriod * 0.10 / 12
}

/**
 * 计算含利息总损害
 * @param {number} damageTotal - 总损害赔偿
 * @param {number} preJudgmentInterest - 预判利息
 * @returns {number} 含利息总损害
 */
export const calculateDamageTotalIncludingInterest = (damageTotal, preJudgmentInterest) => {
  return damageTotal + preJudgmentInterest
}

/**
 * 判断复数形式
 * @param {string} names - 姓名字符串（多个姓名用逗号分隔）
 * @returns {object} 包含单复数形式的对象
 */
export const getPlurality = (names) => {
  const isPlural = names && names.split(',').length > 1
  return {
    form1: isPlural ? 'Plaintiffs' : 'Plaintiff',
    form2: isPlural ? 'Plaintiffs are' : 'Plaintiff is',
    form1Defendant: isPlural ? 'Defendants' : 'Defendant',
    form2Defendant: isPlural ? 'Defendants are' : 'Defendant is'
  }
}

/**
 * 计算加班状态
 * @param {number} weeklyHours - 每周工作小时数
 * @returns {string} 加班状态
 */
export const calculateOvertimeStatus = (weeklyHours) => {
  return weeklyHours > 40 ? 'Unpaid' : 'N/A'
}

/**
 * 计算3年诉讼时效日期
 * @param {Date} complaintFilingDate - 起诉日期
 * @returns {string} 3年诉讼时效日期
 */
export const calculate3SOL = (complaintFilingDate) => {
  if (!complaintFilingDate) return ''
  return formatLegalDate(dayjs(complaintFilingDate).subtract(3, 'year'))
}

/**
 * 计算4年诉讼时效日期
 * @param {Date} complaintFilingDate - 起诉日期
 * @returns {string} 4年诉讼时效日期
 */
export const calculate4SOL = (complaintFilingDate) => {
  if (!complaintFilingDate) return ''
  return formatLegalDate(dayjs(complaintFilingDate).subtract(4, 'year'))
}

/**
 * 生成案件编号
 * @param {number} index - 选中的起诉原因索引
 * @returns {string} 案件编号
 */
export const generateCauseNumber = (index) => {
  const numbers = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH']
  return numbers[index] || 'FIRST'
}

/**
 * 将数字转换为英文大写形式（适用于法律文书）
 * @param {number} amount - 金额数字
 * @returns {string} 英文大写金额（不含"DOLLARS"）
 */
export const convertAmountToWords = (amount) => {
  if (!amount || amount === 0) return ''
  
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 
                'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 
                'SEVENTEEN', 'EIGHTEEN', 'NINETEEN']
  
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY']
  
  const scales = ['', 'THOUSAND', 'MILLION', 'BILLION']
  
  function convertHundreds(n) {
    let result = ''
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' HUNDRED'
      n %= 100
      if (n > 0) result += ' '
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      n %= 10
      if (n > 0) result += '-' + ones[n]
    } else if (n > 0) {
      result += ones[n]
    }
    
    return result
  }
  
  // 处理小数部分
  const [wholePart, decimalPart] = amount.toString().split('.')
  let wholeAmount = parseInt(wholePart)
  
  if (wholeAmount === 0) return 'ZERO'
  
  let result = ''
  let scaleIndex = 0
  
  while (wholeAmount > 0) {
    const chunk = wholeAmount % 1000
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk)
      if (scaleIndex > 0) {
        result = chunkWords + ' ' + scales[scaleIndex] + (result ? ' ' + result : '')
      } else {
        result = chunkWords
      }
    }
    wholeAmount = Math.floor(wholeAmount / 1000)
    scaleIndex++
  }
  
  // 处理小数部分（如果需要）
  if (decimalPart && parseInt(decimalPart) > 0) {
    const cents = parseInt(decimalPart.padEnd(2, '0').substring(0, 2))
    result += ' AND ' + convertHundreds(cents) + ' CENTS'
  }
  
  return result
} 