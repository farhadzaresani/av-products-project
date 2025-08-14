<script setup>
import { ShoppingOutlined } from "@ant-design/icons-vue";
</script>

<template>
  <div id="app" dir="rtl">
    <a-layout>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped>
.header {
  background: #001529;
  padding: 0;
  height: 64px;
  line-height: 64px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.menu {
  background: transparent;
  border: none;
  line-height: 64px;
}

.menu :deep(.ant-menu-item) {
  color: white;
}

.menu :deep(.ant-menu-item a) {
  color: white;
  text-decoration: none;
}

.content {
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
}
</style>
