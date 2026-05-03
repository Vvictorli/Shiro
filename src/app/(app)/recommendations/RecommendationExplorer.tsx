'use client'

import { useDeferredValue, useMemo, useState } from 'react'

import { Input } from '~/components/ui/input'

import { RecommendationGrid } from './RecommendationGrid'
import { RecommendationTabs } from './RecommendationTabs'
import type { RecommendationItem, RecommendationType } from './types'

function matchesQuery(item: RecommendationItem, query: string) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const haystack = [
    item.title,
    item.sourceName,
    item.description,
    item.url,
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalized)
}

export function RecommendationExplorer({
  items,
  initialType,
  initialQuery,
}: {
  items: RecommendationItem[]
  initialType: 'all' | RecommendationType
  initialQuery: string
}) {
  const [currentType, setCurrentType] = useState<'all' | RecommendationType>(
    initialType,
  )
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (currentType !== 'all' && item.type !== currentType) {
        return false
      }

      return matchesQuery(item, deferredQuery)
    })
  }, [currentType, deferredQuery, items])

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl px-2 lg:mt-12 lg:px-0 2xl:max-w-6xl">
      <header className="mb-4 md:mb-6">
        <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
          Collections
        </p>
        <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
          收藏
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400 md:text-[15px]">
          把偶然遇见的好东西，轻轻放在这里。
        </p>
      </header>

      <div className="mb-8 flex flex-row items-center gap-3 md:mb-10">
        <RecommendationTabs
          currentType={currentType}
          onChange={setCurrentType}
          className="shrink-0"
        />

        <div className="min-w-0 flex-1 md:min-w-72">
          <label className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400 dark:text-zinc-500">
              <span className="flex size-7 items-center justify-center rounded-full bg-zinc-100/90 dark:bg-zinc-900/90">
                <i className="i-mingcute-search-line text-base" />
              </span>
            </span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索"
              className="dark:bg-zinc-950/72 h-11 rounded-full border-zinc-200/85 bg-white/90 pl-12 pr-4 text-[14px] shadow-[0_16px_30px_-26px_rgba(15,23,42,0.22)] backdrop-blur placeholder:text-zinc-400 focus-visible:ring-zinc-300 dark:border-zinc-800/80 dark:focus-visible:ring-zinc-700"
            />
          </label>
        </div>
      </div>

      <RecommendationGrid items={filteredItems} />
    </section>
  )
}
