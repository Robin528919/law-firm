<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-brand">
        <h1 class="header-title">
          <el-icon class="header-icon"><Document /></el-icon>
          法律文书表单系统
        </h1>
        <p class="header-subtitle">专业的法律文书生成工具 - 支持起诉/损害赔偿、回复表单、和解协议</p>
      </div>
      
      <div class="header-actions">
        <el-tooltip content="系统帮助" placement="bottom">
          <el-button @click="showHelp">
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="导出数据" placement="bottom">
          <el-button @click="exportData">
            <el-icon><Download /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="导入数据" placement="bottom">
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

// 显示帮助信息
const showHelp = () => {
  ElMessageBox.alert(
    '这是一个专业的法律文书表单系统，支持三种类型的法律文书生成：\n\n' +
    '1. 起诉/损害赔偿表单 - 用于劳动法起诉和损害赔偿计算\n' +
    '2. 回复表单 - 用于法庭回复文书\n' +
    '3. 和解协议表单 - 用于和解协议和付款安排\n\n' +
    '系统会自动计算相关的法律金额和日期，并提供专业的表单验证。',
    '系统帮助',
    {
      confirmButtonText: '了解',
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
    
    ElMessage.success('数据导出成功')
  } catch (error) {
    ElMessage.error('导出失败: ' + error.message)
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
        '导入数据将覆盖当前所有表单数据，是否继续？',
        '确认导入',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      formStore.importFormData(data)
      ElMessage.success('数据导入成功')
    } catch (error) {
      ElMessage.error('导入失败: ' + error.message)
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
  max-width: 1200px;
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