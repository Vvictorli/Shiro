import Link from 'next/link'
import { $fetch } from 'ofetch'

import { SimpleIconsThemoviedatabase } from '~/components/icons/platform/TheMovieDB'
import { NormalContainer } from '~/components/layout/container/Normal'
import { apiClient } from '~/lib/request'
import { createPosterAssetUrl } from '~/lib/tmdb.mjs'

import {
  ORDER_OPTIONS,
  parseMoviesQuery,
  SORT_OPTIONS,
  TYPE_FILTER_OPTIONS,
} from './filters.mjs'
import { MoviesTabs } from './MoviesTabs'

export const revalidate = 21600
const MOVIES_PER_PAGE = 24

type LocalMovieWallItem = {
  title: string
  originalTitle?: string
  poster?: string | null
  year?: string | null
  href: string
  type?: string | null
  genres?: string[]
  doubanRating?: number | null
  watchedAt?: string
  note?: string
  personalRating?: number
}

type MovieWallItem = LocalMovieWallItem

type MovieWallSection = {
  key: 'watched'
  title: string
  description: string
  items: MovieWallCard[]
}

export type MovieWallCard = {
  id: string
  type: string | null
  title: string
  originalTitle: string
  poster: string | null
  doubanRating?: number | null
  rating: number | null
  year: string | null
  href: string
  genres: string[]
  watchedAt?: string
  note?: string
  personalRating?: number
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return null
}

function normalizeWatchedItems(watched: unknown): LocalMovieWallItem[] {
  if (!Array.isArray(watched)) {
    return []
  }

  return watched
    .map((item): LocalMovieWallItem | null => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const raw = item as Record<string, unknown>
      const href = toStringOrNull(raw.href) || toStringOrNull(raw.id)
      if (!href) {
        return null
      }

      const title =
        toStringOrNull(raw.title) ||
        toStringOrNull(raw.name) ||
        toStringOrNull(raw.original_title) ||
        toStringOrNull(raw.originalTitle) ||
        'Untitled'

      const genresRaw = raw.genres
      const genres = Array.isArray(genresRaw)
        ? genresRaw.filter(
            (genre): genre is string => typeof genre === 'string',
          )
        : []

      const personalRatingValue =
        toNumber(raw.personalRating) ?? toNumber(raw.personal_rating)
      const doubanRatingValue =
        toNumber(raw.doubanRating) ?? toNumber(raw.douban_rating)

      return {
        href,
        title,
        originalTitle:
          toStringOrNull(raw.originalTitle) ||
          toStringOrNull(raw.original_title) ||
          undefined,
        poster:
          toStringOrNull(raw.poster) ||
          toStringOrNull(raw.poster_url) ||
          toStringOrNull(raw.posterUrl) ||
          toStringOrNull(raw.cover) ||
          null,
        year: toStringOrNull(raw.year),
        type: toStringOrNull(raw.type) || toStringOrNull(raw.category),
        genres,
        doubanRating: doubanRatingValue,
        watchedAt:
          toStringOrNull(raw.watchedAt) ||
          toStringOrNull(raw.watched_at) ||
          undefined,
        note: toStringOrNull(raw.note) || undefined,
        personalRating: personalRatingValue ?? undefined,
      }
    })
    .filter((item): item is LocalMovieWallItem => item !== null)
}

type MoviesListResponse = {
  data?: unknown[]
  documents?: unknown[]
  pagination?: {
    currentPage?: number
    current_page?: number
    totalPage?: number
    total_page?: number
    totalPages?: number
    total_pages?: number
    page?: number
    size?: number
    pageSize?: number
    page_size?: number
    hasNextPage?: boolean
    has_next_page?: boolean
    hasPrevPage?: boolean
    has_prev_page?: boolean
    total?: number
    count?: number
    itemCount?: number
    item_count?: number
    totalCount?: number
    total_count?: number
  }
  totalPage?: number
  total_page?: number
  totalPages?: number
  total_pages?: number
  page?: number
  currentPage?: number
  current_page?: number
  size?: number
  pageSize?: number
  page_size?: number
  total?: number
  count?: number
  itemCount?: number
  item_count?: number
  totalCount?: number
  total_count?: number
  hasNextPage?: boolean
  has_next_page?: boolean
  hasPrevPage?: boolean
  has_prev_page?: boolean
}

function getMoviesApiUrl() {
  const aggregateUrl = new URL(apiClient.aggregate.proxy.toString(true))
  aggregateUrl.pathname = aggregateUrl.pathname.replace(
    /\/aggregate\/?$/,
    '/movies',
  )
  return aggregateUrl.toString()
}

