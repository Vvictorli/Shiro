import type { PostModel } from '@mx-space/api-client'
import Link from 'next/link'
import { memo } from 'react'

import { PostPinIcon } from '~/components/modules/post/PostPinIcon'
import { parseDate } from '~/lib/datetime'

import { PostItemHoverOverlay } from './PostItemHoverOverlay'

type PostCountWithComment = PostModel['count'] & { comment?: number }

export const PostItem = memo<{
  data: PostModel
  variant?: 'card' | 'list'
}>(function PostItem({ data, variant = 'card' }) {
  const hasImage = data.images?.length > 0 && data.images[0].src
  const categorySlug = data.category?.slug
  const postLink = `/posts/${categorySlug}/${data.slug}`
  const tags = data.tags?.filter(Boolean) || []
  const summary = data.summary?.trim() || ''

  if (variant === 'list') {
    return (
      <article className="border-b border-zinc-200/70 py-4 last:border-b-0 dark:border-zinc-800/80 md:py-5">
        <Link
          href={postLink}
          className="group block focus-visible:!shadow-none"
        >
          <PostItemHoverOverlay />

          <h2 className="mt-2 text-balance break-words text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.015em] text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200 md:text-[1.7rem]">
            {data.title}
            <PostPinIcon pin={!!data.pin} id={data.id} />
          </h2>

          {summary ? (
            <p className="mt-2 line-clamp-3 text-[14px] leading-7 text-zinc-600 dark:text-zinc-400 md:text-[15px]">
              {summary}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            <time className="tabular-nums">
              {parseDate(data.created, 'YYYY-MM-DD')}
            </time>
            {!!data.pin && (
              <span className="inline-flex items-center gap-1">
                <i className="i-mingcute-arrow-up-line text-xs" />
                置顶
              </span>
            )}
            {data.category?.slug ? (
              <Link
                href={`/categories/${data.category.slug}`}
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {data.category?.name || '博文'}
              </Link>
            ) : (
              <span>{data.category?.name || '博文'}</span>
            )}
            {tags.length > 0
              ? tags.map((tag) => (
                  <span key={tag} className="text-zinc-500 dark:text-zinc-400">
                    #{tag}
                  </span>
                ))
              : null}
            <span>{data.count?.read ?? 0} 阅读</span>
            <span>{data.count?.like ?? 0} 喜欢</span>
            <span>
              {(data.count as PostCountWithComment | undefined)?.comment ?? 0}{' '}
              评论
            </span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <Link
      href={postLink}
      className="group relative flex flex-col py-5 focus-visible:!shadow-none md:py-6"
    >
      <PostItemHoverOverlay />
      <div className="bg-white/82 relative overflow-hidden rounded-[22px] border border-zinc-200/80 p-3 shadow-[0_18px_56px_-54px_rgba(15,23,42,0.28)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-zinc-300/90 group-hover:shadow-[0_24px_64px_-52px_rgba(15,23,42,0.34)] dark:border-zinc-800/90 dark:bg-zinc-950/55 dark:group-hover:border-zinc-700/90">
        {hasImage ? (
          <div
            className="relative h-[180px] w-full overflow-hidden rounded-[18px] bg-zinc-100 bg-cover bg-center bg-no-repeat transition duration-500 group-hover:scale-[1.015] md:h-[250px]"
            style={{ backgroundImage: `url(${hasImage})` }}
          />
        ) : null}

        <div className="px-1 pb-1 pt-3 md:px-1.5 md:pt-4">
          <div className="mb-2.5 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex size-4 items-center justify-center rounded-sm bg-zinc-900 text-[10px] text-white dark:bg-zinc-100 dark:text-zinc-900">
              ▣
            </span>
            <span className="tracking-[0.08em]">
              {data.category?.name || '博文'}
            </span>
          </div>
          <h2 className="relative text-balance break-words text-[1.58rem] font-semibold leading-[1.16] tracking-[-0.015em] text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200 md:text-[1.95rem]">
            {data.title}

            <PostPinIcon pin={!!data.pin} id={data.id} />
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            <time className="tabular-nums">
              {parseDate(data.created, 'YYYY-MM-DD')}
            </time>
            {tags.length > 0 ? (
              <span className="inline-flex items-center">
                {tags.map((tag, index) => (
                  <span key={tag} className="inline-flex items-center">
                    {index > 0 ? (
                      <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">
                        /
                      </span>
                    ) : null}
                    <span>{tag}</span>
                  </span>
                ))}
              </span>
            ) : null}
            <span>{data.count?.read ?? 0} 阅读</span>
            <span>{data.count?.like ?? 0} 喜欢</span>
            <span>
              {(data.count as PostCountWithComment | undefined)?.comment ?? 0}{' '}
              评论
            </span>
          </div>

          <div className="mt-3 h-px w-full bg-zinc-200/85 dark:bg-zinc-800/85" />
        </div>
      </div>
    </Link>
  )
})
