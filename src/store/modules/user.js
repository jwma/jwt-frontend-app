import authAPI from '../../api/auth.js'
import { JWT_KEY } from '../../constants'
import * as types from '../mutation-types'

const state = {
    jwt: null
}

const getters = {
    jwt: state => {
        if (state.jwt) {
            return state.jwt
        }

        return window.localStorage.getItem(JWT_KEY)
    },
    isAuthored: (state, getters) => {
        return !!getters.jwt
    }
}

const actions = {
    login({ commit, state }, formData) {

        return new Promise((resolve, reject) => {
            authAPI.login(formData, response => {
                const { code, msg } = response.data

                if (code === 20000) {
                    const { token } = response.data
                    commit(types.LOGIN_SUCCESS)
                    commit(types.SET_JWT, token)

                    resolve(code)
                } else {
                    commit(types.LOGIN_FAILURE, msg)
                    reject({ msg })
                }
            }, error => {
                commit(types.LOGIN_FAILURE, 'error')
                reject({ msg: 'error' })
            })
        })
    },
    logout({ commit, state }) {
        return new Promise((reslove, reject) => {
            authAPI.logout(response => {
                commit(types.ERASE_TOKEN)
                reslove()
            })
        })
    },
    checkStatus({ commit, state }) {

        return new Promise((resolve, reject) => {
            authAPI.checkStatus(response => {
                resolve(response)
            })
        })

    },
}

const mutations = {
    [types.LOGIN_SUCCESS](state) {
    },
    [types.SET_JWT](state, token) {
        state.jwt = token
        if (token != null) {
            window.localStorage.setItem(JWT_KEY, token)
        }
    },
    [types.LOGIN_FAILURE](state, msg) {

    },
    [types.ERASE_TOKEN](state) {
        state.jwt = null
        window.localStorage.removeItem(JWT_KEY)
    },
    [types.REFRESH_JWT](state, token) {
        state.jwt = token
        if (token != null) {
            window.localStorage.setItem(JWT_KEY, token)
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}