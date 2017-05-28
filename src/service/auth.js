import Vue from 'vue'
import authAPI from '../api/auth.js'

const JWTKey = 'admin-jwt'

export default {
    data: {
        jwt: null
    },
    login(formData, successCallback, failureCallback) {
        authAPI.login(formData, response => {
            const { code, msg } = response.data

            if (code === 20000) {
                const token = response.data.token
                window.localStorage.setItem(JWTKey, token)
                this.data.jwt = token
            }

            typeof successCallback === 'function' && successCallback(response.data)
        }, error => {
            typeof failureCallback === 'function' && failureCallback(error)
        })
    },
    logout(successCallback) {
        authAPI.logout(response => {
            this.eraseToken()
            typeof successCallback === 'function' && successCallback()
        })
    },
    eraseToken() {
        this.data.jwt = false
        window.localStorage.removeItem(JWTKey)
    },
    userInfo(successCallback) {
        authAPI.userInfo(response => {
            typeof successCallback === 'function' && successCallback(response.data)
        })
    },
    checkStatus(successCallback) {
        authAPI.checkStatus(response => {
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