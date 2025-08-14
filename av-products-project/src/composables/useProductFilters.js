import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useProductFilters() {
  const route = useRoute();
  const router = useRouter();

  const categories = ref([]);
  const merchants = ref([]);
  const allProducts = ref([]);

  const categoriesLoading = ref(false);
  const merchantsLoading = ref(false);
  const productsLoading = ref(false);

  const currentPage = ref(0);
  const pageSize = ref(10);
  const hasMoreProducts = ref(true);
  const totalProducts = ref(0);

  const categoryFilter = ref([]);
  const merchantFilter = ref([]);
  const merchantSearch = ref("");

  const fetchCategories = async () => {
    try {
      categoriesLoading.value = true;
      const response = await fetch(
        "https://interview-api.azkivam.com/api/v1/categories"
      );
      if (response.ok) {
        const data = await response.json();
        categories.value = data.data || data;
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      categoriesLoading.value = false;
    }
  };

  const fetchMerchants = async () => {
    try {
      merchantsLoading.value = true;
      const response = await fetch(
        "https://interview-api.azkivam.com/api/v1/merchants"
      );
      if (response.ok) {
        const data = await response.json();
        merchants.value = data.data || data;
      } else {
        console.error("Failed to fetch merchants");
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
    } finally {
      merchantsLoading.value = false;
    }
  };

  const fetchProducts = async (page = 0, append = false) => {
    try {
      console.log("fetchProducts called", { page, append });
      productsLoading.value = true;

      const requestBody = {};

      if (categoryFilter.value.length > 0) {
        requestBody.categoryIds = categoryFilter.value.map((id) =>
          parseInt(id)
        );
      }

      if (merchantFilter.value.length > 0) {
        requestBody.merchantIds = merchantFilter.value.map((id) =>
          parseInt(id)
        );
      }

      const response = await fetch(
        `https://interview-api.azkivam.com/api/v1/products?size=${pageSize.value}&page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const newProducts = data.data || data.content || [];

        if (append) {
          allProducts.value = [...allProducts.value, ...newProducts];
          console.log(
            "Appended products, total now:",
            allProducts.value.length
          );
        } else {
          allProducts.value = newProducts;
        }

        totalProducts.value =
          data.totalElements || data.total || newProducts.length;

        if (data.totalElements !== undefined) {
          const totalLoaded = page * pageSize.value + newProducts.length;
          hasMoreProducts.value = totalLoaded < data.totalElements;
        } else if (data.total !== undefined) {
          const totalLoaded = page * pageSize.value + newProducts.length;
          hasMoreProducts.value = totalLoaded < data.total;
        } else {
          hasMoreProducts.value = newProducts.length === pageSize.value;
        }

        currentPage.value = page;

        console.log("Pagination updated:", {
          totalProducts: totalProducts.value,
          hasMoreProducts: hasMoreProducts.value,
          currentPage: currentPage.value,
          pageSize: pageSize.value,
          newProductsCount: newProducts.length,
          totalLoaded: page * pageSize.value + newProducts.length,
        });
      } else {
        console.error(
          "Failed to fetch products:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      productsLoading.value = false;
    }
  };

  const loadMoreProducts = async () => {
    console.log("loadMoreProducts called", {
      productsLoading: productsLoading.value,
      hasMoreProducts: hasMoreProducts.value,
      currentPage: currentPage.value,
    });

    if (productsLoading.value || !hasMoreProducts.value) {
      console.log("loadMoreProducts blocked:", {
        reason: productsLoading.value ? "already loading" : "no more products",
      });
      return;
    }

    const nextPage = currentPage.value + 1;
    console.log("Loading next page:", nextPage);
    await fetchProducts(nextPage, true);
  };

  const resetAndFetchProducts = async () => {
    currentPage.value = 0;
    hasMoreProducts.value = true;
    allProducts.value = [];
    await fetchProducts(0, false);
  };

  const activeFilterCount = computed(() => {
    return categoryFilter.value.length + merchantFilter.value.length;
  });

  watch([categoryFilter, merchantFilter], () => {
    console.log("Filters changed, refetching products");
    resetAndFetchProducts();
  });

  const clearFilters = () => {
    categoryFilter.value = [];
    merchantFilter.value = [];
    merchantSearch.value = "";
  };

  onMounted(async () => {
    await Promise.all([fetchCategories(), fetchMerchants()]);
    await fetchProducts(0, false);
  });

  return {
    categories,
    merchants,
    allProducts,

    categoriesLoading,
    merchantsLoading,
    productsLoading,

    currentPage,
    pageSize,
    hasMoreProducts,
    totalProducts,

    categoryFilter,
    merchantFilter,
    merchantSearch,

    activeFilterCount,

    fetchCategories,
    fetchMerchants,
    fetchProducts,
    loadMoreProducts,
    resetAndFetchProducts,
    clearFilters,
  };
}
