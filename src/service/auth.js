import Vue from 'vue'
const qs = require('qs')

const LOGIN_API_URL = '/admin/api/security/login'
const LOGOUT_API_URL = '/admin/api/security/logout'
const GET_USER_INFO_API_URL = '/admin/api/security/get-user-info'
const CHECK_STATUS_API_URL = '/admin/api/security/check-status'
const JWTKey = 'admin-jwt'

export default {
    data: {
        jwt: null
    },
    login(loginFormData, successCallback, failureCallback) {
        Vue.prototype.$http.post(LOGIN_API_URL, qs.stringify(loginFormData))
            .then(response => {
                const { code, msg } = response.data

                if (code === 20000) {
                    const token = response.data.token
                    window.localStorage.setItem(JWTKey, token)
                    this.data.jwt = token
                }

                typeof successCallback === 'function' && successCallback(response.data)
            })
            .catch(error => {
                typeof failureCallback === 'function' && failureCallback(error)
            })
    },
    logout(successCallback) {
        Vue.prototype.$http.post(LOGOUT_API_URL)
            .then(response => {
                this.eraseToken()

                typeof successCallback === 'function' && successCallback()
            })
    },
    eraseToken() {
        this.data.jwt = false
        window.localStorage.removeItem(JWTKey)
    },
    userInfo(successCallback) {
        Vue.prototype.$http.get(GET_USER_INFO_API_URL)
            .then(response => {
                typeof successCallback === 'function' && successCallback(response.data)
            })
    },
    checkStatus(successCallback) {
        Vue.prototype.$http.post(CHECK_STATUS_API_URL)
            .then(response => {
                typeof successCallback === 'function' && successCallback(response.data)
            })
    },
    isAuth() {
        if (this.data.jwt) {
            return true
        }

        if (!window.localStorage.getItem(JWTKey)) {
            return false
        }

        this.data.jwt = window.localStorage.getItem(JWTKey)

        return true
    },
    getToken() {
        if (this.data.jwt) {
            return this.data.jwt
        }

        this.data.jwt = window.localStorage.getItem(JWTKey)

        return window.localStorage.getItem(JWTKey)
    },
    refreshToken(token) {
        window.localStorage.setItem(JWTKey, token)
        this.data.jwt = token
    }
}