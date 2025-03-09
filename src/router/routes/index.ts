export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/login/index.vue')
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/index.vue')
    },
    {
        path: '/edit',
        name: 'Edit',
        component: () => import('@/pages/edit/index.vue')
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/pages/edit/test/index.vue')
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/pages/error/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404'
    },
    {
        path: '/preview',
        name: 'Preview',
        component: () => import('@/pages/preview/index.vue')
    }
];







