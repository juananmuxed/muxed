import { createRouter, createWebHistory } from "vue-router";
import { Constants } from "@/config/constants";
import { i18n } from "@/main";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "home",
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "about",
      },
    },
    {
      path: "/terminal",
      name: "terminal",
      component: () => import("../views/TerminalView.vue"),
      meta: {
        title: "terminal",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const title = i18n.global.t(("menu." + to.meta.title) as string);
  document.title = `${title}@${Constants.WEB_NICKNAME}~$`;
  next();
});

export default router;
