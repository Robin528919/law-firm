/**
 * 公式计算引擎
 * 支持在JSON配置中定义计算公式，实现动态计算
 */

/**
 * 公式解析器类
 */
class FormulaEngine {
  constructor() {
    // 内置函数定义
    this.functions = {
      // 条件函数
      if: (condition, trueValue, falseValue) => condition ? trueValue : falseValue,
      
      // 数学函数
      sum: (...args) => args.reduce((a, b) => Number(a || 0) + Number(b || 0), 0),
      max: (...args) => Math.max(...args.map(x => Number(x || 0))),
      min: (...args) => Math.min(...args.map(x => Number(x || 0))),
      round: (value, decimals = 0) => Math.round(Number(value || 0) * Math.pow(10, decimals)) / Math.pow(10, decimals),
      ceil: (value) => Math.ceil(Number(value || 0)),
      floor: (value) => Math.floor(Number(value || 0)),
      abs: (value) => Math.abs(Number(value || 0)),
      
      // 日期函数
      dateDiff: (date1, date2, unit = 'days') => this.calculateDateDiff(date1, date2, unit),
      dateAdd: (date, value, unit = 'days') => this.calculateDateAdd(date, value, unit),
      dateSubtract: (date, value, unit = 'days') => this.calculateDateAdd(date, -value, unit),
      weeksBetween: (date1, date2) => this.calculateDateDiff(date1, date2, 'weeks'),
      monthsBetween: (date1, date2) => this.calculateDateDiff(date1, date2, 'months'),
      yearsBetween: (date1, date2) => this.calculateDateDiff(date1, date2, 'years'),
      today: () => new Date().toISOString().split('T')[0],
      formatDate: (date, format = 'legal') => this.formatDate(date, format),
      
      // 文本函数
      concat: (...args) => args.filter(x => x != null).join(''),
      pluralize: (count, singular, plural) => Number(count) > 1 ? plural : singular,
      
      // 数组函数
      count: (arr) => Array.isArray(arr) ? arr.filter(x => x && x.trim()).length : 0,
      generateCauseNumbers: (count) => {
        if (!count || count <= 0) return '';
        return Array.from({length: count}, (_, i) => `C-${i+1}`).join(', ');
      },
      isEmpty: (value) => !value || (Array.isArray(value) && value.every(x => !x || !x.trim())),
      isNotEmpty: (value) => !this.functions.isEmpty(value)
    }
  }

