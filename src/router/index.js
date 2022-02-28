import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'el-icon-s-home', affix: true }
      }
    ]
  }
]
export const asyncRoutes = [
  {
    path: '/systemManage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'systemManage',
    meta: { title: 'systemManage', icon: 'el-icon-s-tools', roles: 'systemManage' },
    children: [
      {
        path: 'role',
        component: () => import('@/views/systemManage/role/index'),
        name: 'roleManage',
        meta: { title: 'roleManage', roles: 'roleManage' }
      },
      {
        path: 'user',
        component: () => import('@/views/systemManage/user/index'),
        name: 'userManage',
        meta: { title: 'userManage', roles: 'userManage' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
