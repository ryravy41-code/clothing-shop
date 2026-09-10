import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AccountLayout from '@/layouts/AccountLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'shop', name: 'shop', component: () => import('@/views/ShopView.vue') },
      {
        path: 'category/:category',
        name: 'category',
        component: () => import('@/views/ShopView.vue'),
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/SearchView.vue'),
      },
      {
        path: 'product/:id',
        name: 'product',
        component: () => import('@/views/ProductDetailView.vue'),
      },
      { path: 'wishlist', name: 'wishlist', component: () => import('@/views/WishlistView.vue') },
      { path: 'cart', name: 'cart', component: () => import('@/views/CartView.vue') },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutView.vue'),
        meta: { requiresAuth: true },
      },
      { path: 'login', name: 'login', component: () => import('@/views/LoginView.vue') },
      { path: 'register', name: 'register', component: () => import('@/views/RegisterView.vue') },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/ForgotPasswordView.vue'),
      },
      {
        path: 'order-success',
        name: 'order-success',
        component: () => import('@/views/OrderSuccessView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'track-order',
        name: 'track-order',
        component: () => import('@/views/TrackOrderView.vue'),
      },
      { path: 'about', name: 'about', component: () => import('@/views/AboutView.vue') },
      { path: 'contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
      { path: 'faq', name: 'faq', component: () => import('@/views/FaqView.vue') },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
      },
    ],
  },
  {
    path: '/account',
    component: AccountLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'account', component: () => import('@/views/AccountDashboardView.vue') },
      {
        path: 'orders',
        name: 'account-orders',
        component: () => import('@/views/AccountOrdersView.vue'),
      },
      {
        path: 'orders/:id',
        name: 'account-order-detail',
        component: () => import('@/views/AccountOrderDetailView.vue'),
      },
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('@/views/AccountProfileView.vue'),
      },
      {
        path: 'addresses',
        name: 'account-addresses',
        component: () => import('@/views/AccountAddressesView.vue'),
      },
      {
        path: 'wishlist',
        name: 'account-wishlist',
        component: () => import('@/views/AccountWishlistView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    return { name: 'account' }
  }
  return true
})

export default router