import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'base',
    props: true,
    component: () => import('../views/base.vue'),
    meta: {
      type: 'main',
      title: 'Home Page',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    // Scroll to the top of the page on route navigation
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
