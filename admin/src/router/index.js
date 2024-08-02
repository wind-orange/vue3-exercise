import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 动态生成url
  routes: [
    {
      path:'/login',
      name:'登录',
      component:() => import('../views/Login.vue') // 懒加载
    },{
      path:'/',
      name:'框架',
      component:() => import('../views/Layout.vue'),
      children:[{
        path:'/home',
        name:'首页',
        component:() => import('../views/home/Home.vue')
      },{
        path:'/content/category',
        name:'分类管理',
        component: () => import('../views/content/CategoryList.vue')
      },{
        path:'/setting/menu',
        name:'菜单管理',
        component: () => import('../views/settings/Menu.vue')
      },{
        path:'/setting/role',
        name:'角色管理',
        component:()=> import('../views/settings/Role.vue')
      }]
    }
  ]
})

router.beforeEach((to,from,next) => {
  const userInfo = sessionStorage.getItem("userInfo")
  if(!userInfo && to.path != "/login"){
    router.push("/login")
  }
  next()
})
export default router
