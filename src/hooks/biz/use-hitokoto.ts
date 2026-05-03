import { useQuery } from '@tanstack/react-query'

import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

interface HitokotoResponse {
  hitokoto: string
  from: string
  from_who: string | null
}

const DEFAULT_HITOKOTO = '我的语言之局限，即我的世界之局限。'

export const useHitokoto = () => {
  const hitokotoConfig = useAppConfigSelector((config) => config.hero?.hitokoto)

  const { data: randomHitokoto, refetch } = useQuery({
    queryKey: ['hitokoto'],
    queryFn: async (): Promise<HitokotoResponse> => {
      const response = await fetch('https://v1.hitokoto.cn/?c=a&c=e&c=k&c=d')
      if (!response.ok) {
        throw new Error('Failed to fetch hitokoto')
      }
      return response.json()
    },
    enabled: !!hitokotoConfig?.random,
    staleTime: 2000, // 2s缓存
    retry: 2,
  })

  const formatHitokoto = (data: HitokotoResponse): string => {
    const { hitokoto, from, from_who } = data
    const author = from_who || from

    if (author) {
      return `${hitokoto}  ——${author}`
    }
    return hitokoto
  }

  const refreshHitokoto = () => {
    if (hitokotoConfig?.random) {
      refetch()
    }
  }

  // 优先级：random > custom > default
  const hitokotoText = (() => {
    if (hitokotoConfig?.random && randomHitokoto) {
      return formatHitokoto(randomHitokoto)
    }

    if (hitokotoConfig?.custom) {
      return hitokotoConfig.custom
    }

    return DEFAULT_HITOKOTO
  })()

  return {
    text: hitokotoText,
    refresh: refreshHitokoto,
    canRefresh: !!hitokotoConfig?.random,
  }
}
