<style lang="scss" scoped>
.error-message {
    color: red;
}
</style>
<template>
    <div>
        <div class="error-message" v-show="errorMsg">
            {{ errorMsg }}
        </div>
        <div v-show="expiredTips == 1">登录身份已过期，请重新登录</div>
        <div>
            <input type="text" v-model="form.username" placeholder="用户名">
        </div>
        <div>
            <input type="password" v-model="form.password" placeholder="密码">
        </div>
        <div>
            <button v-show="!loading" @click="login">Login</button>
            <span v-show="loading">登录中...</span>
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
            errorMsg: '',
            loading: false,
            expiredTips: 0
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
    created() {
        this.expiredTips = this.$route.query.expiredTips || 0
    },
    methods: {
        login() {
            if (this.form.username == '' || this.form.password == '') {
                this.errorMsg = '请正确填写登录表单'
                return
            }

            this.loading = true
            authService.login(this.form, ({ code, msg }) => {
                this.loading = false

                if (code === 20000) {
                    this.errorMsg = ''
                    const redirect = this.$route.query.redirect == '/login' ? '/' : this.$route.query.redirect
                    const toPath = redirect || this.fromPath

                    this.$router.push({ path: toPath })
                } else {
                    this.errorMsg = msg
                }
            })
        }
    }
}
</script>

