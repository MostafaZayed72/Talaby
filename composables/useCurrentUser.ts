import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useState } from '#app'
import { ref } from 'vue'


let loadingPromise: Promise<any> | null = null

export const useCurrentUser = async () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const user = useState('user', () => null)

  // If we already have a user, return it
  if (user.value) return { user }

  // If already loading, wait for the existing promise
  if (loadingPromise) {
    await loadingPromise
    return { user }
  }

  if (!token.value) {
    user.value = null
    return { user }
  }

  // Create a promise to fetch and lock subsequent calls
  loadingPromise = (async () => {
    try {
      const res = await fetch(`${config.public.API_BASE_URL}/identity/users/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!res.ok) throw new Error('Unauthorized')

      const response = await res.json()
      user.value = response.data
    } catch (error) {
      console.error('Error fetching current user:', error)
      user.value = null
    } finally {
      loadingPromise = null
    }
  })()

  await loadingPromise
  return { user }
}
