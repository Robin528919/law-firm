<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-brand">
        <h1 class="header-title">
          <el-icon class="header-icon"><Document /></el-icon>
          Jack Law Sample Generator
        </h1>
      </div>
      
      <div class="header-actions">
        <el-tooltip content="System Help" placement="bottom">
          <el-button @click="showHelp">
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Export Data" placement="bottom">
          <el-button @click="exportData">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Import Data" placement="bottom">
          <el-button @click="importData">
            <el-icon><Upload /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, QuestionFilled, Download, Upload } from '@element-plus/icons-vue'
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()

// Display help information
const showHelp = () => {
  ElMessageBox.alert(
    'This is a professional legal document form system that supports three types of legal document generation:\n\n' +
    '1. Complaint/Damages Form - For labor law complaints and damage calculations\n' +
    '2. Answer Form - For court reply documents\n' +
    '3. Settlement Agreement Form - For settlement agreements and payment arrangements\n\n' +
    'The system automatically calculates relevant legal amounts and dates, and provides professional form validation.',
    'System Help',
    {
      confirmButtonText: 'Got it',
      type: 'info',
      customStyle: { width: '500px' }
    }
  )
}

// 导出表单数据
const exportData = () => {
  try {
    const data = formStore.exportFormData()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `legal-forms-data-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('Data exported successfully')
  } catch (error) {
    ElMessage.error('Export failed: ' + error.message)
  }
}

// 导入表单数据
const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      await ElMessageBox.confirm(
        'Importing data will overwrite all current form data. Do you want to continue?',
        'Confirm Import',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      
      formStore.importFormData(data)
      ElMessage.success('Data imported successfully')
    } catch (error) {
      ElMessage.error('Import failed: ' + error.message)
    }
  }
  
  input.click()
}
</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.header-brand {
  flex: 1;
}

.header-icon {
  margin-right: 12px;
  font-size: 28px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-actions .el-button {
  color: var(--text-secondary);
}

.header-actions .el-button:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
  }
}
</style> 