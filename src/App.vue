<script setup>
// 主应用组件 - 法律事务所动态表单系统
import { ref, onMounted } from 'vue'
import { Document, Collection, Hide } from '@element-plus/icons-vue'
import DynamicForm from './components/DynamicForm.vue'
import FormTemplateManager from './components/FormTemplateManager.vue'
import formConfigData from './config/formConfig.json'
import autoSuffixDemo from './config/autoSuffixDemo.json'
import allFormsConfig from './config/allFormsConfig.json'

// 响应式数据
const formConfig = ref({}) // 表单配置
const loading = ref(true) // 加载状态
const currentFormData = ref({}) // 当前表单数据
const showTemplateManager = ref(false) // 是否显示模板管理器
const configType = ref('main') // 配置类型：'main'、'demo' 或 'forms'
const selectedFormType = ref('complaintDamages') // 选中的表单类型，默认为投诉/损害赔偿

// 表单选项
const formOptions = [
  { value: 'complaintDamages', label: 'Complaint/Damages (投诉/损害赔偿)' },
  { value: 'mcReAnswer', label: 'M&C RE Answer (关于答辩的动议和会议)' },
  { value: 'settlementAgreement', label: 'Settlement Agreement (Payments) (和解协议-付款)' }
]

// 初始化表单配置
const initFormConfig = () => {
  try {
    if (configType.value === 'main') {
      formConfig.value = formConfigData
    } else if (configType.value === 'demo') {
      formConfig.value = autoSuffixDemo
    } else if (configType.value === 'forms') {
      // 从统一配置中获取选中的表单配置
      const selectedForm = allFormsConfig.forms[selectedFormType.value]
      if (selectedForm) {
        formConfig.value = { formConfig: selectedForm }
      } else {
        throw new Error(`未找到表单配置: ${selectedFormType.value}`)
      }
    }
    loading.value = false
    console.log('表单配置加载成功:', formConfig.value)
  } catch (error) {
    console.error('加载表单配置失败:', error)
    loading.value = false
  }
}

// 切换配置类型
const switchConfig = (type) => {
  configType.value = type
  loading.value = true
  currentFormData.value = {} // 清空当前表单数据
  setTimeout(() => {
    initFormConfig()
  }, 100)
}

// 切换表单类型
const switchFormType = (formType) => {
  selectedFormType.value = formType
  loading.value = true
  currentFormData.value = {} // 清空当前表单数据
  setTimeout(() => {
    initFormConfig()
  }, 100)
}

// 处理表单提交
const handleFormSubmit = (formData) => {
  console.log('表单提交数据:', formData)
  // 这里可以添加提交到后端的逻辑
}

// 处理表单数据变化
const handleFormChange = (formData) => {
  console.log('表单数据变化:', formData)
  currentFormData.value = formData
  // 这里可以添加实时保存或其他逻辑
}

// 处理模板加载
const handleTemplateLoad = (templateData) => {
  console.log('加载模板数据:', templateData)
  // 这里需要将模板数据传递给DynamicForm组件
  // 可以通过重新初始化表单或者提供一个方法来更新表单数据
  location.reload() // 临时解决方案，实际应该有更优雅的方式
}

// 切换模板管理器显示状态
const toggleTemplateManager = () => {
  showTemplateManager.value = !showTemplateManager.value
}

// 组件挂载时初始化
onMounted(() => {
  // 默认使用新的表单系统
  configType.value = 'forms'
  initFormConfig()
})
</script>

<template>
  <!-- 主应用模板 -->
  <div class="app">
    <!-- 应用头部 -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">
          <el-icon class="title-icon"><Document /></el-icon>
          法律事务所动态表单系统
        </h1>
        <p class="app-subtitle">基于 Vue 3 + Element Plus 的智能表单解决方案</p>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container" v-loading="loading" element-loading-text="正在加载表单配置..." element-loading-background="rgba(0, 0, 0, 0.8)">
        <div style="height: 200px;"></div>
      </div>

      <!-- 动态表单 -->
       <div v-else-if="formConfig.formConfig" class="form-container">
         <!-- 表单操作工具栏 -->
         <div class="form-toolbar">
           <div class="toolbar-left">
             <!-- 表单类型选择 -->
             <div v-if="configType === 'forms'" class="form-selector">
               <el-select
                 v-model="selectedFormType"
                 @change="switchFormType"
                 placeholder="选择表单类型"
                 style="width: 300px;"
               >
                 <el-option
                   v-for="option in formOptions"
                   :key="option.value"
                   :label="option.label"
                   :value="option.value"
                 />
               </el-select>
             </div>
             
             <!-- 配置类型切换 -->
             <el-button-group class="config-switcher">
               <el-button
                 :type="configType === 'forms' ? 'primary' : ''"
                 @click="switchConfig('forms')"
               >
                 表单系统
               </el-button>
               <el-button
                 :type="configType === 'main' ? 'primary' : ''"
                 @click="switchConfig('main')"
               >
                 Main Form
               </el-button>
               <el-button
                 :type="configType === 'demo' ? 'primary' : ''"
                 @click="switchConfig('demo')"
               >
                 Auto Suffix Demo
               </el-button>
             </el-button-group>
           </div>
           
           <div class="toolbar-right">
             <el-button-group>
               <el-button
                 type="info"
                 :icon="showTemplateManager ? Hide : Collection"
                 @click="toggleTemplateManager"
               >
                 {{ showTemplateManager ? 'Hide' : 'Show' }} Template Manager
               </el-button>
             </el-button-group>
           </div>
         </div>

         <!-- 模板管理器 -->
         <div v-if="showTemplateManager" class="template-manager-section">
           <FormTemplateManager
             :form-data="currentFormData"
             :form-config="formConfig.formConfig"
             @load-template="handleTemplateLoad"
           />
         </div>

         <!-- 动态表单 -->
         <DynamicForm
           :config="formConfig.formConfig"
           @submit="handleFormSubmit"
           @change="handleFormChange"
         />
       </div>

       <!-- 错误状态 -->
       <div v-else class="error-container">
         <el-alert
           title="配置加载失败"
           description="无法加载表单配置，请检查配置文件是否正确。"
           type="error"
           show-icon
         />
       </div>
    </main>

    <!-- 应用底部 -->
    <footer class="app-footer">
      <p>&copy; 2024 法律事务所动态表单系统. 基于 Vue 3 + Element Plus 开发</p>
    </footer>
  </div>
