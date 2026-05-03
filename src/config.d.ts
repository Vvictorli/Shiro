import type { ScriptProps } from 'next/script'

declare global {
  export interface AppThemeConfig {
    config: AppConfig
    footer: FooterConfig
  }

  export interface AccentColor {
    light: string[]
    dark: string[]
  }

  export interface AppConfig {
    site: Site
    hero: Hero
    module: Module
    color?: AccentColor
    bg?: BackgroundConfig

    custom?: Custom

    poweredBy?: {
      vercel?: boolean
    }
  }

  export interface BackgroundConfig {
    images: string[]
    blur?: number
    opacity?: number
  }

  export interface LinkSection {
    name: string
    links: {
      name: string
      href: string
      external?: boolean
    }[]
  }

  export interface OtherInfo {
    date: string
    icp?: {
      text: string
      link: string
    }
  }

  export interface Custom {
    css: string[]
    js: string[]
    styles: string[]
    scripts: ScriptProps[]
  }

  export interface Site {
    favicon: string
    faviconDark?: string
  }
  export interface Hero {
    title: Title
    description: string
    hitokoto?: Hitokoto
  }
  export interface Title {
    template: TemplateItem[]
  }
  export interface Hitokoto {
    random?: boolean
    custom?: string
  }
  export interface TemplateItem {
    type: string
    text?: string
    class?: string
  }
  export interface Module {
    donate: Donate
    bilibili: Bilibili
    activity: {
      enable: boolean
      endpoint: string
    }
    movies?: MoviesModule
  }
  export interface MoviesModule {
    enable?: boolean
    watched?: MovieCollectionItem[]
    wishlist?: MovieCollectionItem[]
  }
  export interface MovieCollectionItem {
    id: string
    note?: string
    personalRating?: number
  }
  export interface Donate {
    enable: boolean
    link: string
    qrcode: string[]
  }
  export interface Bilibili {
    liveId: number
  }

  declare module '*?worker' {
    const workerConstructor: new () => Worker
    export default workerConstructor
  }
}
export {}
