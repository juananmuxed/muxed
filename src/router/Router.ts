import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { App } from 'vue';

import { useTitle } from 'src/composables/UseTitle';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      titleTag: 'menu.home',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      titleTag: 'menu.about',
    },
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: () => import('../views/TerminalView.vue'),
    meta: {
      titleTag: 'menu.terminal',
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const installRouter = (app: App) => {
  app.use(router);
};

let titleRouteTimeout: NodeJS.Timeout;

router.beforeEach((to, from, next) => {
  const title = useTitle();

  titleRouteTimeout && clearTimeout(titleRouteTimeout);
  titleRouteTimeout = setTimeout(() => {
    title.setTitle(to);
  }, 200);

  next();
});

export default router;
