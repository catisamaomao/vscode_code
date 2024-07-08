import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// main.js
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // 检查用户是否已登录即是否有jwt令牌

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果路由需要登录权限
    if (!isAuthenticated && to.name != 'login') {
      // 如果用户未登录，则重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存用户原本要访问的页面，登录后可跳转回去
      })

    } else {
      //如果路由需要管理员权限
      if (to.matched.some(record => record.meta.adminAuth)) {
        if (localStorage.getItem('name') != 'admin') {
          //如果用户不是管理员
          next({
            path: '/login',
            query: { redirect: to.fullPath } // 保存用户原本要访问的页面，登录后可跳转回去
          })
        }
      }
      next() // 如果已登录，放行
    }
  } else {
    next() // 如果不需要登录权限，放行
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
