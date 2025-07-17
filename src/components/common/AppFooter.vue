<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>&copy; 2025 Legal Document Forms System - Pro v1.0.0</p>
        <p class="footer-description">A professional legal document generation tool built with Vue.js 3 + Element Plus</p>
      </div>

      <div class="footer-status">
        <div class="status-item">
          <el-icon class="status-icon"><CircleCheckFilled /></el-icon>
          <span>System running normally</span>
        </div>

        <div class="status-item">
          <el-icon class="status-icon"><DocumentChecked /></el-icon>
          <span>Current form: {{ getCurrentFormName() }}</span>
        </div>

        <div class="status-item">
          <el-icon class="status-icon"><Clock /></el-icon>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CircleCheckFilled, DocumentChecked, Clock } from '@element-plus/icons-vue'
import { useFormStore } from '@/stores/formStore'
import { FORM_TYPES } from '@/utils/constants'

const formStore = useFormStore()

// 当前时间
const currentTime = ref('')
let timeInterval = null

// 获取当前表单名称
const getCurrentFormName = () => {
  const formType = FORM_TYPES.find(type => type.value === formStore.currentFormType)
  return formType ? formType.label.split(' ')[0] : 'Not Selected'
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-info p {
  margin: 0;
  line-height: 1.4;
}

.footer-description {
  font-size: var(--font-xs);
  color: var(--text-light);
  margin-top: 4px;
}

.footer-status {
  display: flex;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.status-icon {
  font-size: 16px;
  color: var(--success-color);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-status {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer-status {
    gap: 12px;
  }

  .status-item {
    font-size: var(--font-xs);
  }
}
</style>
