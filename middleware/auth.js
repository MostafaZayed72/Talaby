// middleware/auth.js
export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('token');
    const roles = useCookie('roles');
  
    if (!token.value) {
      return navigateTo('/login');
    }

    if (process.client) {
      const rolesValue = roles.value || [];
      if (rolesValue.includes('Admin')) {
        setPageLayout('admin')
      } else if (rolesValue.includes('Store')) {
        setPageLayout('provider')
      } else if (rolesValue.includes('Client')) {
        setPageLayout('client')
      }
    }
  });
  