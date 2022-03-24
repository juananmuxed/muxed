import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from '../store/index'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});


router.afterEach(async (to, from) => {
  let title = `${store.state.terminal.user}@MuXeD:${store.state.terminal.actualUrl}`;
  document.title = title;
})

export default router;
