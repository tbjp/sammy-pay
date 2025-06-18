import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'classes',
    component: () => import('../views/Classes.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LogIn.vue')
  },
   {
    path: '/class/:id',
    name: 'class-detail',
    component: () => import('../views/ClassDetail.vue'),
    props: true
  },
  {
    path: '/pay-periods',
    name: 'pay-periods',
    component: () => import('../views/PayPeriods.vue')
  },
  {
    path: '/pay-period/:id',
    name: 'pay-period-detail',
    component: () => import('../views/PayPeriodDetail.vue'),
    props: true
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
