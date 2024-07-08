import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import IndexView from '@/views/IndexView.vue'
import AdminViewVue from '@/views/AdminView.vue'

Vue.use(VueRouter)

const routes = [


  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/index',
    name: 'index',
    component: IndexView,
    meta: { requiresAuth: true } // 需要登录权限
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminViewVue,
    meta: { requiresAuth: true, adminAuth: true } // 需要登录权限,管理员权限
  },
]

const router = new VueRouter({
  routes
})

export default router
