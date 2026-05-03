import type { ModelWithLiked, PostModel } from '@mx-space/api-client'
import type { Metadata } from 'next'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import {
  PostActionAside,
  PostBottomBarAction,
  PostCopyright,
  PostOutdate,
  PostRelated,
} from '~/components/modules/post'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { GoToAdminEditingButton } from '~/components/modules/shared/GoToAdminEditingButton'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { definePrerenderPage } from '~/lib/request.server'
import { CurrentPostDataProvider } from '~/providers/post/CurrentPostDataProvider'
import {
  LayoutRightSidePortal,
  LayoutRightSideProvider,
} from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import type { PageParams } from './api'
import { getData } from './api'
import {
  HeaderMetaInfoSetting,
  MarkdownSelection,
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
  PostTagRow,
  PostTitle,
  SlugReplacer,
} from './pageExtra'

export const dynamic = 'force-dynamic'

export const generateMetadata = async ({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> => {
  const resolvedParams = await params
  const { slug } = resolvedParams
  try {
    const data = await getData(resolvedParams)
    const {
      title,
      category: { slug: categorySlug },
      text,
      meta,
    } = data
    const description = getSummaryFromMd(text ?? '')

    const ogImage = await getOgUrl('post', {
      category: categorySlug,
      slug,
    })

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
        type: 'article',
      },
      twitter: {
        images: ogImage,
        title,
        description,
        card: 'summary_large_image',
      },
      category: categorySlug,
    } satisfies Metadata
  } catch {
    return {}
  }
}

const PostPage = ({ data }: { data: ModelWithLiked<PostModel> }) => {
  const { id } = data
  return (
    <div className="relative w-full min-w-0">
      <AckRead id={id} type="post" />
      <HeaderMetaInfoSetting />
      <div>
        <div className="relative mb-10 overflow-hidden rounded-[28px] border border-zinc-200/75 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(248,250,252,0.88)_42%,rgba(244,244,245,0.78)_100%)] px-5 py-7 shadow-[0_38px_100px_-88px_rgba(15,23,42,0.38)] dark:border-zinc-800/85 dark:bg-[radial-gradient(circle_at_top,rgba(39,39,42,0.85),rgba(24,24,27,0.88)_50%,rgba(10,10,12,0.92)_100%)] md:p-10">
          <div className="mb-4 text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
            {data.category.name}
          </div>
          <PostTitle />
          <GoToAdminEditingButton
            id={id!}
            type="posts"
            className="absolute -top-6 right-0"
          />

          <PostMetaBarInternal className="mt-4 justify-center text-zinc-500 dark:text-zinc-400" />
          <PostTagRow />

          <SummarySwitcher data={data} />

          <PostOutdate />

          <PostRelated infoText="阅读此文章之前，你可能需要首先阅读以下的文章才能更好的理解上下文。" />
        </div>
        <WrappedElementProvider eoaDetect>
          <ReadIndicatorForMobile />

          <PostMarkdownImageRecordProvider>
            <MarkdownSelection>
              <article className="article-prose prose relative mx-auto max-w-[46rem] px-1 md:px-0">
                <div className="sr-only">
                  <PostTitle />
                </div>
                <PostMarkdown />
              </article>
            </MarkdownSelection>
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <ArticleRightAside>
              <PostActionAside />
            </ArticleRightAside>
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </div>
      <ClientOnly>
        <PostRelated infoText="关联阅读" />
        <PostCopyright />

        {/* <SubscribeBell defaultType="post_c" /> */}
        <PostBottomBarAction />
      </ClientOnly>
    </div>
  )
}

export default definePrerenderPage<PageParams>()({
  fetcher(params) {
    return getData(params)
  },

  Component: async (props) => {
    const { data, params } = props

    const fullPath = `/posts/${data.category.slug}/${data.slug}`
    const currentPath = `/posts/${params.category}/${params.slug}`

    return (
      <>
        {currentPath !== fullPath && <SlugReplacer to={fullPath} />}

        <CurrentPostDataProvider data={data} />
        <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
          <BottomToUpTransitionView className="min-w-0">
            <PostPage data={data} />

            <BottomToUpSoftScaleTransitionView delay={500}>
              <CommentAreaRootLazy
                refId={data.id}
                allowComment={data.allowComment}
              />
            </BottomToUpSoftScaleTransitionView>
          </BottomToUpTransitionView>

          <LayoutRightSideProvider className="relative hidden lg:block" />
        </div>

        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </>
    )
  },
})