function getPaginationNumber(value: unknown): number | null {
  const parsed = toNumber(value)
  if (parsed === null) return null
  const int = Math.floor(parsed)
  return int > 0 ? int : null
}

function resolveMoviesPagination(
  list: MoviesListResponse,
  fallbackSize: number,
) {
  const source = list.pagination || {}

  const currentPage =
    getPaginationNumber(source.currentPage) ||
    getPaginationNumber(source.current_page) ||
    getPaginationNumber(source.page) ||
    getPaginationNumber(list.currentPage) ||
    getPaginationNumber(list.current_page) ||
    getPaginationNumber(list.page) ||
    1

  const pageSize =
    getPaginationNumber(source.pageSize) ||
    getPaginationNumber(source.page_size) ||
    getPaginationNumber(source.size) ||
    getPaginationNumber(list.pageSize) ||
    getPaginationNumber(list.page_size) ||
    getPaginationNumber(list.size) ||
    fallbackSize

  const totalItems =
    getPaginationNumber(source.total) ||
    getPaginationNumber(source.totalCount) ||
    getPaginationNumber(source.total_count) ||
    getPaginationNumber(source.itemCount) ||
    getPaginationNumber(source.item_count) ||
    getPaginationNumber(source.count) ||
    getPaginationNumber(list.total) ||
    getPaginationNumber(list.totalCount) ||
    getPaginationNumber(list.total_count) ||
    getPaginationNumber(list.itemCount) ||
    getPaginationNumber(list.item_count) ||
    getPaginationNumber(list.count)

  const totalPagesFromApi =
    getPaginationNumber(source.totalPage) ||
    getPaginationNumber(source.total_page) ||
    getPaginationNumber(source.totalPages) ||
    getPaginationNumber(source.total_pages) ||
    getPaginationNumber(list.totalPage) ||
    getPaginationNumber(list.total_page) ||
    getPaginationNumber(list.totalPages) ||
    getPaginationNumber(list.total_pages)

  const hasNextPage =
    source.hasNextPage === true ||
    source.has_next_page === true ||
    list.hasNextPage === true ||
    list.has_next_page === true
  const hasPrevPage =
    source.hasPrevPage === true ||
    source.has_prev_page === true ||
    list.hasPrevPage === true ||
    list.has_prev_page === true

  const totalPages =
    totalPagesFromApi ||
    (totalItems
      ? Math.max(1, Math.ceil(totalItems / pageSize))
      : hasNextPage
        ? currentPage + 1
        : hasPrevPage
          ? currentPage
          : Math.max(1, currentPage))

  return { currentPage, totalPages }
}

async function fetchMovieWallCard(item: MovieWallItem): Promise<MovieWallCard> {
  return {
    id: item.href,
    type: item.type ?? null,
    title: item.title,
    originalTitle: item.originalTitle || item.title,
    poster: createPosterAssetUrl({
      poster: item.poster ?? null,
      href: item.href,
    }),
    doubanRating: item.doubanRating ?? null,
    rating: null,
    year: item.year ?? null,
    href: item.href,
    genres: item.genres ?? [],
    watchedAt: item.watchedAt,
    note: item.note,
    personalRating: item.personalRating,
  }
}

function getSafePageNumber(
  input: string | string[] | undefined,
  totalPages: number,
) {
  const pageValue = Array.isArray(input) ? input[0] : input
  const parsed = Number.parseInt(pageValue || '1', 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, totalPages)
}

type MoviesSearchState = ReturnType<typeof parseMoviesQuery>

