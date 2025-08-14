import { createRouter, createWebHistory } from "vue-router";
import Products from "../views/Products.vue";

const routes = [
  {
    path: "/",
    redirect: "/products",
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/products/:categoryId",
    name: "ProductsByCategory",
    component: Products,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
