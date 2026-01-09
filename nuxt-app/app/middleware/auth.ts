// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const publicPaths = ['/auth/callback', '/login']

  if (publicPaths.includes(to.path)) return

  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }
})
