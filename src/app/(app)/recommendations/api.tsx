import { cache } from 'react'

import { attachServerFetch } from '~/lib/attach-fetch'
import { apiClient } from '~/lib/request'

import type { RecommendationItem, RecommendationType } from './types'

export const getRecommendations = cache(
  async (type: 'all' | RecommendationType = 'all') => {
    await attachServerFetch()

    const result = await apiClient.proxy('recommendations').get<{
      data: RecommendationItem[]
      pagination: Record<string, unknown>
    }>({
      params: {
        page: 1,
        size: 50,
        type,
      },
    })

    return result
  },
)

export const getFeaturedRecommendations = cache(async () => {
  await attachServerFetch()

  return apiClient
    .proxy('recommendations')('featured')
    .get<RecommendationItem[]>()
})
