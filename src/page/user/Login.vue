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
import { mapGetters } from 'vuex'

export default {
    name: 'Login',
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            expiredTips: 0,
            loading: false,
            errorMsg: ''
        }
    },
    computed: {
        ...mapGetters([
            'isAuthored'
        ])
    },
    created() {
        this.expiredTips = this.$route.query.expiredTips || 0

        if (this.isAuthored) {
            console.log('已授权，跳转...')
            this.$router.replace({ path: '/' })
        }
    },
    methods: {
        login() {
            if (this.form.username == '' || this.form.password == '') {
                this.errorMsg = '请正确填写登录表单'
                return
            }

            this.loading = true
            this.$store.dispatch('login', this.form).then(code => {
                this.loading = false
                this.errorMsg = false

                const redirect = this.$route.query.redirect == '/login' ? '/' : this.$route.query.redirect
                const toPath = redirect || '/'

                this.$router.push({ path: toPath })
            }).catch(({ msg }) => {
                this.loading = false
                this.errorMsg = msg
            })
        }
    }
}
</script>

