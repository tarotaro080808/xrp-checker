import Vue from 'vue'
import Router from 'vue-router'

// Containers
const Top = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

Vue.use(Router)

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      component: Top,
      children: [
        {
          path: '',
          name: 'トップページ',
          component: Dashboard,
        },
        {
          path: ':lang',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Dashboard,
            },
          ]
        },
      ]
    },
  ]
})
