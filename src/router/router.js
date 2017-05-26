export default [
    {
        path: '/',
        component: r => require.ensure([], () => r(require('../page/dashboard/Index.vue')), 'dashboard'),
        meta: { requiresAuth: true }
    },
    {
        path: '/2',
        component: r => require.ensure([], () => r(require('../page/dashboard/Index2.vue')), 'dashboard'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        component: r => require.ensure([], () => r(require('../page/user/Login.vue')), 'user')
    },
]
