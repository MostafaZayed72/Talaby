// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
    const token = useLocalStorage('token', '');
    const roles = useLocalStorage('roles', []);
  
    if (!token.value) {
      return navigateTo('/login');
    }

    if (process.client) {
      if (roles.value.includes('Admin')) {
        setPageLayout('admin')
      } else if (roles.value.includes('Store')) {
        setPageLayout('provider')
      } else if (roles.value.includes('Client')) {
        setPageLayout('client')
      }
    }
  });
  