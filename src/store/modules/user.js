import authAPI from '../../api/auth.js'
import * as types from '../mutation-types'

const JWTKey = 'admin-jwt'

const state = {
    jwt: null
}

const getters = {
    jwt: state => state.jwt
}

const actions = {
    login({ commit, state }, formData) {

        return new Promise((resolve, reject) => {
            authAPI.login(formData, response => {
                const { code, msg } = response.data

                if (code === 20000) {
                    commit(types.LOGIN_SUCCESS, response.data)
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
    }
}

const mutations = {
    [types.LOGIN_SUCCESS](state, { token }) {
        state.jwt = token
        window.localStorage.setItem(JWTKey, token)
    },
    [types.LOGIN_FAILURE](state, msg) {

    }
}

export default {
    state,
    getters,
    actions,
    mutations
}