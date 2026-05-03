'use client'

import { usePathname } from 'next/navigation'

import { OnlyDesktop } from '~/components/ui/viewport'

const NETEASE_PLAYLIST_URL =
  'https://enamscard.pages.dev/?playlist=17942371611&theme=dark&themeColor=%23008eff'

export const LeftMusicCard = () => {
  const pathname = usePathname()

  if (pathname === '/') {
    return null
  }

  return (
    <OnlyDesktop>
      <aside className="pointer-events-none fixed left-6 top-32 z-20 hidden xl:block">
        <div className="bg-white/72 dark:bg-neutral-900/72 pointer-events-auto overflow-hidden rounded-[14px] border border-zinc-900/5 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.26)] backdrop-blur-md dark:border-zinc-100/10">
          <iframe
            title="NetEase Music Card"
            src={NETEASE_PLAYLIST_URL}
            width="260"
            height="110"
            style={{ border: 'none', borderRadius: 8, display: 'block' }}
            frameBorder="0"
          />
        </div>
      </aside>
    </OnlyDesktop>
  )
}
