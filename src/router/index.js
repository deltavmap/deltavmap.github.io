import Vue from 'vue'
import VueRouter from 'vue-router'
import DeltaVMapPage from '../views/DeltaVMapPage'

Vue.use(VueRouter)
const home = {
  path: '/',
  name: 'Home',
  component: DeltaVMapPage
}
const about = {
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../views/AboutPage.vue')
}
const calculators = {
  path: '/calculators',
  name: 'Calculators',
  component: () => import(/* webpackChunkName: "about" */ '../views/Calculators.vue')
}

const routes = [
  home, about, calculators
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
