import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: '控制台', icon: 'dashboard', noCache: true }
      },
    ]
  },
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    redirect: '/user/editBaseInfo',
    name: 'Table',
    meta: {
      title: '编辑个人主页',
      icon: 'table',
      roles:['manager']
    },
    component: Layout,
    children: [
      { path: 'editHonor', component: _import('example/table/editHonor'), name: 'editHonor', meta: { title: '编辑荣誉' } },
      { path: 'editCert', component: _import('example/table/editCert'), name: 'editCert', meta: { title: '编辑证书' } },
      { path: 'editProd', component: _import('example/table/editProd'), name: 'editProd', meta: { title: '编辑作品' } },
      { path: 'editDesigner', component: _import('example/table/editDesigner'), name: 'editDesigner', meta: { title: '编辑团队' } },
      { path: 'editBaseInfo', component: _import('example/table/editBaseInfo'), name: 'editBaseInfo', meta: { title: '基本信息' } },
      {
        path: 'editSalon', component: _import('example/table/editSalon'), name: 'editSalon', meta: { title: '活动沙龙' },
      },
    ]
  },
]
