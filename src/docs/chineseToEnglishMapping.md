# Chinese to English Translation Mapping

This document provides a mapping of Chinese text to English translations used in the configuration files.

## Configuration Files Translation

### Main Form Configuration (formConfig.json)

| Chinese Original | English Translation |
|------------------|-------------------|
| 法律诉讼表单系统 - 支持配置化公式计算 | Legal litigation form system with configurable formula calculations |
| 当事人信息 | Party Information |
| 请输入原告姓名 | Enter plaintiff name |
| 可添加多个原告，自动添加 ', an individual,' 后缀 | Can add multiple plaintiffs, automatically adds ', an individual,' suffix |
| 请输入原告职业 | Enter plaintiff's job |
| 请输入被告姓名 | Enter defendant name |
| 可添加多个被告。如果是公司，需要选择州。例如：'a California corporation.' | Can add multiple defendants. If corporation, need to select state. Example: 'a California corporation.' |
| 请输入原告居住地（县，州） | Enter plaintiff residence (County, State) |
| 案件信息 | Case Information |
| 请输入案件编号 | Enter case number |
| 默认值设置为空格 | Default value is set to space |
| 请输入法官姓名 | Enter judge name |
| 选择起诉日期 | Select filing date |
| 格式需要为 'June 10, 2025' | Format should be 'June 10, 2025' |
| 选择诉讼原因 | Select causes of action |
| 雇佣信息 | Employment Information |
| 选择雇佣开始日期 | Select employment start date |
| 用于计算雇佣周数 | Used to calculate employment weeks |
| 选择雇佣结束日期 | Select employment end date |
| 请输入小时工资率 | Enter hourly rate |
| 用于计算未付工资、加班费等 | Used to calculate unpaid wages, overtime, etc. |
| 请输入每周实际工作小时数 | Enter actual weekly hours worked |
| 请输入每周2倍加班小时数 | Enter weekly 2x overtime hours |
| 请输入被告企业类型 | Enter defendant business type |
| 请输入被告企业详细地址（原告工作地点） | Enter defendant's detailed business address (where plaintiff worked) |
| 工资和时间信息 | Wage and Time Information |
| 请输入未付工作小时数 | Enter unpaid work hours |
| 请输入每周错过的用餐休息次数 | Enter weekly missed meal breaks |
| 请输入每周错过的休息时间次数 | Enter weekly missed rest breaks |
| 请输入适用的IWC命令编号 | Enter applicable IWC order number |
| 请输入支付周期数 | Enter number of pay periods |
| 商业费用 | Business Expenses |
| 请输入未报销费用类型（如汽油费） | Enter type of unreimbursed expense (e.g. gas) |
| 请输入未报销商业费用金额 | Enter amount of unreimbursed business expense |
| 自动计算字段 | Auto-Calculated Fields |
| 根据原告数量自动计算单复数 | Automatically calculates singular/plural based on plaintiff count |
| 根据被告数量自动计算单复数 | Automatically calculates singular/plural based on defendant count |
| 雇佣周数 | Employment Weeks |
| 基于3年诉讼时效的复杂周数计算，向上取整 | Complex weeks calculation based on 3-year statute of limitations, rounded up |
| 1.5倍加班时间 = 每周工作时间 - 2倍加班时间 - 40 | 1.5x overtime hours = Weekly hours - 2x overtime hours - 40 |
| 总加班时间 = 1.5倍加班时间 + 2倍加班时间 | Total overtime hours = 1.5x overtime hours + 2x overtime hours |
| 加班状态判断 | Overtime status determination |
| 今天日期，格式为 'June 15, 2025' | Today's date in format 'June 15, 2025' |
| 3年诉讼时效日期 | 3-Year Statute of Limitations Date |
| 起诉日期减去3年 | Filing date minus 3 years |
| 4年诉讼时效日期 | 4-Year Statute of Limitations Date |
| 起诉日期减去4年 | Filing date minus 4 years |
| 损害赔偿计算 | Damage Calculations |
| 工资单罚金：如果 < 4000，则为 50+(PayPeriods-1)*100，否则为 4000 | Wage statement penalty: If < 4000, then 50+(PayPeriods-1)*100, otherwise 4000 |
| 未付工资损害 = 未付小时数 × 小时工资率 | Unpaid wages damage = Unpaid hours × Hourly rate |
| 用餐休息损害 = 每周错过次数 × 雇佣周数 × 小时工资率 | Meal breaks damage = Weekly missed count × Employment weeks × Hourly rate |
| 休息时间损害 = 每周错过次数 × 雇佣周数 × 小时工资率 | Rest breaks damage = Weekly missed count × Employment weeks × Hourly rate |
| 加班损害 = 1.5倍加班损害 + 2倍加班损害 | Overtime damage = 1.5x overtime damage + 2x overtime damage |
| 等待时间损害 = 小时工资率 × 8小时 × 30天 | Waiting time damage = Hourly rate × 8 hours × 30 days |
| 总损害赔偿 = 所有损害项目之和 | Total damage = Sum of all damage items |
| 利息期间（月数）= 起诉日期 - 雇佣结束日期 | Interest period (months) = Filing date - Employment end date |
| 判决前利息 = 总损害 × 利息期间 × 10% / 12 | Pre-judgment interest = Total damage × Interest period × 10% / 12 |
| 包含利息的总损害 = 总损害 + 判决前利息 | Total damage including interest = Total damage + Pre-judgment interest |

