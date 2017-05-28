import Vue from 'vue'
const qs = require('qs')

const LOGIN_API_URL = '/admin/api/security/login'
const LOGOUT_API_URL = '/admin/api/security/logout'
const GET_USER_INFO_API_URL = '/admin/api/security/get-user-info'
const CHECK_STATUS_API_URL = '/admin/api/security/check-status'

export default {
    login(formData, successCallback, failureCallback) {
        Vue.prototype.$http.post(LOGIN_API_URL, qs.stringify(formData))
            .then(response => {
                typeof successCallback === 'function' && successCallback(response)
            })
            .catch(error => {
                typeof failureCallback === 'function' && failureCallback(error)
            })
    },
    logout(successCallback) {
        Vue.prototype.$http.post(LOGOUT_API_URL)
            .then(response => {
                typeof successCallback === 'function' && successCallback(response)
            })
    },
    userInfo(successCallback) {
        Vue.prototype.$http.get(GET_USER_INFO_API_URL)
            .then(response => {
                typeof successCallback === 'function' && successCallback(response)
            })
    },
    checkStatus(successCallback) {
        Vue.prototype.$http.post(CHECK_STATUS_API_URL)
            .then(response => {
                typeof successCallback === 'function' && successCallback(response)
            })
    }
}