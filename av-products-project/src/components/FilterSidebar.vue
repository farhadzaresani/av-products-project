<template>
  <a-card class="filters-card">
    <h2 class="filters-title">فیلترها</h2>

    <div v-if="hasActiveFilters" class="filter-chips-section">
      <h4>فیلترهای فعال</h4>
      <div class="filter-chips">
        <div class="filter-chip">
          <span class="chip-text">همه</span>
          <close-outlined class="chip-close" @click="clearFilters" />
        </div>
        <div
          v-for="categoryId in categoryFilter"
          :key="`cat-${categoryId}`"
          class="filter-chip"
        >
          <span class="chip-text">
            {{ getCategoryName(categoryId) }}
          </span>
          <close-outlined
            class="chip-close"
            @click="removeCategory(categoryId)"
          />
        </div>

        <div
          v-for="merchantId in merchantFilter"
          :key="`merchant-${merchantId}`"
          class="filter-chip"
        >
          <span class="chip-text">
            {{ getMerchantName(merchantId) }}
          </span>
          <close-outlined
            class="chip-close"
            @click="removeMerchant(merchantId)"
          />
        </div>
      </div>
    </div>

    <div class="filter-section">
      <h4>دسته بندی ها</h4>
      <a-spin :spinning="categoriesLoading" size="small">
        <div class="filter-options">
          <div
            v-for="category in categories"
            :key="category.id"
            class="filter-option"
            :class="{
              'filter-option-selected': categoryFilter.includes(
                category.id.toString()
              ),
            }"
            @click="toggleCategory(category.id.toString())"
          >
            {{ category.name }}
          </div>
        </div>
      </a-spin>
    </div>
    <a-divider />
    <div class="filter-section">
      <h4>فروشگاه ها</h4>
      <a-spin :spinning="merchantsLoading" size="small">
        <a-input
          :value="merchantSearch"
          placeholder="جستجوی فروشگاه"
          class="merchant-search"
          size="large"
          allow-clear
          @input="onMerchantSearchChange"
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
        <div class="filter-options">
          <div
            v-for="merchant in filteredMerchants"
            :key="merchant.id"
            class="filter-option"
            :class="{
              'filter-option-selected': merchantFilter.includes(
                merchant.id.toString()
              ),
            }"
            @click="toggleMerchant(merchant.id.toString())"
          >
            {{ merchant.name }}
          </div>
        </div>
      </a-spin>
    </div>
  </a-card>
</template>

<script setup>
import { computed } from "vue";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  categoryFilter: {
    type: Array,
    required: true,
  },
  merchantFilter: {
    type: Array,
    required: true,
  },
  merchantSearch: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  merchants: {
    type: Array,
    required: true,
  },
  categoriesLoading: {
    type: Boolean,
    default: false,
  },
  merchantsLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:categoryFilter",
  "update:merchantFilter",
  "update:merchantSearch",
  "clearFilters",
]);

const filteredMerchants = computed(() => {
  if (!props.merchants || props.merchants.length === 0) {
    return [];
  }
  const searchTerm = props.merchantSearch.toLowerCase();
  return props.merchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(searchTerm)
  );
});

const hasActiveFilters = computed(() => {
  return props.categoryFilter.length > 0 || props.merchantFilter.length > 0;
});

const toggleCategory = (categoryId) => {
  // Single-select logic: if category is already selected, deselect it; otherwise, select it
  if (props.categoryFilter.includes(categoryId)) {
    // Category is already selected, remove it
    emit("update:categoryFilter", []);
  } else {
    // Select new category (replace any existing category)
    emit("update:categoryFilter", [categoryId]);
  }
};

const toggleMerchant = (merchantId) => {
  const newFilter = [...props.merchantFilter];
  const index = newFilter.indexOf(merchantId);

  if (index > -1) {
    newFilter.splice(index, 1);
  } else {
    newFilter.push(merchantId);
  }

  emit("update:merchantFilter", newFilter);
};

const onMerchantSearchChange = (event) => {
  emit("update:merchantSearch", event.target.value);
};

const clearFilters = () => {
  emit("clearFilters");
};

const getCategoryName = (categoryId) => {
  const category = props.categories.find(
    (cat) => cat.id.toString() === categoryId
  );
  return category ? category.name : categoryId;
};

const getMerchantName = (merchantId) => {
  const merchant = props.merchants.find(
    (merch) => merch.id.toString() === merchantId
  );
  return merchant ? merchant.name : merchantId;
};

const removeCategory = (categoryId) => {
  // For single-select, just clear the category filter
  emit("update:categoryFilter", []);
};

const removeMerchant = (merchantId) => {
  const newFilter = props.merchantFilter.filter((id) => id !== merchantId);
  emit("update:merchantFilter", newFilter);
};
</script>

<style scoped>
.filters-card {
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}

.filters-title {
  font-size: 1.2em;
  font-weight: 600;
  color: #262626;
  margin-bottom: 1em;
}

.filter-chips-section {
  margin-bottom: 24px;
}

.filter-chips-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

.filter-chip {
  display: flex;
  align-items: center;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 16px;
  padding: 4px 12px;
  gap: 4px;
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
}

.filter-chip .chip-text {
  white-space: nowrap;
}

.filter-chip .chip-close {
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
  transition: color 0.2s ease;
}

.filter-chip .chip-close:hover {
  color: #40a9ff;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.merchant-search {
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* max-height: 300px; */
  overflow-y: auto;
}

.filter-option {
  padding: 4px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #666;
  border: none;
  background: none;
  text-align: right;
  width: 100%;
}

.filter-option:hover {
  color: #1890ff;
}

.filter-option-selected {
  color: #000000;
  font-weight: 600;
}

.filter-option-selected:hover {
  color: #40a9ff;
}

.filters-card::-webkit-scrollbar,
.filter-options::-webkit-scrollbar {
  width: 6px;
}

.filters-card::-webkit-scrollbar-track,
.filter-options::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.filters-card::-webkit-scrollbar-thumb,
.filter-options::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.filters-card::-webkit-scrollbar-thumb:hover,
.filter-options::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