### Auto Suffix Demo Configuration (autoSuffixDemo.json)

| Chinese Original | English Translation |
|------------------|-------------------|
| 自动后缀功能演示 | Auto Suffix Feature Demo |
| 展示不同字段的自动后缀功能 | Demonstrates automatic suffix functionality for different field types |
| 文本后缀演示 | Text Suffix Demonstration |
| 自动添加 ', an individual,' | Auto adds ', an individual,' |
| 请输入原告姓名 | Enter plaintiff name |
| 失去焦点时自动添加 ', an individual,' 后缀 | Automatically adds ', an individual,' suffix when field loses focus |
| 自动添加 ', a corporation' | Auto adds ', a corporation' |
| 请输入被告姓名 | Enter defendant name |
| 失去焦点时自动添加 ', a corporation' 后缀 | Automatically adds ', a corporation' suffix when field loses focus |
| 自动添加 ' (证人)' | Auto adds ' (Witness)' |
| 请输入证人姓名 | Enter witness name |
| 失去焦点时自动添加中文后缀 ' (证人)' | Automatically adds ' (Witness)' suffix when field loses focus |
| 自动添加 ', Esq.' | Auto adds ', Esq.' |
| 请输入律师姓名 | Enter attorney name |
| 失去焦点时自动添加 ', Esq.' 后缀 | Automatically adds ', Esq.' suffix when field loses focus |
| 自动添加 ' LLC' | Auto adds ' LLC' |
| 请输入公司名称 | Enter company name |
| 失去焦点时自动添加 ' LLC' 后缀 | Automatically adds ' LLC' suffix when field loses focus |
| 自动添加 ', USA' | Auto adds ', USA' |
| 请输入地址 | Enter address |
| 失去焦点时自动添加 ', USA' 后缀 | Automatically adds ', USA' suffix when field loses focus |
| 无后缀字段对比 | No Suffix Fields Comparison |
| 无自动后缀 | No Auto Suffix |
| 这个字段不会自动添加后缀 | This field will not add any suffix automatically |
| 普通文本字段，不会自动添加任何后缀 | Regular text field with no automatic suffix added |
| 请输入案件编号 | Enter case number |
| 案件编号字段，保持原始输入 | Case number field maintains original input |
| 复杂后缀演示 | Complex Suffix Demonstration |
| 自定义复杂后缀 | Complex Auto Suffix |
| 请输入实体名称 | Enter entity name |
| 演示复杂的自动后缀功能 | Demonstrates complex automatic suffix functionality |
| 自动添加位置信息 | Auto adds location info |
| 请输入房产描述 | Enter property description |
| 失去焦点时自动添加位置信息后缀 | Automatically adds location information suffix when field loses focus |

### UI Interface Text

| Chinese Original | English Translation |
|------------------|-------------------|
| 主表单配置 | Main Form |
| 自动后缀演示 | Auto Suffix Demo |
| 隐藏模板管理 | Hide Template Manager |
| 显示模板管理 | Show Template Manager |

## Notes

- All Chinese text has been replaced with professional English equivalents
- Legal terminology has been preserved accurately
- Field descriptions maintain technical precision
- Placeholder text provides clear user guidance
- Auto suffix functionality works with both English and Chinese content 