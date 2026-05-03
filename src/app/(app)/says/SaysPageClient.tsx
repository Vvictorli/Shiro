'use client'

import type { SayModel } from '@mx-space/api-client'

import { SayMasonry } from '~/components/modules/say/SayMasonry'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { FullPageLoading } from '~/components/ui/loading'

type SayPage = {
  data: SayModel[]
  pagination: {
    total: number
    size: number
    currentPage?: number
    current_page?: number
    totalPage?: number
    total_page?: number
    hasNextPage?: boolean
    has_next_page?: boolean
    hasPrevPage?: boolean
    has_prev_page?: boolean
  }
}

export function SaysPageClient({ initialPage }: { initialPage?: SayPage }) {
  if (!initialPage) {
    return <FullPageLoading />
  }

  if (initialPage.data.length === 0) return <NothingFound />

  return (
    <div>
      <header className="mb-4 md:mb-6">
        <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-zinc-400 dark:text-zinc-500">
          Says
        </p>
        <h1 className="text-balance font-serif text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50 md:text-[2.4rem]">
          说说
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400 md:text-[15px]">
          把一时想到的话，安静地留在这里。
        </p>
      </header>

      <main className="mt-10">
        <SayMasonry initialPage={initialPage} />
      </main>
    </div>
  )
}
