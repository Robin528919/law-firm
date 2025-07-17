<template>
  <!-- 测试数据工具 -->
  <FormGroup
      v-if="showTestData"
      title="Development Tools"
      description="Testing utilities for development"
      icon="DocumentCopy"
      variant="warning"
      :columns="1"
  >
    <el-button
        type="warning"
        @click="fillTestData"
        :loading="isLoading"
        style="width: 100%"
    >
      <el-icon style="vertical-align: middle; margin-right: 4px;">
        <DocumentCopy />
      </el-icon>
      Fill Test Data
    </el-button>
    <div class="field-description">
      Automatically fill the form with test data for development purposes
      <br>Form: {{ formName }} | Environment: {{ environment }} | Debug Mode: {{ debugMode }}
    </div>
  </FormGroup>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormGroup from '@/components/common/FormGroup.vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { API_CONFIG } from '@/utils/constants'

// Props 定义
const props = defineProps({
  // 测试数据对象
  testData: {
    type: Object,
    required: true
  },
  // 表单数据对象
  formData: {
    type: Object,
    required: true
  },
  // 更新字段的方法
  updateField: {
    type: Function,
    required: true
  },
  // 表单名称
  formName: {
    type: String,
    required: true
  },
  // 排除字段（不填充的字段）
  excludeFields: {
    type: Array,
    default: () => ['ExecutedDate']
  },
  // 特殊字段处理器
  specialHandlers: {
    type: Object,
    default: () => ({})
  }
})

// 响应式数据
const isLoading = ref(false)

// 环境信息
const environment = computed(() => API_CONFIG.ENVIRONMENT)
const debugMode = computed(() => API_CONFIG.DEBUG)
const showTestData = computed(() => API_CONFIG.SHOW_TEST_DATA)

// 通用测试数据填充方法
const fillTestData = async () => {
  try {
    isLoading.value = true
    console.log(`开始填充 ${props.formName} 表单测试数据...`)
    
    // 1. 填充普通字段
    Object.keys(props.testData).forEach(key => {
      // 跳过排除字段和不存在的字段
      if (props.excludeFields.includes(key)) {
        console.log(`跳过排除字段: ${key}`)
        return
      }
      
      if (!Object.prototype.hasOwnProperty.call(props.formData, key)) {
        console.log(`字段 ${key} 在表单数据中不存在，跳过`)
        return
      }
      
      // 检查是否有特殊处理器
      if (props.specialHandlers[key]) {
        console.log(`使用特殊处理器处理字段: ${key}`)
        props.specialHandlers[key](props.testData[key])
      } else {
        // 普通字段填充
        console.log(`填充字段 ${key}: ${props.testData[key]}`)
        props.updateField(key, props.testData[key])
      }
    })
    
    // 2. 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log(`${props.formName} 表单测试数据填充完成`)
  } catch (error) {
    console.error('填充测试数据时出错:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.field-description {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}
</style>
