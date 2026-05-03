'use client'

import type { PostModel } from '@mx-space/api-client'
import { m } from 'motion/react'

import { PostItem } from '~/components/modules/post/PostItem'
import { softBouncePreset } from '~/constants/spring'

export const ActivityPostList = ({ posts }: { posts: PostModel[] }) => {
  return (
    <m.section
      initial={{ opacity: 0.0001, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={softBouncePreset}
      className="mx-auto mt-6 w-full max-w-[52rem] px-4 lg:mt-0"
      viewport={{ once: true }}
    >
      {posts.length === 0 ? (
        <div className="rounded-[22px] border border-zinc-200/80 bg-white/70 px-5 py-10 text-sm text-zinc-500 dark:border-zinc-800/90 dark:bg-zinc-900/50 dark:text-zinc-400">
          暂时还没有可展示的博文。
        </div>
      ) : (
        <div className="rounded-[26px] border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] px-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.18)] dark:border-zinc-800/90 dark:bg-[linear-gradient(180deg,rgba(21,24,32,0.92),rgba(18,21,28,0.82))] md:px-8">
          {posts.map((item, index) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0.0001, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...softBouncePreset, delay: index * 0.04 }}
              viewport={{ once: true, margin: '-10% 0px' }}
            >
              <PostItem data={item} variant="list" />
            </m.div>
          ))}
        </div>
      )}
    </m.section>
  )
}
