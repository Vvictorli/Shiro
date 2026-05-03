'use client'

import { clsxm } from '~/lib/helper'

import type { RecommendationType } from './types'

const tabs: Array<{ label: string; value: 'all' | RecommendationType }> = [
  { label: '全部', value: 'all' },
  { label: '站点', value: 'site' },
  { label: '文章', value: 'article' },
  { label: '应用', value: 'app' },
]

export function RecommendationTabs({
  currentType,
  onChange,
  className,
}: {
  currentType: 'all' | RecommendationType
  onChange: (type: 'all' | RecommendationType) => void
  className?: string
}) {
  return (
    <nav
      className={clsxm(
        'sticky top-16 z-10 flex w-full max-w-full gap-1.5 overflow-x-auto rounded-full border border-zinc-200/80 bg-white/90 p-1.5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/74',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === currentType
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`min-w-[4.5rem] shrink-0 rounded-full px-4 py-2 text-center text-sm transition-all md:min-w-0 md:flex-1 md:px-5 ${
              active
                ? 'bg-zinc-950 text-white shadow-[0_10px_24px_-16px_rgba(15,23,42,0.55)] dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-zinc-100'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
