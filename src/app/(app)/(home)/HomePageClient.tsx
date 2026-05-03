'use client'

import type { PostModel } from '@mx-space/api-client'
import clsx from 'clsx'
import { m } from 'motion/react'
import Image from 'next/image'
import type * as React from 'react'
import { createElement } from 'react'

import { isSupportIcon, SocialIcon } from '~/components/modules/home/SocialIcon'
import { BackgroundImageProvider } from '~/components/modules/shared/BackgroundImageProvider'
import {
  BottomToUpTransitionView,
  TextUpTransitionView,
} from '~/components/ui/transition'
import { softBouncePreset } from '~/constants/spring'
import { clsxm } from '~/lib/helper'
import { noopObj } from '~/lib/noop'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { ActivityPostList } from './components/ActivityPostList'

const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
  className,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode]
  leftContainerClassName?: string
  rightContainerClassName?: string
  className?: string
}) => {
  return (
    <div
      className={clsxm(
        'relative mx-auto block size-full min-w-0 max-w-[1800px] flex-col flex-wrap items-center lg:flex lg:flex-row',
        className,
      )}
    >
      {children.slice(0, 2).map((child, i) => {
        return (
          <div
            key={i}
            className={clsxm(
              'flex w-full flex-col center lg:h-auto lg:w-1/2',
              i === 0 ? leftContainerClassName : rightContainerClassName,
            )}
          >
            <div className="relative max-w-full lg:max-w-2xl">{child}</div>
          </div>
        )
      })}

      {children[2]}
    </div>
  )
}

const Hero = () => {
  const { title, description } = useAppConfigSelector((config) => ({
    ...config.hero,
  }))!
  const siteOwner = useAggregationSelector((agg) => agg.user)
  const { avatar, socialIds } = siteOwner || {}
  const hitokoto = '我的语言之局限，即我的世界之局限。'

  const titleAnimateD =
    title.template.reduce((acc, cur) => {
      return acc + (cur.text?.length || 0)
    }, 0) * 50

  return (
    <div className="mt-20 min-w-0 max-w-screen overflow-hidden lg:mt-[-4.5rem] lg:h-dvh lg:min-h-[800px]">
      <TwoColumnLayout leftContainerClassName="mt-[120px] lg:mt-0 lg:h-[15rem] lg:h-1/2">
        <>
          <m.div
            className="group relative text-center leading-[4] lg:text-left [&_*]:inline-block"
            initial={{ opacity: 0.0001, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softBouncePreset}
          >
            {title.template.map((t, i) => {
              const { type } = t
              const prevAllTextLength = title.template
                .slice(0, i)
                .reduce((acc, cur) => acc + (cur.text?.length || 0), 0)

              return createElement(
                type,
                { key: i, className: t.class },
                t.text && (
                  <TextUpTransitionView
                    initialDelay={prevAllTextLength * 0.05}
                    eachDelay={0.05}
                  >
                    {t.text}
                  </TextUpTransitionView>
                ),
              )
            })}
          </m.div>

          <BottomToUpTransitionView
            delay={titleAnimateD + 500}
            transition={softBouncePreset}
            className="my-3 text-center lg:text-left"
          >
            <span className="opacity-80">{description}</span>
          </BottomToUpTransitionView>

          <ul className="center mx-[60px] mt-8 flex flex-wrap gap-6 lg:mx-auto lg:mt-28 lg:justify-start lg:gap-4">
            {Object.entries(socialIds || noopObj).map(
              ([type, id]: any, index) => {
                if (!isSupportIcon(type)) return null

                return (
                  <BottomToUpTransitionView
                    key={type}
                    delay={index * 100 + titleAnimateD + 500}
                    className="inline-block"
                    as="li"
                  >
                    <SocialIcon id={id} type={type} />
                  </BottomToUpTransitionView>
                )
              },
            )}
          </ul>
        </>

        <div
          className={clsx('lg:size-[300px]', 'size-[200px]', 'mt-24 lg:mt-0')}
        >
          <Image
            height={300}
            width={300}
            src={avatar!}
            alt="Site Owner Avatar"
            className={clsxm(
              'aspect-square rounded-full border border-slate-200 dark:border-neutral-800',
              'w-full',
            )}
          />
        </div>

        <m.div
          initial={{ opacity: 0.0001, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={softBouncePreset}
          className={clsx(
            'center inset-x-0 bottom-0 mt-12 flex flex-col pb-8 lg:absolute lg:mt-0',
            'center text-neutral-800/80 dark:text-neutral-200/80',
          )}
        >
          <div className="group relative flex items-center justify-center">
            <small className="text-center">{hitokoto}</small>
          </div>
          <span className="mt-8 animate-bounce">
            <i className="i-mingcute-right-line rotate-90 text-2xl" />
          </span>
        </m.div>
      </TwoColumnLayout>
    </div>
  )
}

export function HomePageClient({ posts }: { posts: PostModel[] }) {
  const bgConfig = useAppConfigSelector((config) => config.bg)
  const hasBgConfig = bgConfig && bgConfig.images && bgConfig.images.length > 0

  return (
    <div className={hasBgConfig ? 'home-background' : ''}>
      {hasBgConfig && <BackgroundImageProvider />}
      <Hero />
      <div className="mt-10 lg:mt-2">
        <div className="mx-auto max-w-[1800px]">
          <ActivityPostList posts={posts} />
        </div>
      </div>
    </div>
  )
}
