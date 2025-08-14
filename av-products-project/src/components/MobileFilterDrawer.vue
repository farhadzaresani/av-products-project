<template>
  <a-drawer
    title="فیلترها"
    placement="right"
    :open="open"
    width="280px"
    @close="$emit('close')"
    class="mobile-filters-drawer"
  >
    <div v-if="hasActiveFilters" class="filter-chips-section">
      <h4>فیلترهای فعال</h4>
      <div class="filter-chips">
        <div class="filter-chip">
          <span class="chip-text">همه</span>
          <close-outlined class="chip-close" @click="$emit('clearFilters')" />
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

    <div class="mobile-filters-content">
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
            <template #suffix>
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
    </div>
  </a-drawer>
</template>

<script setup>
import { computed } from "vue";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
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
  "close",
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
  const newFilter = [...props.categoryFilter];
  const index = newFilter.indexOf(categoryId);

  if (index > -1) {
    newFilter.splice(index, 1);
  } else {
    newFilter.push(categoryId);
  }

  emit("update:categoryFilter", newFilter);
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
  const newFilter = props.categoryFilter.filter((id) => id !== categoryId);
  emit("update:categoryFilter", newFilter);
};

const removeMerchant = (merchantId) => {
  const newFilter = props.merchantFilter.filter((id) => id !== merchantId);
  emit("update:merchantFilter", newFilter);
};
</script>

<style scoped>
.filter-chips-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-chips-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  text-align: right;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f0f8ff;
  border: 1px solid #d6e4ff;
  border-radius: 16px;
  font-size: 13px;
  color: #1890ff;
  cursor: default;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background-color: #e6f4ff;
  border-color: #91caff;
}

.chip-text {
  font-weight: 500;
}

.chip-close {
  cursor: pointer;
  font-size: 12px;
  color: #8c8c8c;
  transition: color 0.2s ease;
}

.chip-close:hover {
  color: #ff4d4f;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 1.5em 0 1em 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  text-align: right;
}

.merchant-search {
  margin-bottom: 12px;
}

.merchant-search :deep(.ant-input) {
  text-align: right;
  direction: rtl;
}

.merchant-search :deep(.ant-input::placeholder) {
  text-align: right;
  direction: rtl;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  padding: 6px 0;
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
  color: #000000;
}

.mobile-filters-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-apply-btn {
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 0;
  background: #ffffff;
}

.mobile-clear-filters {
  margin: 16px 0;
}

.clear-filters-btn {
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.ant-drawer-header) {
  text-align: right;
}

:deep(.ant-drawer-title) {
  text-align: right;
}
</style>
