import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import EmployersView from '@/views/EmployersView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ReportsView from '@/views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, roles: ['ADMIN'] },
    },
    {
      path: '/employers',
      name: 'employers',
      component: EmployersView,
      meta: { requiresAuth: true, roles: ['ADMIN'] },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      meta: { requiresAuth: true, roles: ['MASTER'] },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true, roles: ['MASTER'] },
    },
  ],
})

function isAuthenticated() {
  return !!localStorage.getItem('token')
}

router.beforeEach((to, from, next) => {
  const userRoles = ['ADMIN']

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      return next({ name: 'login' })
    }

    if (to.meta.roles) {
      // Если для страницы заданы роли, проверяем доступ
      const hasRole = (to.meta.roles as Array<string>).some((role) => userRoles.includes(role))
      if (!hasRole) {
        return next({ name: 'home' })
      }
    }
  }

  next()
})

export default router
