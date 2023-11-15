import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    component: () => import("../views/LayoutView.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/HomeView.vue"),
      },
      {
        path: "account",
        name: "account",
        component: () => import("../views/AccountView.vue"),
      },
      {
        path: "transactions",
        name: "transactions",
        component: () => import("../views/TransactionsView.vue"),
      },
      {
        path: "about",
        name: "about",
        component: () => import("../views/AboutView.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  if (to.meta.requiresAuth && !isLoggedIn) next({ name: "login" });
  else next();
});

export default router;
