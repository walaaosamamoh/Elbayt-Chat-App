import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: {
        requiresAuth: true, // This route requires authentication
      },
    }
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const auth= getAuth();
  const user = auth.currentUser;

  if(to.meta.requiresAuth && !user){
    next('/')
  } else {
    // If the route does not require authentication, proceed as normal
    next()
  }
})

export default router
