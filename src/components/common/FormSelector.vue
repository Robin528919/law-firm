<template>
  <div class="form-selector">
    <div class="selector-header">
      <h2 class="selector-title">
        <el-icon class="title-icon"><Menu /></el-icon>
        Select Form Type
      </h2>
      <p class="selector-description">Please select the type of legal document you want to create. The system will automatically load the corresponding form fields and calculation logic.</p>
    </div>
    
    <div class="selector-content">
      <el-select
        v-model="currentFormType"
        @change="handleFormTypeChange"
        placeholder="Please select form type"
        size="large"
        style="width: 100%"
        :disabled="isChanging"
      >
        <el-option
          v-for="formType in FORM_TYPES"
          :key="formType.value"
          :label="formType.label"
          :value="formType.value"
        >
          <div class="option-content">
            <div class="option-title">{{ formType.label }}</div>
            <div class="option-description">{{ formType.description }}</div>
          </div>
        </el-option>
      </el-select>
      
      <!-- 表单信息卡片 -->
      <div v-if="currentFormType" class="form-info-cards">
        <div 
          v-for="formType in FORM_TYPES"
          :key="formType.value"
          v-show="formType.value === currentFormType"
          class="info-card"
        >
          <div class="card-icon">
            <el-icon><component :is="getFormIcon(formType.value)" /></el-icon>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ formType.label }}</h3>
            <p class="card-description">{{ formType.description }}</p>
            <div class="card-features">
              <div class="feature-item" v-for="feature in getFormFeatures(formType.value)" :key="feature">
                <el-icon class="feature-icon"><Check /></el-icon>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { 
  Menu, Check, Document, Edit, User, 
  DocumentChecked, EditPen, Promotion 
} from '@element-plus/icons-vue'
import { useFormStore } from '@/stores/formStore'
import { FORM_TYPES } from '@/utils/constants'

const formStore = useFormStore()
const isChanging = ref(false)

// 当前表单类型
const currentFormType = computed({
  get: () => formStore.currentFormType,
  set: (value) => formStore.setCurrentFormType(value)
})

// 获取表单图标
const getFormIcon = (formType) => {
  const iconMap = {
    complaint: DocumentChecked,
    answer: EditPen,
    settlement: Promotion
  }
  return iconMap[formType] || Document
}

// Get form features
const getFormFeatures = (formType) => {
  const featuresMap = {
    complaint: [
      'Automatic damage calculation',
      'Multiple causes of action support',
      'Smart date processing',
      'Automatic plural form judgment'
    ],
    answer: [
      'Standard court reply format',
      'Automatic date formatting',
      'Multi-line address input support',
      'Clean and efficient interface'
    ],
    settlement: [
      'Installment payment calculation',
      'Multiple contact methods',
      'Amount case conversion',
      'Complete agreement generation'
    ]
  }
  return featuresMap[formType] || []
}

// 表单类型变更处理
const handleFormTypeChange = async (newType) => {
  if (isChanging.value) return
  
  isChanging.value = true
  
  try {
    // 检查当前表单是否有数据
    const currentData = getCurrentFormData()
    const hasData = Object.values(currentData).some(value => {
      if (typeof value === 'string') return value.trim() !== '' && value !== ' '
      if (typeof value === 'number') return value !== 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null
    })
    
    if (hasData) {
      await ElMessageBox.confirm(
        'Switching form type will clear current data. Do you want to continue?',
        'Confirm Switch',
        {
          confirmButtonText: 'Switch',
          cancelButtonText: 'Cancel',
          type: 'warning',
          customClass: 'form-switch-dialog'
        }
      )
    }
    
    // 切换表单类型
    formStore.setCurrentFormType(newType)
    
  } catch {
    // 用户取消，恢复原来的选择
    // 这里不需要手动恢复，因为computed会自动处理
  } finally {
    isChanging.value = false
  }
}

// 获取当前表单数据
const getCurrentFormData = () => {
  switch (currentFormType.value) {
    case 'complaint':
      return formStore.complaintForm.value // 修复：获取ref的value
    case 'answer':
      return formStore.answerForm.value // 修复：获取ref的value
    case 'settlement':
      return formStore.settlementForm.value // 修复：获取ref的value
    default:
      return {}
  }
}
</script>

<style scoped>
.selector-header {
  margin-bottom: 24px;
}

.selector-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.title-icon {
  margin-right: 8px;
  color: var(--primary-color);
}

.option-content {
  padding: 4px 0;
}

.option-title {
  font-weight: 600;
  color: var(--text-primary);
}

.option-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.form-info-cards {
  margin-top: 24px;
}

.info-card {
  display: flex;
  gap: 20px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--border-light);
  animation: slideInUp 0.3s ease-out;
}

.card-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.card-description {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-sm);
  color: var(--text-primary);
}

.feature-icon {
  color: var(--success-color);
  font-size: 16px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .info-card {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .card-features {
    grid-template-columns: 1fr;
  }
}

/* 自定义对话框样式 */
:global(.form-switch-dialog .el-message-box) {
  border-radius: var(--radius-lg);
}
</style> 