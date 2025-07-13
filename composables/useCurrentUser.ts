import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useState } from '#app'

export const useCurrentUser = async () => {
  const config = useRuntimeConfig()
  const token = useLocalStorage('token', '')
  const user = useState('currentUser', () => null)

  if (user.value) return { user }

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/identity/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) throw new Error('Unauthorized')

    user.value = await res.json()
  } catch (error) {
    user.value = null
  }

  return { user }
}
