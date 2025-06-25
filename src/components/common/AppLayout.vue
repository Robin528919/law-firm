<template>
  <div class="app-container">
    <!-- 应用头部 -->
    <AppHeader />

    <!-- 主内容区域 -->
    <main class="app-main">
      <slot />
    </main>

    <!-- 底部信息 -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<style scoped>
/* 组件特定样式已在main.scss中定义 */
</style> 