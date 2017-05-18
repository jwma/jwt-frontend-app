<template>
    <div>
        <h1>2</h1>
        <router-link to="/">To dashboard 1</router-link>
        <button @click="getUserInfo">Get user information</button>
        <button @click="logout">Logout</button>
        <hr>
        <h2>User information</h2>
        <p>Username: {{ userInfo.username }}</p>
        <p>createdAt: {{ userInfo.createdAt }}</p>
    </div>
</template>
<script>
import authService from '../../service/auth.js'

export default {
    name: 'Dashboard2',
    data() {
        return { userInfo: {} }
    },
    methods: {
        getUserInfo() {
            authService.userInfo(response => {
                this.userInfo = response.userInfo
            })
        },
        logout() {
            authService.logout(_ => {
                this.$router.push({ path: '/login' })
            })
        }
    }
}
</script>

