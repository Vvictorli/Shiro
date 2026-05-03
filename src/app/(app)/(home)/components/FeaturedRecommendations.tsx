'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { apiClient } from '~/lib/request'

type RecommendationItem = {
  id: string
  title: string
  url: string
  type: 'site' | 'article' | 'app'
  sourceName?: string | null
  description?: string | null
  cover?: string | null
}

export function FeaturedRecommendations() {
  const { data } = useQuery({
    queryKey: ['featured-recommendations'],
    queryFn: () =>
      apiClient
        .proxy('recommendations')('featured')
        .get<RecommendationItem[]>(),
  })

  const items = data?.slice(0, 3) || []

  if (items.length === 0) return null

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
            Collections
          </div>
          <h2 className="mt-2 text-2xl font-medium text-zinc-950 dark:text-zinc-50">
            最近收藏
          </h2>
        </div>
        <Link
          href="/recommendations"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          查看全部
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="bg-white/82 group rounded-[20px] border border-zinc-200/80 p-3 shadow-[0_18px_56px_-54px_rgba(15,23,42,0.28)] transition-all duration-300 hover:border-zinc-300/90 hover:shadow-[0_24px_64px_-52px_rgba(15,23,42,0.34)] dark:border-zinc-800/90 dark:bg-zinc-950/55 dark:hover:border-zinc-700/90"
          >
            {item.cover ? (
              <div
                className="mb-3 h-[150px] rounded-[14px] bg-zinc-100 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${item.cover})` }}
              />
            ) : null}
            <div className="text-sm font-medium text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
              {item.title}
            </div>
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {item.sourceName || item.type}
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {item.description || '把值得停留的内容，留在手边。'}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
