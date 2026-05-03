'use client'

import { useMemo, useState } from 'react'

import { MingcuteStarHalfFill } from '~/components/icons/star'
import * as Tabs from '~/components/ui/tabs/Tabs'
import { clsxm } from '~/lib/helper'

import { TYPE_LABELS } from './filters.mjs'
import type { MovieWallCard } from './page'

type MovieWallSection = {
  key: 'watched' | 'wishlist'
  title: string
  description: string
  items: MovieWallCard[]
}

function TabPanelHeader(props: { count: number }) {
  void props

  return (
    <div className="mb-5 border-b border-zinc-200/80 pb-3 dark:border-zinc-800" />
  )
}

function MovieEntry({ item }: { item: MovieWallCard }) {
  const typeLabel =
    item.type === 'tv'
      ? '剧集'
      : item.type
        ? (TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] ?? '未分类')
        : null

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-[24px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] p-4 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(22,26,35,0.92),rgba(18,22,30,0.8))] dark:hover:border-zinc-700"
    >
      <article className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 md:grid-cols-[112px_minmax(0,1fr)] md:gap-5">
        <div className="relative h-[156px] w-[104px] self-start overflow-hidden rounded-[18px] bg-zinc-100 shadow-sm dark:bg-zinc-800 md:h-[168px] md:w-[112px]">
          {item.poster ? (
            <img
              src={item.poster}
              alt={item.title}
              className="size-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="center flex size-full text-xs text-zinc-500 dark:text-zinc-400">
              暂无海报
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="min-w-0 space-y-3">
            <div className="min-w-0">
              <h3 className="break-keep text-[20px] font-medium leading-[1.15] tracking-tight text-zinc-950 dark:text-zinc-50 md:text-[21px]">
                {item.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-700/75 dark:text-zinc-300/70">
                {item.originalTitle !== item.title && (
                  <span className="max-w-[18ch] truncate">
                    {item.originalTitle}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-700/75 dark:text-zinc-300/70">
              {item.year && <span className="tabular-nums">{item.year}</span>}
              {item.year && typeLabel && (
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
              )}
              {typeLabel && <span>{typeLabel}</span>}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-start gap-2">
              {typeof item.doubanRating === 'number' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <MingcuteStarHalfFill />
                  豆瓣 {item.doubanRating.toFixed(1)}
                </span>
              )}
              {typeof item.personalRating === 'number' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                  自评 {item.personalRating.toFixed(0)}/5
                </span>
              )}
              {item.rating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                  <MingcuteStarHalfFill />
                  TMDB {item.rating.toFixed(1)}
                </span>
              )}
            </div>

            {item.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {item.note && (
            <p className="mt-4 border-t border-zinc-200/70 pt-4 text-sm italic leading-6 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              {item.note}
            </p>
          )}
        </div>
      </article>
    </a>
  )
}

function SectionContent({ section }: { section: MovieWallSection }) {
  return (
    <>
      <TabPanelHeader count={section.items.length} />

      {section.items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {section.items.map((item) => (
            <MovieEntry key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-zinc-300/80 bg-zinc-50/70 px-5 py-10 text-sm leading-7 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
          这里还空着。把样板或全量数据填进
          <code className="mx-1 rounded bg-zinc-200/80 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
            src/app/(app)/movies/douban-watched.json
          </code>
          ，这面墙就会继续长出来。
        </div>
      )}
    </>
  )
}

export function MoviesTabs({ sections }: { sections: MovieWallSection[] }) {
  const defaultValue = useMemo(() => sections[0]?.key || 'watched', [sections])
  const [currentTab, setCurrentTab] = useState(defaultValue)

  if (sections.length <= 1) {
    const onlySection = sections[0]

    if (!onlySection) {
      return null
    }

    return <SectionContent section={onlySection} />
  }

  return (
    <Tabs.Root
      value={currentTab}
      onValueChange={(value) => setCurrentTab(value as MovieWallSection['key'])}
      className="gap-8"
    >
      <Tabs.List
        id="movie-tabs"
        className="mb-1 flex w-full gap-6 border-b border-zinc-200/80 pb-3 dark:border-zinc-800"
      >
        {sections.map((section) => (
          <Tabs.Trigger
            key={section.key}
            value={section.key}
            selected={currentTab === section.key}
            className={clsxm(
              'px-0 pb-1 text-base font-medium tracking-tight',
              currentTab === section.key
                ? 'text-zinc-950 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200',
            )}
          >
            {section.title}
            <span className="ml-2 text-xs tabular-nums opacity-70">
              {section.items.length}
            </span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {sections.map((section) => (
        <Tabs.Content key={section.key} value={section.key}>
          <SectionContent section={section} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
