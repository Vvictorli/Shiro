import type { ReactNode } from 'react'
import { createElement as h } from 'react'

import {
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidHistory,
  IcTwotoneSignpost,
} from '~/components/icons/menu-collection'
import { SimpleIconsThemoviedatabase } from '~/components/icons/platform/TheMovieDB'
import { JamTags } from '~/components/icons/tag'

export interface IHeaderMenu {
  title: string
  path: string
  type?: string
  icon?: ReactNode
  subMenu?: Omit<IHeaderMenu, 'exclude'>[]
  exclude?: string[]
}
export const headerMenuConfig: IHeaderMenu[] = [
  {
    title: '首页',
    path: '/',
    type: 'Home',
    icon: h(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: '文稿',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: h(IcTwotoneSignpost),
  },
  {
    title: '说说',
    icon: h(FaSolidComments),
    path: '/says',
  },
  {
    title: '收藏',
    path: '/recommendations',
    icon: h('i', {
      className: 'i-mingcute-compass-3-line flex center',
    }),
  },
  {
    title: '光影',
    icon: h(SimpleIconsThemoviedatabase, {
      className: 'text-[#0D243F] dark:text-[#5CB7D2]',
    }),
    path: '/movies',
  },
  {
    title: '相册',
    path: 'https://albums.vvictor.de/',
    icon: h('i', {
      className: 'i-mingcute-camera-line flex center',
    }),
  },
  {
    title: '标签',
    path: '/tags',
    icon: h(JamTags, {
      className: 'size-[1.05em]',
    }),
  },

  {
    title: '时光',
    icon: h(FaSolidHistory),
    path: '/timeline',
    subMenu: [],
  },
]
