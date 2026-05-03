export type RecommendationType = 'site' | 'article' | 'app'

export type RecommendationItem = {
  id: string
  title: string
  url: string
  type: RecommendationType
  sourceName?: string | null
  description?: string | null
  cover?: string | null
  tags?: string[]
  isFeatured?: boolean
  created: string
}

export const recommendationTypeLabels: Record<RecommendationType, string> = {
  site: '站点',
  article: '文章',
  app: '应用',
}
