import Vue from 'vue'
import VueRouter from 'vue-router'
import Axios from 'axios'
import authService from './service/auth'

// 启用各个组件
Vue.prototype.$http = Axios
Vue.use(VueRouter)

import App from './App.vue'
import Login from './page/user/Login.vue'
import Dashboard from './page/dashboard/Index.vue'
import Dashboard2 from './page/dashboard/Index2.vue'

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/2', component: Dashboard2, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
]

const router = new VueRouter({ routes })

// 检查登录状态，如果没有登录则跳转到登录页面
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuth()) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 如果已经验证过用户身份，则请求头加入 Authorization 字段
Axios.interceptors.request.use(config => {
  if (authService.isAuth) {
    config.headers['Authorization'] = authService.getToken()
  }

  return config
})

// 如果用户身份授权过期，跳转到登录页面
Axios.interceptors.response.use(response => {
  const code = response.data.code

  if (code === 40317) {
    authService.eraseToken()
    
    router.replace({
      path: '/login',
      query: { redirect: router.currentRoute.fullPath }
    })
    
    return Promise.reject(response.data)
  } else {
    return response
  }
})

// 刷新 JWT
Axios.interceptors.response.use(response => {
  if (response && response.headers['x-refresh-jwt']) {
    authService.refreshToken(response.headers['x-refresh-jwt'])
  }
  return response
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
