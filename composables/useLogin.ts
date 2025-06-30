import { ref } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

export function useLogin() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const router = useRouter()
  const loading = ref(false)

  const token = useLocalStorage('token', '')
  const userID = useLocalStorage('userID', '')
  const roles = useLocalStorage('roles', [])

  const loginUser = async (email: string, password: string, redirect = true) => {
    loading.value = true

    try {
      const response = await axios.post(`${config.public.API_BASE_URL}/identity/login`, {
        email,
        password
      })

      const { token: newToken, userID: newUserID, roles: newRoles } = response.data

      token.value = newToken
      userID.value = newUserID
      roles.value = newRoles || []

      toast.add({ severity: 'success', summary: 'نجاح', detail: 'تم تسجيل الدخول بنجاح' })

      if (redirect) {
        router.push('/')
      }

      return { success: true }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.errors?.[Object.keys(error.response.data.errors)[0]]?.[0] ||
        error.response?.data?.title ||
        'حدث خطأ أثناء تسجيل الدخول'

      toast.add({ severity: 'error', summary: 'خطأ', detail: errorMsg })
      return { success: false, message: errorMsg }
    } finally {
      loading.value = false
    }
  }

  return {
    loginUser,
    loading
  }
}
