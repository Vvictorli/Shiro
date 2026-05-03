'use client'

import type { SayModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
import { memo } from 'react'

import { useIsLogged } from '~/atoms/hooks/owner'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { RelativeTime } from '~/components/ui/relative-time'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'

import { useSayListQuery, useSayModal } from './hooks'

type SayPage = {
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

const options = {
  disableParsingRawHTML: true,
  forceBlock: true,
} satisfies MarkdownToJSX.Options

export const SayMasonry = ({ initialPage }: { initialPage?: SayPage }) => {
  const { fetchNextPage, hasNextPage, data } = useSayListQuery(initialPage)

  if (!data) return null

  const list = data.pages.flatMap((page) => page.data)

  return (
    <>
      <div className="rounded-[26px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] px-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))] md:px-8">
        {list.map((item, index) => (
          <BottomToUpTransitionView
            lcpOptimization
            key={item.id}
            delay={index * 60}
          >
            <SayCard item={item} />
          </BottomToUpTransitionView>
        ))}
      </div>

      {hasNextPage && (
        <LoadMoreIndicator onLoading={fetchNextPage} className="mt-12">
          <BottomToUpSoftScaleTransitionView>
            <div className="rounded-[26px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] px-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))] md:px-8">
              {placeholderData.map((item) => (
                <div key={item.id}>
                  <SaySkeleton />
                </div>
              ))}
            </div>
          </BottomToUpSoftScaleTransitionView>
        </LoadMoreIndicator>
      )}
    </>
  )
}

const placeholderData = Array.from({ length: 4 }).map((_, index) => ({
  id: index.toFixed(0),
}))

const SaySkeleton = memo(() => (
  <div className="border-b border-zinc-200/70 py-6 last:border-b-0 dark:border-zinc-800/80 md:py-7">
    <div className="mb-3 h-8 w-2/3 rounded bg-zinc-200/80 dark:bg-zinc-800" />
    <div className="space-y-2">
      <div className="h-5 w-full rounded bg-zinc-200/80 dark:bg-zinc-800" />
      <div className="h-5 w-4/5 rounded bg-zinc-200/80 dark:bg-zinc-800" />
    </div>
    <div className="mt-4 h-4 w-32 rounded bg-zinc-200/80 dark:bg-zinc-800" />
  </div>
))
SaySkeleton.displayName = 'SaySkeleton'

const SayCard = memo(({ item: say }: { item: SayModel }) => {
  const isLogged = useIsLogged()
  const present = useSayModal()

  return (
    <article className="group relative border-b border-zinc-200/70 py-6 last:border-b-0 dark:border-zinc-800/80 md:py-7">
      <div className="pr-10 text-[1.05rem] leading-[1.9] tracking-[-0.01em] text-zinc-900 dark:text-zinc-100 md:text-[1.12rem]">
        <Markdown options={options}>{`${say.text}`}</Markdown>
      </div>

      <div className="mt-3 flex justify-end text-[12px] text-zinc-500 dark:text-zinc-400">
        <RelativeTime date={say.created} />
      </div>

      <div className="mt-3 h-px w-full bg-zinc-200/85 dark:bg-zinc-800/85" />

      {isLogged && (
        <button
          onClick={() => present(say)}
          className="absolute right-0 top-6 inline-flex size-8 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:border-zinc-800/80 dark:bg-zinc-950/85 dark:text-zinc-400"
        >
          <i className="i-mingcute-quill-pen-line" />
          <span className="sr-only">编辑</span>
        </button>
      )}
    </article>
  )
})
SayCard.displayName = 'SayCard'
