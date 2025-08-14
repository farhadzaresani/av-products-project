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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