</template>

<style scoped>
/* 全局样式 */
:global(html, body) {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #FFFFFF; /* Figma 背景色 */
  font-family: 'Inter', sans-serif; /* Figma 字体 */
}

/* 主应用样式 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

/* 应用头部样式 */
.app-header {
  background: #FFFFFF;
  color: #1E1E1E;
  padding: 24px 0;
  border-bottom: 1px solid #D9D9D9;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px; /* 调整内边距 */
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1E1E1E;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 2rem;
  color: #1E1E1E;
}

.app-subtitle {
  font-size: 1rem;
  color: #606266;
  margin: 0;
  font-weight: 400;
}

/* 主要内容区域样式 */
.app-main {
  flex: 1;
  padding: 32px 24px; /* 调整内边距 */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.loading-container {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 8px; /* 调整圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 调整阴影 */
}

.form-container {
  width: 100%;
  max-width: 960px;
  background: #ffffff;
  border-radius: 8px; /* Figma 圆角 */
  border: 1px solid #D9D9D9; /* Figma 边框 */
  overflow: hidden;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 应用底部样式 */
.app-footer {
  background: #FFFFFF;
  color: #B3B3B3;
  text-align: center;
  padding: 24px;
  margin-top: auto;
  border-top: 1px solid #D9D9D9;
}

.app-footer p {
  margin: 0;
  font-size: 0.85rem; /* 调整字体大小 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-title {
    font-size: 1.8rem; /* 调整字体大小 */
    flex-direction: column;
    gap: 8px; /* 调整间距 */
  }

  .title-icon {
    font-size: 1.8rem; /* 调整图标大小 */
  }

  .app-subtitle {
    font-size: 0.9rem; /* 调整字体大小 */
  }

  .app-main {
    padding: 24px 16px; /* 调整内边距 */
  }

  .form-container {
    margin: 0;
    border-radius: 6px; /* 调整圆角 */
    max-width: 100%;
  }

  .app-header {
    padding: 16px 0; /* 调整内边距 */
  }

  .header-content {
    padding: 0 16px; /* 调整内边距 */
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 1.6rem; /* 调整字体大小 */
  }

  .header-content {
    padding: 0 12px; /* 调整内边距 */
  }

  .app-main {
    padding: 16px 8px; /* 调整内边距 */
  }

  .form-container {
    border-radius: 4px; /* 调整圆角 */
  }

  .app-footer {
    padding: 16px 12px; /* 调整内边距 */
  }

  .app-footer p {
    font-size: 0.75rem; /* 调整字体大小 */
  }
}

@media (max-width: 360px) {
  .app-title {
    font-size: 1.4rem; /* 调整字体大小 */
  }

  .app-subtitle {
    font-size: 0.8rem; /* 调整字体大小 */
  }

  .app-main {
    padding: 12px 4px; /* 调整内边距 */
  }

  .header-content {
    padding: 0 8px; /* 调整内边距 */
  }
}

/* 表单工具栏样式 */
.form-toolbar {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.form-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-selector::before {
  content: "表单类型:";
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
}

.config-switcher {
  margin-left: 16px;
}

/* 模板管理器区域样式 */
.template-manager-section {
  margin-bottom: 20px;
  padding: 0 20px;
}

/* 响应式调整 */
 @media (max-width: 768px) {
   .form-toolbar {
     margin: 0 0 20px 0;
     padding: 10px 15px;
     border-radius: 6px;
     flex-direction: column;
     gap: 15px;
   }

   .toolbar-left {
     width: 100%;
     justify-content: center;
     flex-direction: column;
     gap: 12px;
   }

   .toolbar-right {
     width: 100%;
     justify-content: center;
   }

   .form-selector {
     width: 100%;
     justify-content: center;
   }

   .form-selector .el-select {
     width: 100% !important;
     max-width: 280px;
   }

   .config-switcher {
     margin-left: 0;
   }

   .template-manager-section {
     margin: 0 0 20px 0;
     padding: 0 15px;
   }
 }

 @media (max-width: 480px) {
   .form-toolbar {
     padding: 8px 12px;
     margin-bottom: 15px;
   }

   .template-manager-section {
     padding: 0 12px;
     margin-bottom: 15px;
   }

   .form-toolbar .el-button-group .el-button {
     font-size: 13px;
     padding: 6px 12px;
   }
 }

 /* 错误容器样式 */
 .error-container {
   max-width: 600px;
   margin: 50px auto;
   padding: 20px;
 }

 /* 加载容器样式 */
 .loading-container {
   min-height: 300px;
   position: relative;
 }
</style>
