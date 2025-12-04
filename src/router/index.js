import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/topics'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/topics',
    name: 'Topics',
    component: () => import('../views/TopicsView.vue')
  },
  {
    path: '/topic/:id',
    name: 'TopicDetail',
    component: () => import('../views/TopicDetailView.vue'),
    meta: { requiresAuth: true }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/topics'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 移除用户名验证逻辑，允许直接访问话题详情页
  // 用户名验证现在在MessageForm组件内部进行
  next()
})

export default router