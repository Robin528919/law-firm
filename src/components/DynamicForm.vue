<template>
  <!-- 动态表单组件 - 根据JSON配置渲染表单 -->
  <div class="dynamic-form">
    <!-- 表单标题和描述 -->
    <div class="form-header" v-if="config.title || config.description">
      <h2 v-if="config.title">{{ config.title }}</h2>
      <p v-if="config.description" class="form-description">{{ config.description }}</p>
    </div>

    <!-- Element Plus 表单容器 -->
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="200px"
      label-position="left"
      class="dynamic-form-content"
    >
      <!-- 支持分组和非分组两种配置方式 -->
      <template v-if="config.sections">
        <!-- 分组表单渲染 -->
        <div v-for="section in config.sections" :key="section.id" class="form-section">
          <el-divider content-position="left">
            <h3 class="section-title">{{ section.title }}</h3>
          </el-divider>

          <!-- 渲染分组内的字段 -->
          <template v-for="field in section.fields" :key="field.id">
            <FormField
              :field="field"
              :formData="formData"
              :computedValues="computedValues"
              @update-field="updateField"
              @add-multiple="addMultipleValue"
              @remove-multiple="removeMultipleValue"
            />
          </template>
        </div>
      </template>

      <template v-else>
        <!-- 传统单列表字段渲染（向后兼容） -->
        <template v-for="field in config.fields" :key="field.id">
          <FormField
            :field="field"
            :formData="formData"
            :computedValues="computedValues"
            @update-field="updateField"
            @add-multiple="addMultipleValue"
            @remove-multiple="removeMultipleValue"
          />
        </template>
               </template>

      <!-- 表单操作按钮 -->
      <el-form-item>
        <div class="form-actions">
          <el-button @click="handleReset">重置表单</el-button>
          <el-button type="info" @click="handlePreview">预览数据</el-button>
          <el-button type="primary" @click="handleSubmit">提交表单</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 表单数据导出组件 -->
    <div class="export-section">
      <el-divider content-position="center">
        <el-icon><Download /></el-icon>
        数据导出
      </el-divider>
      <FormDataExporter
        :form-data="{ ...formData, ...computedValues }"
        :form-config="config"
        :file-name-prefix="'complaint-form'"
      />
    </div>

    <!-- 数据预览对话框 -->
    <el-dialog v-model="previewVisible" title="表单数据预览" width="60%">
      <pre class="data-preview">{{ JSON.stringify(formData, null, 2) }}</pre>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 动态表单组件脚本 - 使用Vue 3 Composition API
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'
import FormDataExporter from './FormDataExporter.vue'
import FormField from './FormField.vue'
import {
  calculateAllComputedFields,
  formatDate,
  validateFieldValue
} from '../utils/formCalculations.js'

