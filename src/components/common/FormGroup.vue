<template>
  <div class="form-group" :class="groupClasses">
    <!-- 分组头部 -->
    <div class="group-header" @click="toggleCollapse" v-if="collapsible">
      <div class="group-title-content">
        <div class="group-title">
          <el-icon class="title-icon" v-if="icon">
            <component :is="icon" />
          </el-icon>
          <span>{{ title }}</span>
          <el-tag v-if="badge" :type="badgeType" size="small" class="group-badge">
            {{ badge }}
          </el-tag>
        </div>
        <div v-if="description" class="group-description">{{ description }}</div>
      </div>
      <el-icon class="collapse-icon" :class="{ 'is-collapsed': isCollapsed }">
        <ArrowDown />
      </el-icon>
    </div>

    <!-- 非折叠头部 -->
    <div v-else class="group-header-static">
      <div class="group-title">
        <el-icon class="title-icon" v-if="icon">
          <component :is="icon" />
        </el-icon>
        <span>{{ title }}</span>
        <el-tag v-if="badge" :type="badgeType" size="small" class="group-badge">
          {{ badge }}
        </el-tag>
      </div>
      <div v-if="description" class="group-description">{{ description }}</div>
    </div>

    <!-- 分组内容 -->
    <el-collapse-transition>
      <div v-show="!isCollapsed" class="group-content">
        <div class="group-grid" :style="gridStyle">
          <slot />
        </div>
        
        <!-- 分组底部操作 -->
        <div v-if="hasActions" class="group-actions">
          <slot name="actions" />
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  // 基础属性
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: [String, Object], default: null },
  
  // 徽章
  badge: { type: String, default: '' },
  badgeType: { type: String, default: 'info' },
  
  // 折叠功能
  collapsible: { type: Boolean, default: false },
  defaultCollapsed: { type: Boolean, default: false },
  
  // 布局属性
  columns: { type: Number, default: 2 },
  gap: { type: String, default: '24px' },
  
  // 样式变体
  variant: { type: String, default: 'default' }, // default, bordered, card
  
  // 状态
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

// 事件定义
const emit = defineEmits(['collapse', 'expand'])

// 响应式状态
const isCollapsed = ref(props.defaultCollapsed)
const slots = useSlots()

// 计算属性
const groupClasses = computed(() => ({
  'is-collapsible': props.collapsible,
  'is-collapsed': isCollapsed.value,
  'is-disabled': props.disabled,
  'is-loading': props.loading,
  [`variant-${props.variant}`]: true
}))

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  gap: props.gap,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr'
  }
}))

const hasActions = computed(() => {
  return !!slots.actions
})

// 方法
const toggleCollapse = () => {
  if (!props.collapsible) return
  
  isCollapsed.value = !isCollapsed.value
  
  if (isCollapsed.value) {
    emit('collapse')
  } else {
    emit('expand')
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 默认样式 */
.variant-default {
  background: transparent;
}

.variant-default .group-title {
  font-size: var(--font-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
}

.variant-default .group-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: var(--primary-color);
  margin-right: var(--spacing-md);
  border-radius: var(--radius-sm);
}

/* 边框样式 */
.variant-bordered {
  border: 1px solid var(--border);
  background: var(--background);
}

.variant-bordered .group-header,
.variant-bordered .group-header-static {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--background-light);
  border-bottom: 1px solid var(--border);
}

.variant-bordered .group-content {
  padding: var(--spacing-xl);
}

/* 卡片样式 */
.variant-card {
  background: var(--background);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.variant-card .group-header,
.variant-card .group-header-static {
  padding: var(--spacing-lg) var(--spacing-xl);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
}

.variant-card .group-title {
  color: white;
  border-bottom: none;
  margin-bottom: 0;
}

.variant-card .group-title::before {
  background: rgba(255, 255, 255, 0.8);
}

.variant-card .group-description {
  color: rgba(255, 255, 255, 0.9);
  margin-top: var(--spacing-sm);
}

.variant-card .group-content {
  padding: var(--spacing-xl);
}

/* 头部样式 */
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.group-header:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.group-header-static {
  cursor: default;
}

.group-title-content {
  flex: 1;
}

.group-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  font-size: 18px;
  color: var(--primary-color);
}

.variant-card .title-icon {
  color: rgba(255, 255, 255, 0.9);
}

.group-badge {
  margin-left: var(--spacing-sm);
}

.group-description {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  line-height: 1.5;
}

.collapse-icon {
  font-size: 16px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.collapse-icon.is-collapsed {
  transform: rotate(-90deg);
}

.variant-card .collapse-icon {
  color: rgba(255, 255, 255, 0.8);
}

/* 内容区域 */
.group-content {
  min-height: 0; /* 允许收缩 */
}

.group-grid {
  margin-bottom: var(--spacing-lg);
}

/* 响应式网格 */
@media (max-width: 768px) {
  .group-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .variant-bordered .group-header,
  .variant-bordered .group-header-static,
  .variant-bordered .group-content,
  .variant-card .group-header,
  .variant-card .group-header-static,
  .variant-card .group-content {
    padding: var(--spacing-md);
  }
}

/* 操作区域 */
.group-actions {
  border-top: 1px solid var(--border-light);
  padding-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* 状态样式 */
.is-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.is-loading {
  position: relative;
}

.is-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

/* 动画效果 */
.group-header {
  transition: all 0.2s ease;
}

.group-content {
  transition: all 0.3s ease;
}

/* Element Plus 动画样式覆盖 */
:deep(.el-collapse-transition) {
  transition: height 0.3s ease;
}
</style> 