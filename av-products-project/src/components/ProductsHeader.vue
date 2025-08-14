<template>
  <div class="products-header">
    <div class="results-info">
      <span>{{ productCount }} محصول یافت شد</span>
    </div>
    <div class="header-controls">
      <a-button
        v-if="hasActiveFilters"
        type="default"
        danger
        size="middle"
        class="clear-filters-header-btn"
        @click="$emit('clearFilters')"
      >
        پاک کردن همه فیلترها
      </a-button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  productCount: {
    type: Number,
    required: true,
  },
  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["clearFilters"]);
</script>

<style scoped>
.products-header {
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.results-info {
  color: #8c8c8c;
  font-size: 14px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.clear-filters-header-btn {
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-filters-header-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
