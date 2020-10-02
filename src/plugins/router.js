import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store.js'

import Login from '@/Login.vue'

import Campaign from '../views/Campaign.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/client/signup',
      component: () => import(/* webpackChunkName: "ClaimCreate" */ '@/views/ClientSignUp.vue'),
    },
    {
      path: '/cast/signup',
      component: () => import(/* webpackChunkName: "ClaimCreate" */ '@/views/CastSignUp.vue'),
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/Login.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next('/' + store.state.roll + '/dashboard') : next() }
    },
    {
      path: '/',
      name: 'RootLogin',
      component: Login
    },
    {
      path: '/dashboard',
      component: () => import(/* webpackChunkName: "DashBoard" */ '@/views/DashBoard.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/campaign',
      name: 'Campaign',
      component: Campaign
    },
    {
      path: '/campaign/detail/:id',
      name: 'CampaignDetail',
      component: () => import(/* webpackChunkName: "DashBoard" */ '@/views/CampaignDetail.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/campaign/create',
      name: 'CampaignCreate',
      component: () => import(/* webpackChunkName: "DashBoard" */ '@/views/CampaignCreate.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/campaign/confirm',
      name: 'CampaignConfirm',
      component: () => import(/* webpackChunkName: "DashBoard" */ '@/views/CampaignConfirm.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/contact',
      component: () => import(/* webpackChunkName: "Contact" */ '@/views/Contact.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/contact/cast/:id',
      component: () => import(/* webpackChunkName: "ContactCast" */ '@/views/ContactCast.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/client',
      component: () => import(/* webpackChunkName: "Client" */ '@/views/Client.vue'),
      beforeEnter(to, from, next) { 
        store.state.idToken && store.state.roll === 'admin' || store.state.roll === 'cast' ? next() : next('/login') 
      }
    },
    {
      path: '/client/detail/:id',
      component: () => import(/* webpackChunkName: "ClientDetail" */ '@/views/ClientDetail.vue'),
      beforeEnter(to, from, next) { 
        store.state.idToken && store.state.roll === 'admin' || store.state.roll === 'cast' ? next() : next('/login')
      }
    },
    {
      path: '/cast',
      component: () => import(/* webpackChunkName: "Cast" */ '@/views/Cast.vue'),
      beforeEnter(to, from, next) {
        store.state.idToken && store.state.roll === 'admin' || store.state.roll === 'client' ? next() : next('/login')
      }
    },
    {
      path: '/cast/detail/:id',
      component: () => import(/* webpackChunkName: "CastDetail" */ '@/views/CastDetail.vue'),
      children: [
        {path: '1', component: () => import(/* webpackChunkName: "InstagramData" */ '@/components/InstagramData.vue')},
        {path: '2', component: () => import(/* webpackChunkName: "TwitterData" */ '@/components/TwitterData.vue')},
        {path: '3', component: () => import(/* webpackChunkName: "YouTubeData" */ '@/components/YouTubeData.vue')},
        {path: '4', component: () => import(/* webpackChunkName: "TikTokData" */ '@/components/TikTokData.vue')}
      ],
      beforeEnter(to, from, next) {
        store.state.idToken && store.state.roll === 'admin' || store.state.roll === 'client' ? next() : next('/login')
      }
    },
    {
      path: '/notification',
      component: () => import(/* webpackChunkName: "Notification" */ '@/views/Notification.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/notification/detail/:id',
      component: () => import(/* webpackChunkName: "NotificationDetail" */ '@/views/NotificationDetail.vue'),
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/notification/create',
      component: () => import(/* webpackChunkName: "NotificationCreate" */ '@/views/NotificationCreate.vue'),
      beforeEnter(to, from, next) { store.state.idToken && store.state.roll === 'admin' ? next() : next('/login') }
    },
    {
      path: '/notification/confirm',
      component: () => import(/* webpackChunkName: "NotificationConfirm" */ '@/views/NotificationConfirm.vue'),
      beforeEnter(to, from, next) { store.state.idToken && store.state.roll === 'admin' ? next() : next('/login') }
    },
    {
      path: '/mypage',
      component: () => import(/* webpackChunkName: "MyPage" */ '@/views/MyPage.vue'),
      children: [
        {path: '1', component: () => import(/* webpackChunkName: "InstagramData" */ '@/components/InstagramData.vue')},
        {path: '2', component: () => import(/* webpackChunkName: "TwitterData" */ '@/components/TwitterData.vue')},
        {path: '3', component: () => import(/* webpackChunkName: "YouTubeData" */ '@/components/YouTubeData.vue')},
        {path: '4', component: () => import(/* webpackChunkName: "TikTokData" */ '@/components/TikTokData.vue')}
      ],
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/mypage/edit',
      component: () => import(/* webpackChunkName: "MyPageEdit" */ '@/views/MyPageEdit.vue'),
      children: [
        {path: '1', component: () => import(/* webpackChunkName: "InstagramDataEdit" */ '@/components/InstagramDataEdit.vue')},
        {path: '2', component: () => import(/* webpackChunkName: "TwitterDataEdit" */ '@/components/TwitterDataEdit.vue')},
        {path: '3', component: () => import(/* webpackChunkName: "YouTubeDataEdit" */ '@/components/YouTubeDataEdit.vue')},
        {path: '4', component: () => import(/* webpackChunkName: "TikTokDataEdit" */ '@/components/TikTokDataEdit.vue')}
      ],
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/mypage/confirm',
      component: () => import(/* webpackChunkName: "MyPageConfirm" */ '@/views/MyPageConfirm.vue'),
      children: [
        {path: '1', component: () => import(/* webpackChunkName: "InstagramDataConfirm" */ '@/components/InstagramDataConfirm.vue')},
        {path: '2', component: () => import(/* webpackChunkName: "TwitterDataConfirm" */ '@/components/TwitterDataConfirm.vue')},
        {path: '3', component: () => import(/* webpackChunkName: "YouTubeDataConfirm" */ '@/components/YouTubeDataConfirm.vue')},
        {path: '4', component: () => import(/* webpackChunkName: "TikTokDataConfirm" */ '@/components/TikTokDataConfirm.vue')}
      ],
      beforeEnter(to, from, next) { store.state.idToken ? next() : next('/login') }
    },
    {
      path: '/claim/create',
      component: () => import(/* webpackChunkName: "ClaimCreate" */ '@/views/ClaimCreate.vue'),
      beforeEnter(to, from, next) { store.state.idToken && store.state.roll === 'admin' ? next() : next('/login') }
    },
    {
      path: '/pay',
      component: () => import(/* webpackChunkName: "ClaimCreate" */ '@/views/pay.vue'),
      children: [
        { path: "detail", component: () => import(/* webpackChunkName: "PayDetail" */ '@/components/PayDetail.vue') }
      ],
      beforeEnter(to, from, next) { store.state.idToken && store.state.roll === 'client' ? next() : next('/login') }
    },
    {
      path: '/discount/edit',
      component: () => import(/* webpackChunkName: "ClaimCreate" */ '@/views/DiscountEdit.vue'),
      beforeEnter(to, from, next) { store.state.idToken && store.state.roll === 'admin' ? next() : next('/login') }
    },
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
