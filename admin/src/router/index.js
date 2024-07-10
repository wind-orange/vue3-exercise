import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 动态生成url
  routes: [
    {
      path:'/login',
      name:'登录',
      component:() => import('../views/login.vue') // 懒加载
    }
  ]
})

export default router