  /**
   * 计算日期差值
   * @param {string|Date} date1 
   * @param {string|Date} date2 
   * @param {string} unit - 'days', 'weeks', 'months', 'years'
   * @returns {number}
   */
  calculateDateDiff(date1, date2, unit = 'days') {
    if (!date1 || !date2) return 0
    
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
    
    const timeDiff = Math.abs(d2.getTime() - d1.getTime())
    
    switch (unit) {
      case 'days':
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
      case 'weeks':
        return Math.ceil(timeDiff / (1000 * 3600 * 24 * 7))
      case 'months':
        return Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))
      case 'years':
        return Math.abs(d2.getFullYear() - d1.getFullYear())
      default:
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
    }
  }

  /**
   * 日期加减法
   * @param {string|Date} date 
   * @param {number} value 
   * @param {string} unit 
   * @returns {string}
   */
  calculateDateAdd(date, value, unit = 'days') {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    switch (unit) {
      case 'days':
        d.setDate(d.getDate() + value)
        break
      case 'weeks':
        d.setDate(d.getDate() + value * 7)
        break
      case 'months':
        d.setMonth(d.getMonth() + value)
        break
      case 'years':
        d.setFullYear(d.getFullYear() + value)
        break
    }
    
    return d.toISOString().split('T')[0]
  }

  /**
   * 格式化日期
   * @param {string|Date} date 
   * @param {string} format 
   * @returns {string}
   */
  formatDate(date, format = 'legal') {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    switch (format) {
      case 'legal':
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
      case 'standard':
        return d.toISOString().split('T')[0]
      case 'short':
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
      default:
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }
  }

  /**
   * 解析公式中的变量引用
   * @param {string} formula 
   * @param {object} data 
   * @returns {string}
   */
  replaceVariables(formula, data) {
    // 替换 {d.variableName} 格式的变量
    return formula.replace(/\{d\.([^}]+)\}/g, (match, varName) => {
      const value = data[varName]
      if (value === undefined || value === null) return '0'
      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (trimmed === '' || isNaN(trimmed)) return '0'
        return trimmed
      }
      if (typeof value === 'boolean') return value ? '1' : '0'
      if (Array.isArray(value)) return value.length
      const num = Number(value)
      return isNaN(num) ? '0' : num
    })
  }

  /**
   * 解析函数调用
   * @param {string} expression 
   * @param {object} data 
   * @returns {any}
   */
  parseFunction(expression, data) {
    // 匹配函数调用格式：functionName(arg1, arg2, ...)
    const functionMatch = expression.match(/^(\w+)\((.*)\)$/)
    if (!functionMatch) return this.evaluateExpression(expression)

    const [, functionName, argsString] = functionMatch
    const func = this.functions[functionName]
    
    if (!func) {
      console.warn(`未知函数: ${functionName}`)
      return 0
    }

    // 解析参数
    const args = this.parseArguments(argsString, data)
    
    try {
      return func(...args)
    } catch (error) {
      console.error(`函数 ${functionName} 执行错误:`, error)
      return 0
    }
  }

  /**
   * 解析函数参数
   * @param {string} argsString 
   * @param {object} data 
   * @returns {Array}
   */
  parseArguments(argsString, data) {
    if (!argsString.trim()) return []
    
    const args = []
    let currentArg = ''
    let depth = 0
    let inString = false
    let stringChar = ''

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i]
      
      if (!inString && (char === '"' || char === "'")) {
        inString = true
        stringChar = char
        currentArg += char
      } else if (inString && char === stringChar) {
        inString = false
        currentArg += char
      } else if (!inString && char === '(') {
        depth++
        currentArg += char
      } else if (!inString && char === ')') {
        depth--
        currentArg += char
      } else if (!inString && char === ',' && depth === 0) {
        // Evaluate arithmetic expressions in arguments
      const evaluatedArg = this.evaluateExpression(currentArg.trim());
      args.push(evaluatedArg);
        currentArg = ''
      } else {
        currentArg += char
      }
    }
    
    if (currentArg.trim()) {
      args.push(this.evaluateExpression(currentArg.trim(), data))
    }
    
    return args
  }

  /**
   * 计算多个公式
   * @param {Array} fields - 字段配置数组
   * @param {object} data - 表单数据
   * @returns {object} 计算结果对象
   */
  calculateMultipleFormulas(fields, data) {
    const results = {}
    fields.forEach(field => {
      if (field.type === 'computed' && field.formula) {
        results[field.id] = this.evaluateExpression(field.formula, data)
      }
    })
    return results
  }

  /**
   * 计算表达式
   * @param {string} expression 
   * @param {object} data 
   * @returns {any}
   */
  evaluateExpression(expression, data) {
    if (!expression) return 0
    
    expression = expression.toString().trim()
    
    // 处理字符串字面量
    if ((expression.startsWith('"') && expression.endsWith('"')) ||
        (expression.startsWith("'") && expression.endsWith("'"))) {
      return expression.slice(1, -1)
    }
    
    // 处理数字
    if (/^-?\d+(\.\d+)?$/.test(expression)) {
      return Number(expression)
    }
    
    // 处理布尔值
    if (expression === 'true') return true
    if (expression === 'false') return false
    
    // 替换变量
    expression = this.replaceVariables(expression, data)
    
    // 处理函数调用
    if (expression.includes('(') && expression.includes(')')) {
      // 从内到外解析嵌套函数
      while (expression.includes('(')) {
        const match = expression.match(/(\w+)\(([^()]*)\)/)
        if (!match) break
        
        const [fullMatch, functionName, argsString] = match
        const result = this.parseFunction(fullMatch, data)
        expression = expression.replace(fullMatch, result)
      }
    }
    
    // 计算数学表达式
    try {
      // 安全的表达式计算（仅支持基本数学运算）
      let safeExpression = expression.replace(/[^0-9+\-*/.() <>=!&|]/g, '')
      // 修复连续运算符问题，确保所有连续运算符间都插入0
      while (safeExpression.match(/([+\-*/])\s*([+\-*/])/)) {
        safeExpression = safeExpression.replace(/([+\-*/])\s*([+\-*/])/g, '$10$2')
      }
      if (safeExpression !== expression) {
        // 如果包含不安全字符，使用简化计算
        return this.evaluateSimpleExpression(expression, data)
      }
      
      // 使用Function构造器安全计算
      const result = new Function('return ' + expression)()
      return isNaN(result) ? 0 : result
    } catch (error) {
      console.warn('表达式计算错误:', expression, error)
      return 0
    }
  }

  /**
   * 简化表达式计算（处理比较和逻辑运算）
   * @param {string} expression 
   * @param {object} data 
   * @returns {any}
   */
  evaluateSimpleExpression(expression, data) {
    // 处理比较运算符
    const comparisons = [
      { op: '>=', fn: (a, b) => Number(a) >= Number(b) },
      { op: '<=', fn: (a, b) => Number(a) <= Number(b) },
      { op: '>', fn: (a, b) => Number(a) > Number(b) },
      { op: '<', fn: (a, b) => Number(a) < Number(b) },
      { op: '==', fn: (a, b) => a == b },
      { op: '!=', fn: (a, b) => a != b }
    ]
    
    for (const { op, fn } of comparisons) {
      if (expression.includes(op)) {
        const [left, right] = expression.split(op).map(s => s.trim())
        const leftValue = this.evaluateExpression(left, data)
        const rightValue = this.evaluateExpression(right, data)
        return fn(leftValue, rightValue)
      }
    }
    
    // 处理逻辑运算符
    if (expression.includes('&&')) {
      const parts = expression.split('&&').map(s => s.trim())
      return parts.every(part => this.evaluateExpression(part, data))
    }
    
    if (expression.includes('||')) {
      const parts = expression.split('||').map(s => s.trim())
      return parts.some(part => this.evaluateExpression(part, data))
    }
    
    return 0
  }

  /**
   * 计算公式
   * @param {string} formula - 公式字符串
   * @param {object} data - 数据对象
   * @returns {any} 计算结果
   */
  calculate(formula, data = {}) {
    if (!formula) return ''
    
    try {
      return this.evaluateExpression(formula, data)
    } catch (error) {
      console.error('公式计算错误:', formula, error)
      return 0
    }
  }

  /**
   * 批量计算多个公式
   * @param {Array} formulas - 公式配置数组
   * @param {object} data - 数据对象
   * @returns {object} 计算结果对象
   */
  calculateMultiple(formulas, data = {}) {
    const results = {}
    
    // 多轮计算，确保依赖关系正确解析
    const maxIterations = 5
    let iteration = 0
    
    while (iteration < maxIterations) {
      let hasChanges = false
      
      formulas.forEach(formula => {
        if (formula.type === 'computed' && formula.formula) {
          const newValue = this.calculate(formula.formula, { ...data, ...results })
          
          if (results[formula.id] !== newValue) {
            results[formula.id] = newValue
            hasChanges = true
          }
        }
      })
      
      if (!hasChanges) break
      iteration++
    }
    
    return results
  }
}

// 创建全局实例
export const formulaEngine = new FormulaEngine()

// 导出工具函数
export const calculateFormula = (formula, data) => formulaEngine.calculate(formula, data)
export const calculateMultipleFormulas = (formulas, data) => formulaEngine.calculateMultiple(formulas, data)

export default FormulaEngine