// 组件属性定义
const props = defineProps({
  // 表单配置对象
  config: {
    type: Object,
    required: true,
    default: () => ({ fields: [] })
  },
  // 初始表单数据
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// 组件事件定义
const emit = defineEmits(['submit', 'change'])

// 响应式数据
const formRef = ref() // 表单引用
const formData = reactive({}) // 表单数据
const previewVisible = ref(false) // 预览对话框显示状态

// 表单验证规则
const formRules = computed(() => {
  const rules = {}
  const allFields = getAllFields()
  allFields.forEach(field => {
    if (field.required) {
      rules[field.id] = [
        {
          required: true,
          message: `请输入${field.label}`,
          trigger: field.type === 'select' ? 'change' : 'blur'
        }
      ]
    }
  })
  return rules
})

// 获取所有字段（支持分组和非分组配置）
const getAllFields = () => {
  if (props.config.sections) {
    return props.config.sections.flatMap(section => section.fields || [])
  }
  return props.config.fields || []
}

// 初始化表单数据
const initFormData = () => {
  const allFields = getAllFields()
  console.log('初始化表单数据，所有字段:', allFields.map(f => ({ id: f.id, type: f.type })))
  allFields.forEach(field => {
    if (field.multiple) {
      // 多值字段初始化为数组
      formData[field.id] = props.initialData[field.id] || []
      // 确保至少有一个空值供编辑
      if (formData[field.id].length === 0) {
        formData[field.id].push('')
      }
      console.log(`初始化多值字段: ${field.id} = ${JSON.stringify(formData[field.id])}`)
    } else if (field.type === 'computed') {
      // 计算字段不需要初始化
      console.log(`跳过计算字段: ${field.id}`)

    } else {
      // 普通字段初始化
      const defaultValue = props.initialData[field.id] || field.defaultValue
      if (field.type === 'number') {
        // 数字字段初始化为null或数字
        formData[field.id] = defaultValue ? Number(defaultValue) : null
      } else {
        formData[field.id] = defaultValue || ''
      }
      console.log(`初始化普通字段: ${field.id} (${field.type}) = ${formData[field.id]}`)
    }
  })
  console.log('初始化完成后的formData:', JSON.stringify(formData, null, 2))
}

// 获取多值字段的值数组
const getMultipleValues = (fieldId) => {
  return formData[fieldId] || []
}

// 更新多值字段的特定索引值
const updateMultipleValue = (fieldId, index, value) => {
  if (!formData[fieldId]) {
    formData[fieldId] = []
  }
  formData[fieldId][index] = value
}

// 添加多值字段的新值
const addMultipleValue = (fieldId) => {
  if (!formData[fieldId]) {
    formData[fieldId] = []
  }
  formData[fieldId].push('')
}

// 删除多值字段的指定值
const removeMultipleValue = (fieldId, index) => {
  if (formData[fieldId] && formData[fieldId].length > 1) {
    formData[fieldId].splice(index, 1)
  }
}

// 计算字段的响应式值
const computedValues = computed(() => {
  const allFields = getAllFields()
  console.log('开始计算字段，当前表单数据:', formData)
  const result = calculateAllComputedFields(formData, allFields)
  console.log('计算字段结果:', result)
  return result
})

// 获取计算字段值
const getComputedValue = (field) => {
  const value = computedValues.value[field.id]

  // 如果是日期相关的计算，进行格式化
  if (field.computeRule && field.computeRule.includes('Date')) {
    return formatDate(value, 'legal')
  }

  // 如果是数字，保留两位小数
  if (typeof value === 'number' && !Number.isInteger(value)) {
    return value.toFixed(2)
  }

  return value || ''
}

// 更新字段值（由FormField组件调用）
const updateField = (fieldId, value) => {
  console.log(`字段更新: ${fieldId} = ${value} (类型: ${typeof value})`)
  console.log('更新前formData:', JSON.stringify(formData, null, 2))
  formData[fieldId] = value
  console.log('更新后formData:', JSON.stringify(formData, null, 2))
}

// 表单提交处理
const handleSubmit = async () => {
  try {
    // 验证表单
    await formRef.value.validate()

    // 发送提交事件
    emit('submit', { ...formData })

    ElMessage.success('表单提交成功！')
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入内容')
  }
}

// 表单重置处理
const handleReset = () => {
  formRef.value.resetFields()
  initFormData()
  ElMessage.info('表单已重置')
}

// 预览数据处理
const handlePreview = () => {
  previewVisible.value = true
}

// 监听表单数据变化
watch(
  () => formData,
  (newData) => {
    // 合并计算字段的值
    const allData = {
      ...newData,
      ...computedValues.value
    }
    emit('change', allData)
  },
  { deep: true }
)

// 监听计算值变化
watch(
  computedValues,
  (newComputedValues) => {
    // 当计算值变化时，也触发change事件
    const allData = {
      ...formData,
      ...newComputedValues
    }
    emit('change', allData)
  },
  { deep: true }
)

// 判断是否为公司
const isCompany = (name) => {
  if (!name) return false;
  const companyKeywords = ['corporation', 'inc.', 'llc', 'ltd.'];
  const lowerCaseName = name.toLowerCase();
  return companyKeywords.some(keyword => lowerCaseName.includes(keyword));
};

// 组件挂载时初始化
onMounted(() => {
  console.log('=== DynamicForm onMounted 开始 ===')
  console.log('当前配置:', props.config)
  initFormData()
  console.log('=== DynamicForm onMounted 结束 ===')
})

// 监听配置变化，重新初始化表单
watch(
  () => props.config,
  (newConfig, oldConfig) => {
    if (newConfig !== oldConfig) {
      console.log('配置已更新，重新初始化表单:', newConfig)
      // 清空当前表单数据
      Object.keys(formData).forEach(key => {
        delete formData[key]
      })
      // 重新初始化
      initFormData()
    }
  },
  { deep: true, immediate: false }
)
</script>

<style scoped>
/* 动态表单样式 */
.dynamic-form {
  padding: 24px; /* Figma padding */
  width: 100%;
  box-sizing: border-box;
}

.form-header {
  text-align: left;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #D9D9D9;
}

.form-header h2 {
  color: #1E1E1E;
  margin-bottom: 8px;
  font-size: 1.5rem; /* 调整以匹配 Figma 层次结构 */
  font-weight: 700;
}

.form-description {
  color: #606266;
  font-size: 1rem;
  line-height: 1.5;
}

.dynamic-form-content {
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
}

/* 应用 Figma 样式到 Element Plus 组件 */
:deep(.el-form-item__label) {
  color: #1E1E1E;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
}

:deep(.el-input__wrapper) {
  background-color: #FFFFFF !important;
  border: 1px solid #D9D9D9 !important;
  border-radius: 8px !important;
  padding: 11px 15px !important; /* 调整以匹配 12px padding 和 1px border */
  box-shadow: none !important;
}

:deep(.el-input__inner) {
  color: #1E1E1E !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 16px !important;
  font-weight: 400 !important;
}

:deep(.el-input__inner::placeholder) {
  color: #B3B3B3 !important;
}

:deep(.form-actions .el-button--primary) {
  background-color: #2C2C2C !important;
  border-color: #2C2C2C !important;
  color: #F5F5F5 !important;
  border-radius: 8px !important;
  padding: 12px 20px !important;
  font-size: 16px !important;
  font-weight: 400 !important;
}

:deep(.form-actions .el-button) {
  border-radius: 8px !important;
  padding: 12px 20px !important;
  font-size: 16px !important;
  font-weight: 400 !important;
}

.multiple-input-container {
  width: 100%;
}

.multiple-input-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px; /* 调整外边距 */
  gap: 12px; /* 调整间距 */
}

.multiple-input {
  flex: 1;
}

.add-button {
  margin-top: 8px; /* 调整外边距 */
}

.field-description {
  font-size: 0.85rem; /* 调整字体大小 */
  color: #8c939d; /* 调整字体颜色 */
  margin-top: 6px; /* 调整外边距 */
  line-height: 1.5;
}

.computed-field {
  background-color: #f7f8fa; /* 调整背景色 */
  padding: 10px 12px; /* 调整内边距 */
  border-radius: 4px; /* 调整圆角 */
  border: 1px solid #e4e7ed; /* 添加边框 */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;
  margin-top: 24px; /* Figma gap */
  padding-top: 24px;
  border-top: 1px solid #D9D9D9;
}

.data-preview {
  background-color: #f7f8fa; /* 调整背景色 */
  padding: 16px; /* 调整内边距 */
  border-radius: 6px; /* 调整圆角 */
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; /* 使用更现代的等宽字体 */
  font-size: 0.8rem; /* 调整字体大小 */
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e4e7ed; /* 添加边框 */
}

.export-section {
  margin-top: 36px;
  padding: 28px;
  background: #fcfcfc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dynamic-form {
    padding: 16px; /* 调整内边距 */
  }

  .form-header h2 {
    font-size: 1.4rem; /* 调整字体大小 */
  }

  .form-description {
    font-size: 0.85rem; /* 调整字体大小 */
  }

  .dynamic-form-content {
    padding: 16px; /* 调整内边距 */
  }

  .multiple-input-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px; /* 调整间距 */
  }

  .form-actions {
    text-align: center; /* 中小屏幕操作按钮居中 */
  }
}

