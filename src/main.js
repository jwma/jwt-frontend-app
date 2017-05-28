import Vue from 'vue'
import VueRouter from 'vue-router'
import Axios from 'axios'
import routes from './router/router'
import App from './App.vue'
import store from './store'
import { JWT_KEY } from './constants'
import * as types from './store/mutation-types'

// 启用各个组件
Vue.prototype.$http = Axios
Vue.use(VueRouter)

const router = new VueRouter({ routes })

// 检查登录状态，如果没有登录则跳转到登录页面
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthored) {
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
  if (store.getters.isAuthored) {
    config.headers['Authorization'] = store.getters.jwt
  }

  return config
})

// 如果用户身份授权过期，跳转到登录页面
Axios.interceptors.response.use(response => {
  const code = response.data.code

  if (code === 40100) {
    store.commit(types.ERASE_TOKEN)

    // 如果当前路由不是登录页面路由且检查的状态是授权过期状态，则路由强制跳转至登录页面且显示登录过期提示
    if (router.currentRoute.path !== '/login') {
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath, expiredTips: 1 }
      })

      return Promise.reject(response.data)
    }

    return response
  } else {
    return response
  }
})

// 刷新 JWT
Axios.interceptors.response.use(response => {
  if (response && response.headers['x-refresh-jwt']) {
    store.commit(types.REFRESH_JWT, response.headers['x-refresh-jwt'])
  }
  return response
})

// 首次加载是检查授权状态
store.dispatch('checkStatus')

// 首次加载尝试从 localStorage 获取 jwt 缓存
store.commit(types.SET_JWT, window.localStorage.getItem(JWT_KEY))

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
