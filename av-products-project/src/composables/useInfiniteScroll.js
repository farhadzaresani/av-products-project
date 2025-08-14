import { ref, onMounted, onUnmounted } from "vue";

export function useInfiniteScroll(callback, options = {}) {
  const targetRef = ref(null);
  const isIntersecting = ref(false);

  const {
    root = null,
    rootMargin = "0px",
    threshold = 0.1,
    enabled = true,
  } = options;

  let observer = null;

  const handleIntersect = (entries) => {
    const [entry] = entries;
    isIntersecting.value = entry.isIntersecting;

    if (entry.isIntersecting && enabled) {
      callback();
    }
  };

  const startObserving = () => {
    if (!targetRef.value || !enabled) return;

    observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(targetRef.value);
  };

  const stopObserving = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    startObserving();
  });

  onUnmounted(() => {
    stopObserving();
  });

  return {
    targetRef,
    isIntersecting,
    startObserving,
    stopObserving,
  };
}
