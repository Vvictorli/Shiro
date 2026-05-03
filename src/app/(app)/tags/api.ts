import { cache } from 'react'

import { attachServerFetch } from '~/lib/attach-fetch'
import { apiClient } from '~/lib/request'

export const getAllTags = cache(async () => {
  await attachServerFetch()
  const result = await apiClient.category.getAllTags()
  return result.data
})
