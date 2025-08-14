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

  const isUpdatingURL = ref(false); // Flag to prevent infinite loops

  // Initialize filters from URL query parameters
  const initializeFiltersFromURL = () => {
    const { categories: urlCategories, merchants: urlMerchants } = route.query;

    if (urlCategories) {
      // Handle comma-separated string format
      const categoryArray =
        typeof urlCategories === "string"
          ? urlCategories.split(",").filter((id) => id && id !== "")
          : Array.isArray(urlCategories)
          ? urlCategories.filter((id) => id && id !== "")
          : [urlCategories].filter((id) => id && id !== "");
      categoryFilter.value = categoryArray;
    }

    if (urlMerchants) {
      // Handle comma-separated string format
      const merchantArray =
        typeof urlMerchants === "string"
          ? urlMerchants.split(",").filter((id) => id && id !== "")
          : Array.isArray(urlMerchants)
          ? urlMerchants.filter((id) => id && id !== "")
          : [urlMerchants].filter((id) => id && id !== "");
      merchantFilter.value = merchantArray;
    }
  };

  // Update URL with current filter values
  const updateURLWithFilters = () => {
    isUpdatingURL.value = true; // Set flag to true
    const query = { ...route.query };

    if (categoryFilter.value.length > 0) {
      // Store as comma-separated string
      query.categories = categoryFilter.value.join(",");
    } else {
      delete query.categories;
    }

    if (merchantFilter.value.length > 0) {
      // Store as comma-separated string
      query.merchants = merchantFilter.value.join(",");
    } else {
      delete query.merchants;
    }

    // Remove page from URL when filters change
    delete query.page;

    console.log("Updating URL with filters:", query);
    router.replace({ query });
    setTimeout(() => {
      isUpdatingURL.value = false; // Reset flag after a short delay
    }, 100); // Small delay to allow router.replace to complete
  };

  const filteredMerchants = computed(() => {
    if (!merchantSearch.value) return merchants.value;
    return merchants.value.filter(
      (merchant) =>
        merchant.name
          ?.toLowerCase()
          .includes(merchantSearch.value.toLowerCase()) ||
        merchant.id?.toString().includes(merchantSearch.value)
    );
  });

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
      console.log("Current filters:", {
        categoryFilter: categoryFilter.value,
        merchantFilter: merchantFilter.value,
        merchantFilterType: typeof merchantFilter.value,
        merchantFilterLength: merchantFilter.value?.length,
      });
      productsLoading.value = true;

      const requestBody = {};

      if (categoryFilter.value.length > 0) {
        requestBody.categoryIds = categoryFilter.value.map((id) =>
          parseInt(id)
        );
      }

      if (merchantFilter.value.length > 0) {
        console.log("Adding merchant filter to request:", merchantFilter.value);
        requestBody.merchantIds = merchantFilter.value.map((id) =>
          parseInt(id)
        );
      }

      console.log("Request body:", requestBody);

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

  watch(
    [categoryFilter, merchantFilter],
    (newValues, oldValues) => {
      console.log("Filters changed, refetching products", {
        newValues,
        oldValues,
        categoryFilter: categoryFilter.value,
        merchantFilter: merchantFilter.value,
      });
      updateURLWithFilters();
      resetAndFetchProducts();
    },
    { deep: true }
  );

  // Watch for route changes to handle browser back/forward navigation
  watch(
    () => route.query,
    (newQuery, oldQuery) => {
      // Only update if the change didn't come from our own filter updates
      if (newQuery !== oldQuery && !isUpdatingURL.value) {
        console.log("Route query changed, updating filters");
        initializeFiltersFromURL();
        resetAndFetchProducts();
      }
    },
    { deep: true }
  );

  const clearFilters = () => {
    categoryFilter.value = [];
    merchantFilter.value = [];
    merchantSearch.value = "";
    updateURLWithFilters();
  };

  onMounted(async () => {
    await Promise.all([fetchCategories(), fetchMerchants()]);
    initializeFiltersFromURL();
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
    filteredMerchants,

    activeFilterCount,

    fetchCategories,
    fetchMerchants,
    fetchProducts,
    loadMoreProducts,
    resetAndFetchProducts,
    clearFilters,
  };
}
