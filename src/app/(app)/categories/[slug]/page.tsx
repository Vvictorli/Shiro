import { PostItem } from '~/components/modules/post/PostItem'
import { BackToTopFAB } from '~/components/ui/fab'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { definePrerenderPage } from '~/lib/request.server'

import { getData } from './api'

type CategoryPostCard = {
  id: string
  title: string
  slug: string
  created: string
  summary?: string | null
  modified?: string | null
  count?: {
    read?: number
    like?: number
    comment?: number
  }
  tags?: string[]
  images?: { src?: string }[]
}

export default definePrerenderPage<{ slug: string }>()({
  fetcher(params) {
    return getData({ slug: params.slug })
  },

  Component: ({ data, params: { slug } }) => {
    const { name, children } = data
    const entries = children as CategoryPostCard[]

    return (
      <BottomToUpSoftScaleTransitionView>
        <header className="mb-4 md:mb-6">
          <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
            Category
          </p>
          <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
            分类 · {name}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {children.length > 0
              ? `当前共有 ${children.length} 篇文章`
              : `这里还没有内容`}
          </p>
        </header>

        <main className="text-zinc-950/80 dark:text-zinc-50/80">
          <div className="rounded-[26px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] px-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))] md:px-8">
            {entries.map((child, i) => {
              return (
                <BottomToUpTransitionView key={child.id} delay={120 + 45 * i}>
                  <PostItem
                    variant="list"
                    data={
                      {
                        ...child,
                        category: {
                          name,
                          slug: slug as string,
                        },
                      } as any
                    }
                  />
                </BottomToUpTransitionView>
              )
            })}
          </div>
        </main>
        <BackToTopFAB />
      </BottomToUpSoftScaleTransitionView>
    )
  },
})
