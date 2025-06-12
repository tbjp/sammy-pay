import { createRouter, createWebHistory } from 'vue-router'
import Classes from '../views/Classes.vue'

const routes = [
  {
    path: '/',
    name: 'classes',
    component: () => import('../views/Classes.vue')
  },
  {
    path: '/pay-periods',
    name: 'pay-periods',
    component: () => import('../views/PayPeriods.vue')
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
