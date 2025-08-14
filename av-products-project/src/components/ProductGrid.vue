<template>
  <div class="product-grid">
    <a-row :gutter="[0, 0]">
      <a-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        v-for="product in products"
        :key="product.id"
      >
        <ProductCard :product="product" />
        <div v-if="!!productsLoading" class="products-skeleton">
          <div class="skeleton-grid">
            <a-skeleton
              v-for="i in 8"
              :key="i"
              active
              :paragraph="{ rows: 3 }"
              class="product-skeleton-item"
            />
          </div>
        </div>
      </a-col>
    </a-row>

    <div v-if="!hasMoreProducts && products.length > 0" class="end-of-products">
      <a-divider>شما به انتهای همه محصولات رسیده‌اید</a-divider>
    </div>

    <div v-if="products.length === 0 && !loading" class="no-results">
      <a-empty description="هیچ محصولی با فیلترهای شما مطابقت ندارد" />
    </div>

    <div
      v-if="hasMoreProducts && !loading && products.length > 0"
      ref="scrollTarget"
      class="scroll-target"
    >
      <div class="scroll-target-content">
        <div>در حال بارگذاری محصولات بیشتر...</div>
        <a-button
          type="primary"
          size="small"
          class="test-button"
          @click="testLoadMore"
        >
          بارگذاری دستی
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMoreProducts: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["loadMore"]);

const scrollTarget = ref(null);
let observer = null;

const testLoadMore = () => {
  console.log("Manual test button clicked");
  emit("loadMore");
};

const createObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && props.hasMoreProducts && !props.loading) {
        console.log("Intersection detected - loading more products");
        emit("loadMore");
      }
    },
    {
      rootMargin: "200px", 
      threshold: 0.1,
    }
  );
};

const startObserving = () => {
  if (!scrollTarget.value || !props.hasMoreProducts || props.loading) {
    console.log("Cannot start observing:", {
      scrollTarget: !!scrollTarget.value,
      hasMoreProducts: props.hasMoreProducts,
      loading: props.loading,
    });
    return;
  }

  console.log("Starting to observe scroll target");
  createObserver();
  observer.observe(scrollTarget.value);
};

// Stop observing
const stopObserving = () => {
  if (observer) {
    console.log("Stopping observation");
    observer.disconnect();
    observer = null;
  }
};

watch(
  () => [props.hasMoreProducts, props.loading, props.products.length],
  async ([hasMore, loading, productCount]) => {
    await nextTick();
    console.log("Watch triggered:", { hasMore, loading, productCount });

    if (hasMore && !loading && productCount > 0) {
      console.log("Conditions met - starting observation");
      startObserving();
    } else {
      console.log("Conditions not met - stopping observation");
      stopObserving();
    }
  },
  { immediate: true }
);

onMounted(() => {
  console.log("ProductGrid mounted");
  nextTick(() => {
    if (props.hasMoreProducts && !props.loading && props.products.length > 0) {
      startObserving();
    }
  });
});

onUnmounted(() => {
  stopObserving();
});
</script>

<style scoped>
.product-grid {
  background: white;
  border: 2px solid #d9d9d9;
  border-radius: 16px !important;
  overflow: hidden;
}

.loading-more {
  margin-top: 32px;
  text-align: center;
  padding: 24px;
}

.end-of-products {
  margin-top: 32px;
  text-align: center;
  padding: 16px;
  color: #8c8c8c;
}

.scroll-target {
  height: 100px;
  margin-top: 20px;
  background: #f0f0f0;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  font-size: 14px;
}

.scroll-target-content {
  text-align: center;
}

.test-button {
  margin-top: 16px;
  text-align: center;
}

.no-results {
  background: white;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.initial-loading {
  background: white;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.loading-text {
  margin-top: 16px;
  color: #8c8c8c;
  font-size: 14px;
}
</style>
