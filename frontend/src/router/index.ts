import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/views/books/index.vue'),
        meta: { title: '图书管理', roles: ['admin'] }
      },
      {
        path: 'books/:id',
        name: 'BookDetail',
        component: () => import('@/views/books/detail.vue'),
        meta: { title: '图书详情' }
      },
      {
        path: 'members',
        name: 'Members',
        component: () => import('@/views/members/index.vue'),
        meta: { title: '会员管理', roles: ['admin'] }
      },
      {
        path: 'borrow',
        name: 'Borrow',
        component: () => import('@/views/borrow/index.vue'),
        meta: { title: '借阅管理' }
      },
      {
        path: 'reservations',
        name: 'Reservations',
        component: () => import('@/views/reservations/index.vue'),
        meta: { title: '预约管理' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/index.vue'),
        meta: { title: '统计报表', roles: ['admin'] }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/index.vue'),
        meta: { title: '数据分析', roles: ['admin'] }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置', roles: ['admin'] }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const title = to.meta.title as string
  
  if (title) {
    document.title = `${title} - 图书馆管理系统`
  }

  if (to.meta.public) {
    return next()
  }

  if (!userStore.token || isTokenExpired(userStore.token)) {
    userStore.logoutAction()
    return next('/login')
  }

  const roles = to.meta.roles as string[] | undefined
  if (roles && !roles.includes(userStore.role)) {
    ElMessage.warning('无权访问该页面')
    return next('/home')
  }

  next()
})

export default router