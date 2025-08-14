<template>
  <div class="products-container">
    <div class="products-layout">
      <div class="filters-sidebar desktop-only">
        <FilterSidebar
          v-if="!categoriesLoading && !merchantsLoading"
          :category-filter="categoryFilter"
          :merchant-filter="merchantFilter"
          :merchant-search="merchantSearch"
          :categories="categories"
          :merchants="merchants"
          :categories-loading="categoriesLoading"
          :merchants-loading="merchantsLoading"
          @update:category-filter="(value) => (categoryFilter = value)"
          @update:merchant-filter="(value) => (merchantFilter = value)"
          @update:merchant-search="(value) => (merchantSearch = value)"
          @clear-filters="clearFilters"
        />
        <div v-else class="filters-skeleton">
          <a-skeleton active :paragraph="{ rows: 8 }" />
        </div>
      </div>

      <div class="products-content">
        <ProductGrid
          :products="allProducts"
          :loading="productsLoading"
          :has-more-products="hasMoreProducts"
          @load-more="loadMoreProducts"
        />
      </div>
    </div>

    <div class="mobile-filter-toggle">
      <a-button
        type="primary"
        @click="showMobileFilters = true"
        class="filter-toggle-btn"
        size="large"
        shape="circle"
      >
        <filter-outlined />
      </a-button>
      <a-badge
        :count="activeFilterCount"
        :offset="[10, 0]"
        v-if="activeFilterCount > 0"
        class="filter-badge"
      />
    </div>

    <div v-show="showGoToTop" class="go-to-top-button" @click="scrollToTop">
      <a-button
        type="primary"
        class="go-to-top-btn"
        size="large"
        shape="circle"
      >
        <arrow-up-outlined />
      </a-button>
    </div>

    <MobileFilterDrawer
      :open="showMobileFilters"
      :category-filter="categoryFilter"
      :merchant-filter="merchantFilter"
      :merchant-search="merchantSearch"
      :categories="categories"
      :merchants="merchants"
      :categories-loading="categoriesLoading"
      :merchants-loading="merchantsLoading"
      @close="showMobileFilters = false"
      @update:category-filter="(value) => (categoryFilter = value)"
      @update:merchant-filter="(value) => (merchantFilter = value)"
      @update:merchant-search="(value) => (merchantSearch = value)"
      @clear-filters="clearFilters"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { FilterOutlined, ArrowUpOutlined } from "@ant-design/icons-vue";
import { useProductFilters } from "../composables/useProductFilters";
import FilterSidebar from "../components/FilterSidebar.vue";
import MobileFilterDrawer from "../components/MobileFilterDrawer.vue";
import ProductGrid from "../components/ProductGrid.vue";

// Define props for route parameters
const props = defineProps({
  categoryId: {
    type: String,
    default: null,
  },
});

const {
  categories,
  merchants,
  categoriesLoading,
  merchantsLoading,
  productsLoading,
  categoryFilter,
  merchantFilter,
  merchantSearch,
  allProducts,
  activeFilterCount,
  hasMoreProducts,
  clearFilters,
  loadMoreProducts,
  setCategoryFromRoute,
} = useProductFilters(props.categoryId);

const showMobileFilters = ref(false);

const showGoToTop = ref(false);

// Watch for categoryId prop changes
watch(
  () => props.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      setCategoryFromRoute(newCategoryId);
    }
  },
  { immediate: true }
);

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;

  showGoToTop.value = scrollTop > windowHeight;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.products-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.products-layout {
  display: flex;
  gap: 24px;
}

.mobile-filter-toggle {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.filter-toggle-btn {
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1890ff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.filter-toggle-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.filter-toggle-btn:active {
  transform: translateY(0);
}

.go-to-top-button {
  position: fixed;
  bottom: 24px;
  right: 100px;
  z-index: 1000;
  cursor: pointer;
}

.go-to-top-btn {
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #52c41a;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.go-to-top-btn:hover {
  background-color: #73d13d;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.go-to-top-btn:active {
  transform: translateY(0);
}

.filters-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.filters-skeleton {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.desktop-only {
  display: block;
}

.products-content {
  flex: 1;
  min-width: 0;
}

.product-skeleton-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

@media (max-width: 768px) {
  .products-layout {
    flex-direction: column;
  }

  .filters-sidebar {
    width: 100%;
  }

  .desktop-only {
    display: none;
  }

  .mobile-filter-toggle {
    display: flex;
    bottom: 16px;
    right: 16px;
  }

  .go-to-top-button {
    bottom: 16px;
    right: 80px;
  }

  .filter-toggle-btn,
  .go-to-top-btn {
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  .mobile-filter-toggle {
    bottom: 12px;
    right: 12px;
  }

  .go-to-top-button {
    bottom: 12px;
    right: 72px;
  }

  .filter-toggle-btn,
  .go-to-top-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
