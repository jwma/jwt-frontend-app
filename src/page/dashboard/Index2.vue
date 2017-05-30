<template>
    <div>
        <router-link to="/">To dashboard 1</router-link>
        <router-link to="/login">To Login</router-link>
        <button @click="getUserInfo">Get user information</button>
        <button @click="logout">Logout {{ username }}</button>
        <hr>
        <h2>User information</h2>
        <p>Username: {{ userInfo.username }}</p>
        <p>createdAt: {{ userInfo.createdAt }}</p>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import authAPI from '../../api/auth'

export default {
    name: 'Dashboard2',
    data() {
        return { userInfo: {} }
    },
    computed: {
        ...mapGetters([
            'username'
        ])
    },
    methods: {
        getUserInfo() {
            authAPI.userInfo(response => {
                this.userInfo = response.data.userInfo
            })
        },
        logout() {
            this.$store.dispatch('logout').then(_ => {
                this.$router.push({ path: '/login' })
            })
        }
    }
}
</script>