@media (max-width: 480px) {
  .dynamic-form {
    padding: 12px; /* 调整内边距 */
  }

  .form-header {
    padding-bottom: 12px; /* 调整内边距 */
    margin-bottom: 16px; /* 调整外边距 */
  }

  .form-header h2 {
    font-size: 1.3rem; /* 调整字体大小 */
  }

  .dynamic-form-content {
    padding: 12px; /* 调整内边距 */
  }

  .form-actions {
    margin-top: 24px; /* 调整外边距 */
    padding-top: 16px; /* 调整内边距 */
  }

  .field-description {
    font-size: 0.8rem; /* 调整字体大小 */
  }

  .data-preview {
    font-size: 0.75rem; /* 调整字体大小 */
  }
}

/* 表单项响应式布局 */
@media (max-width: 768px) {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    line-height: 1.4;
  }

  :deep(.el-input__inner) {
    font-size: 14px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-date-editor) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  :deep(.el-form-item__label) {
    font-size: 13px;
    margin-bottom: 5px;
  }

  :deep(.el-input__inner) {
    font-size: 13px;
    padding: 8px 12px;
  }

  :deep(.el-button) {
    padding: 8px 15px;
    font-size: 13px;
  }

  :deep(.el-button--small) {
    padding: 6px 10px;
    font-size: 12px;
  }
}

/* 表单分组样式 */
.form-section {
  margin-bottom: 32px;
}

.section-title {
  color: #1E1E1E;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-divider--horizontal) {
  margin: 24px 0;
}

:deep(.el-divider__text) {
  background-color: #FFFFFF;
  padding: 0 16px;
}

/* 计算字段样式增强 */
:deep(.computed-field .el-input__wrapper) {
  background-color: #F5F5F5 !important;
  border-color: #E4E7ED !important;
  cursor: not-allowed;
}

:deep(.computed-field .el-input__inner) {
  color: #606266 !important;
  background-color: transparent !important;
  cursor: not-allowed;
}

</style>
