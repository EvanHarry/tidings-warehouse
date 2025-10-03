import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    children: [{ path: '/home', component: () => import('pages/Home.vue') }],
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    path: '/',
    redirect: '/home',
  },
  {
    component: () => import('pages/Login.vue'),
    path: '/login',
  },
  {
    component: () => import('pages/Register.vue'),
    path: '/register',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    component: () => import('pages/ErrorNotFound.vue'),
    path: '/:catchAll(.*)*',
  },
];

export default routes;
