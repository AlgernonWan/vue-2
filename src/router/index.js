import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login', component: Login
    },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [
        {
          path: '/welcome', component: Welcome
        },
        {
          path: '/users', component: Users
        }]
    }
  ]
})

// // 挂在路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to将要访问的路径
//   // from 代表冲那个路劲跳过来
//   // next一个函数,表示放行, next('/login') 强制跳转
//   if (to.path === '/login') return next()
//   // 获取token
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })
export default router