function buildMoviesHref(
  page: number,
  state: MoviesSearchState,
  overrides?: Partial<MoviesSearchState>,
) {
  const next = {
    ...state,
    ...overrides,
  }

  const params = new URLSearchParams()

  if (next.type !== 'all') {
    params.set('type', next.type)
  }

  if (next.genre !== 'all') {
    params.set('genre', next.genre)
  }

  if (next.sort) {
    params.set('sort', next.sort)

    if (next.order !== 'desc') {
      params.set('order', next.order)
    }
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()
  return query ? `/movies?${query}` : '/movies'
}

function FilterLink(props: {
  href: string
  label: string
  selected?: boolean
  compact?: boolean
}) {
  return (
    <Link
      href={props.href}
      className={[
        'inline-flex items-center rounded-full border transition-colors',
        props.compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
        props.selected
          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
          : 'border-zinc-200 bg-white/85 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50',
      ].join(' ')}
    >
      {props.label}
    </Link>
  )
}

function MoviesFilters(props: { state: MoviesSearchState }) {
  const { state } = props

  return (
    <section className="mb-10 rounded-[28px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))] p-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))]">
      <div className="flex flex-col gap-6">
        <div className="space-y-5">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
              类型
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTER_OPTIONS.map((option) => (
                <FilterLink
                  key={option.value}
                  href={buildMoviesHref(1, state, {
                    type: option.value,
                    genre: 'all',
                  })}
                  label={option.label}
                  selected={state.type === option.value}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
                排序
              </p>
              <div className="inline-flex flex-wrap rounded-full border border-zinc-200 bg-white/80 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    href={buildMoviesHref(1, state, { sort: option.value })}
                    className={[
                      'rounded-full px-4 py-2 text-sm transition-colors',
                      state.sort === option.value
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50',
                    ].join(' ')}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>

            {state.sort ? (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
                  方向
                </p>
                <div className="inline-flex rounded-full border border-zinc-200 bg-white/80 p-1 dark:border-zinc-800 dark:bg-zinc-900/70">
                  {ORDER_OPTIONS.map((option) => (
                    <Link
                      key={option.value}
                      href={buildMoviesHref(1, state, { order: option.value })}
                      className={[
                        'rounded-full px-4 py-2 text-sm transition-colors',
                        state.order === option.value
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50',
                      ].join(' ')}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function MoviesPagination(props: {
  currentPage: number
  totalPages: number
  state: MoviesSearchState
}) {
  const { currentPage, totalPages, state } = props
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  return (
    <nav className="mt-10 flex items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 text-sm dark:border-zinc-800">
      <div>
        {hasPrevPage ? (
          <Link
            href={buildMoviesHref(currentPage - 1, state)}
            className="inline-flex items-center rounded-full border border-zinc-300/80 px-4 py-2 text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          >
            上一页
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
            上一页
          </span>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500">
          Page
        </p>
        <p className="mt-1 font-medium tabular-nums text-zinc-700 dark:text-zinc-200">
          {currentPage} / {totalPages}
        </p>
      </div>

      <div>
        {hasNextPage ? (
          <Link
            href={buildMoviesHref(currentPage + 1, state)}
            className="inline-flex items-center rounded-full border border-zinc-300/80 px-4 py-2 text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          >
            下一页
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
            下一页
          </span>
        )}
      </div>
    </nav>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string | string[]
    type?: string | string[]
    genre?: string | string[]
    sort?: string | string[]
    order?: string | string[]
  }>
}) {
  const resolvedSearchParams = await searchParams
  const filterState = parseMoviesQuery(resolvedSearchParams)
  const requestedPage = getSafePageNumber(
    resolvedSearchParams?.page,
    Number.MAX_SAFE_INTEGER,
  )
  const list = await $fetch<MoviesListResponse>(getMoviesApiUrl(), {
    params: {
      page: requestedPage,
      size: MOVIES_PER_PAGE,
      type: filterState.type === 'all' ? undefined : filterState.type,
      genre: filterState.genre === 'all' ? undefined : filterState.genre,
      sort: filterState.sort || undefined,
      order: filterState.sort ? filterState.order || 'desc' : undefined,
    },
    next: {
      revalidate,
      tags: ['movies'],
    },
  }).catch(
    (): MoviesListResponse => ({
      data: [],
      documents: [],
      pagination: { currentPage: 1, totalPage: 1 },
    }),
  )

  const watched = normalizeWatchedItems(list.data ?? list.documents)
  const pageState = resolveMoviesPagination(list, MOVIES_PER_PAGE)
  const totalPages = Math.max(1, pageState.totalPages)
  const currentPage = getSafePageNumber(
    String(pageState.currentPage),
    totalPages,
  )
  const results = await Promise.allSettled(
    watched.map((item) => fetchMovieWallCard(item)),
  )
  const sections: MovieWallSection[] = [
    {
      key: 'watched',
      title: '已看过',
      description: '把看过的故事，慢慢排成一页一页可回望的光。',
      items: results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value),
    },
  ]

  return (
    <NormalContainer>
      <header className="mb-4 md:mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
          <SimpleIconsThemoviedatabase className="size-4 text-[#0D243F] dark:text-[#5CB7D2]" />
          <span>Cinematic Notes</span>
        </div>
        <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
          光影
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400 md:text-[15px]">
          把看过的故事，慢慢排成一页一页可回望的光。
        </p>
      </header>

      <main className="mt-4 text-zinc-950/85 dark:text-zinc-50/85">
        <MoviesFilters state={filterState} />

        {sections[0].items.length > 0 ? (
          <>
            <MoviesTabs sections={sections} />
            <MoviesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              state={filterState}
            />
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-zinc-300/80 bg-zinc-50/70 px-5 py-10 text-sm leading-7 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
            这一组条件下还没有找到作品。换个类型、类别，或者把排序清一清，墙上的灯就会再亮起来。
          </div>
        )}
      </main>
    </NormalContainer>
  )
}
