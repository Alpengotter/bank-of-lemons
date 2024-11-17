import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import EmployersView from '@/views/EmployersView.vue';
import StatisticsView from '@/views/StatisticsView.vue';
import ReportsView from '@/views/ReportsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/employers',
      name: 'employers',
      component: EmployersView,
      meta: { requiresAuth: false }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: false }
    },
  ],
})

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});



export default router
