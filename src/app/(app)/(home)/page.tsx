import { apiClient } from '~/lib/request'

import { HomePageClient } from './HomePageClient'

export default async function HomePage() {
  const response = await apiClient.post.getList(1, 10)
  const posts = response.$serialized.data || []

  return <HomePageClient posts={posts} />
}
