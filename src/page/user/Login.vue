<template>
    <div>
        <div v-show="errorMsg">
            {{ errorMsg }}
        </div>
        <div>
            <input type="text" v-model="form.username">
        </div>
        <div>
            <input type="password" v-model="form.password">
        </div>
        <div>
            <button @click="login">Login</button>
        </div>
    </div>
</template>
<script>
import authService from '../../service/auth.js'

export default {
    name: 'Login',
    data() {
        return {
            fromPath: '',
            form: {
                username: '',
                password: ''
            },
            errorMsg: ''
        }
    },
    beforeRouteEnter(to, from, next) {
        if (authService.isAuth()) {
            next({ path: from.path })
        } else {
            next(vm => {
                vm.fromPath = from.path
            })
        }
    },
    methods: {
        login() {
            authService.login(this.form, ({ code, msg }) => {
                if (code === 20000) {
                    this.errorMsg = ''
                    const toPath = this.$route.query.redirect || this.fromPath
                    this.$router.push({ path: toPath })
                } else {
                    this.errorMsg = msg
                }
            })
        }
    }
}
</script>

