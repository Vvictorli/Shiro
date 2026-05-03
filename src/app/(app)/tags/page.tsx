import Link from 'next/link'

import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { clsxm } from '~/lib/helper'

import { getAllTags } from './api'

export const metadata = {
  title: '标签',
}

export const revalidate = 21600

function buildTagHref(tag: string) {
  return `/posts?tag=${encodeURIComponent(tag)}`
}

function getWeightLevel(
  count: number,
  minCount: number,
  maxCount: number,
): 0 | 1 | 2 | 3 {
  if (minCount === maxCount) return 1

  const ratio = (count - minCount) / (maxCount - minCount)
  if (ratio >= 0.75) return 3
  if (ratio >= 0.5) return 2
  if (ratio >= 0.25) return 1
  return 0
}

const weightClassMap = {
  0: 'text-[0.98rem] font-medium text-zinc-500 dark:text-zinc-400',
  1: 'text-[1.12rem] font-medium text-zinc-700 dark:text-zinc-200',
  2: 'text-[1.34rem] font-semibold text-zinc-900 dark:text-zinc-50',
  3: 'text-[1.7rem] font-semibold text-zinc-950 dark:text-white',
}

export default async function TagsPage() {
  const tags = await getAllTags()
  const sortedTags = [...tags].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.name.localeCompare(b.name)
  })
  const counts = sortedTags.map((tag) => tag.count)
  const minCount = counts.length > 0 ? Math.min(...counts) : 0
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0

  return (
    <BottomToUpSoftScaleTransitionView>
      <section className="mx-auto mt-8 w-full max-w-[52rem] px-2 lg:mt-12 lg:px-0">
        <header className="mb-6 md:mb-8">
          <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
            Tags
          </p>
          <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
            标签
          </h1>
          <p className="mt-3 max-w-[30rem] text-sm leading-7 text-zinc-500 dark:text-zinc-400 md:text-[15px]">
            一些反复出现的词，也是一条回看文章的小路。
          </p>
        </header>

        <section className="bg-white/82 rounded-[28px] border border-zinc-200/80 p-5 shadow-[0_20px_60px_-54px_rgba(15,23,42,0.26)] dark:border-zinc-800/90 dark:bg-zinc-950/55 md:p-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
              共 {sortedTags.length} 个标签
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-4 md:gap-x-6 md:gap-y-5">
            {sortedTags.map((tag) => {
              const level = getWeightLevel(tag.count, minCount, maxCount)

              return (
                <Link
                  key={tag.name}
                  href={buildTagHref(tag.name)}
                  className={clsxm(
                    'inline-flex items-baseline gap-1.5 leading-none transition hover:text-zinc-950 dark:hover:text-white',
                    weightClassMap[level],
                  )}
                >
                  <span>{tag.name}</span>
                  <span className="text-[0.72em] tabular-nums text-zinc-400 dark:text-zinc-500">
                    {tag.count}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      </section>
    </BottomToUpSoftScaleTransitionView>
  )
}
