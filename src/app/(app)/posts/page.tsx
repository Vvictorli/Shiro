import Link from 'next/link'

import { NormalContainer } from '~/components/layout/container/Normal'
import { PostsSortingFab } from '~/components/modules/post/fab/PostsSortingFab'
import { PostTagsFAB } from '~/components/modules/post/fab/PostTagsFAB'
import { PostItem } from '~/components/modules/post/PostItem'
import { PostPagination } from '~/components/modules/post/PostPagination'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { SearchFAB } from '~/components/modules/shared/SearchFAB'
import { BackToTopFAB } from '~/components/ui/fab'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { OnlyDesktop } from '~/components/ui/viewport'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

interface Props {
  page?: string
  size?: string
  sortBy?: string
  orderBy?: string
  tag?: string
}

export const metadata = {
  title: '文章列表',
}

export default definePrerenderPage<Props>()({
  fetcher: async (params) => {
    const { page, size, orderBy, sortBy } = params || {}
    const currentPage = page ? Number.parseInt(page) : 1
    const currentSize = size ? Number.parseInt(size) : 10

    return await apiClient.post.getList(currentPage, currentSize, {
      sortBy: sortBy as any,
      sortOrder: orderBy === 'desc' ? -1 : 1,
    })
  },
  Component: async (props) => {
    const { params } = props
    const { data, pagination } = props.data
    const { page, tag } = params

    const normalizedTag = tag?.trim()
    const filteredData = normalizedTag
      ? data.filter((item) => item.tags?.includes(normalizedTag))
      : data

    if (!filteredData?.length) {
      return <NothingFound />
    }
    return (
      <NormalContainer className="max-w-[52rem]">
        <header className="mb-4 md:mb-6">
          <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
            Essays
          </p>
          <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
            博文
          </h1>
          {normalizedTag ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span>
                标签：
                <span className="ml-1 font-medium text-zinc-900 dark:text-zinc-100">
                  {normalizedTag}
                </span>
              </span>
              <Link
                href="/posts"
                className="text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                清除筛选
              </Link>
            </div>
          ) : null}
        </header>

        <div className="rounded-[26px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] px-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))] md:px-8">
          {filteredData.map((item, index) => {
            return (
              <BottomToUpTransitionView
                lcpOptimization
                key={item.id}
                delay={index * 80}
              >
                <PostItem data={item} variant="list" />
              </BottomToUpTransitionView>
            )
          })}
        </div>

        {!normalizedTag ? <PostPagination pagination={pagination} /> : null}

        <PostsSortingFab />
        <PostTagsFAB />
        <SearchFAB />
        <OnlyDesktop>
          <BackToTopFAB />
        </OnlyDesktop>
      </NormalContainer>
    )
  },
})
