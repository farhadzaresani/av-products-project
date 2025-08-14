<template>
  <a-card class="product-card">
    <template #cover>
      <div v-if="!product.image" class="placeholder-image">
        <picture-outlined class="placeholder-icon" />
      </div>
      <div v-else class="image-container">
        <img :alt="product.name" :src="product.imageUrl" />
      </div>
    </template>

    <a-card-meta :title="product.name" class="product-name" />
    <div class="product-price">
      <span class="price-description">شروع قیمت از</span>

      <p class="price-amount">
        <span>{{ product.minPrice }}</span>
        <span class="price-unit">تومان</span>
      </p>
    </div>
  </a-card>
</template>

<script setup>
import { PictureOutlined } from "@ant-design/icons-vue";

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.product-card {
  height: 100%;
  overflow: hidden;
  border-radius: 0 !important;
  box-shadow: none !important;

  justify-content: space-between;
}

.product-card:hover {
  box-shadow: none !important;
  transform: none !important;
}

.image-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.placeholder-image {
  height: 200px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 48px;
  color: #d9d9d9;
}

.product-name {
  display: flex;
  align-items: start;
  justify-content: start;
  font-size: 1em;
  font-weight: 600;
  min-height: 5em;
  max-height: 5em;
  margin-bottom: 3em;
}

.product-price {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}

.price-amount {
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  align-items: start;
  gap: 4px;
}
.price-unit {
  margin-top: 0.5em;
  font-size: 0.5em;
  font-weight: 400;
}
.price-description {
  font-size: 0.8em;
  font-weight: 500;
  color: #666;
}

:deep(.ant-card-actions) {
  background: #fafafa;
}

:deep(.ant-card-meta-title) {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  font-weight: 400 !important;
}

:deep(.ant-card-meta-description) {
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}
</style>
