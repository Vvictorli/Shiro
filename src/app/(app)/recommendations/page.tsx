import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'

import { getRecommendations } from './api'
import { RecommendationExplorer } from './RecommendationExplorer'
import type { RecommendationType } from './types'

export const revalidate = 21600

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const type =
    resolvedSearchParams.type === 'site' ||
    resolvedSearchParams.type === 'article' ||
    resolvedSearchParams.type === 'app'
      ? (resolvedSearchParams.type as RecommendationType)
      : 'all'

  const result = await getRecommendations('all')
  const items = result.data || []
  const initialQuery = resolvedSearchParams.q || ''

  return (
    <BottomToUpSoftScaleTransitionView>
      <RecommendationExplorer
        items={items}
        initialType={type}
        initialQuery={initialQuery}
      />
    </BottomToUpSoftScaleTransitionView>
  )
}
