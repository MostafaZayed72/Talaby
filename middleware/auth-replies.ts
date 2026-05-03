// middleware/auth-replies.ts
import { useRuntimeConfig, useState } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useCurrentUser } from '~/composables/useCurrentUser'

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  const proposalId = to.params.id as string

  if (!token.value) {
    return navigateTo('/')
  }

  try {
    const { user } = await useCurrentUser()

    if (!user.value?.id) {
      return navigateTo('/')
    }

    const res = await fetch(`${config.public.API_BASE_URL}/project-proposals/${proposalId}/replies`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!res.ok) {
      return navigateTo('/')
    }

    const responseData = await res.json()
    const proposalData = responseData.data

    const currentUserId = user.value.id
    const isProposalOwner = currentUserId === proposalData.proposalCreatorId
    const isRequestOwner = currentUserId === proposalData.projectRequestCreatorId

    if (!isProposalOwner && !isRequestOwner) {
      return navigateTo('/')
    }

  } catch (error) {
    console.error('Middleware error:', error)
    return navigateTo('/')
  }
})
