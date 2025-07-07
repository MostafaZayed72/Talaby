import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'

export function useReplies() {
  const config = useRuntimeConfig()
  const token = useLocalStorage('token', '')
  const route = useRoute()

  const proposalId = route.params.id as string

  const replies = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')
  const pageNumber = ref(1)
  const pageSize = ref(5)
  const totalPages = ref(1)

  const fetchReplies = async () => {
    loading.value = true
    error.value = ''
    try {
      const url = new URL(`${config.public.API_BASE_URL}/project-proposals/${proposalId}/replies`)
      url.searchParams.set('pageNumber', pageNumber.value.toString())
      url.searchParams.set('pageSize', pageSize.value.toString())

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error('فشل تحميل الردود')

      const data = await res.json()
      replies.value = data.items
      totalPages.value = data.totalPages
    } catch (err: any) {
      error.value = err.message || 'حدث خطأ أثناء تحميل الردود'
    } finally {
      loading.value = false
    }
  }

  return {
    replies,
    loading,
    error,
    pageNumber,
    pageSize,
    totalPages,
    fetchReplies,
  }
}
