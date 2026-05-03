import type { SayModel } from '@mx-space/api-client'
import { cache } from 'react'

import { attachServerFetch } from '~/lib/attach-fetch'
import { apiClient } from '~/lib/request'

export const getInitialSays = cache(async () => {
  await attachServerFetch()

  const result = await apiClient.say.getAllPaginated(1, 20)
  return result.$serialized as {
    data: SayModel[]
    pagination: {
      total: number
      size: number
      currentPage?: number
      current_page?: number
      totalPage?: number
      total_page?: number
      hasNextPage?: boolean
      has_next_page?: boolean
      hasPrevPage?: boolean
      has_prev_page?: boolean
    }
  }
})
