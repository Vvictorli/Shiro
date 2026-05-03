import type { RecommendationItem } from './types'
import { recommendationTypeLabels } from './types'

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function RecommendationGrid({ items }: { items: RecommendationItem[] }) {
  if (items.length === 0) {
    return (
      <section className="flex min-h-64 w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-zinc-200/80 bg-white/60 px-6 py-12 text-center dark:border-zinc-800/80 dark:bg-zinc-950/35 md:min-h-72">
        <div className="mb-3 text-zinc-300 dark:text-zinc-700">
          <i className="i-mingcute-search-line text-4xl" />
        </div>
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          暂时没有找到对应内容
        </h2>
        <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          换个关键词试试，或者切换到别的分类看看。
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="bg-white/82 group rounded-[22px] border border-zinc-200/80 p-2.5 shadow-[0_18px_56px_-54px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300/90 hover:shadow-[0_24px_64px_-52px_rgba(15,23,42,0.34)] dark:border-zinc-800/90 dark:bg-zinc-950/55 dark:hover:border-zinc-700/90"
        >
          {item.cover ? (
            <div
              className="mb-3 h-[156px] rounded-[16px] bg-zinc-100 bg-cover bg-center bg-no-repeat md:h-[176px]"
              style={{ backgroundImage: `url(${item.cover})` }}
            />
          ) : null}

          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            <span>{recommendationTypeLabels[item.type]}</span>
            {item.isFeatured ? (
              <span className="text-amber-500">精选</span>
            ) : null}
          </div>

          <h2 className="text-balance text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.015em] text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
            {item.title}
          </h2>

          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {item.sourceName || getHostname(item.url)}
          </div>

          <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {item.description || '没有写太多说明，但它值得被留在这里。'}
          </p>
        </a>
      ))}
    </section>
  )
}
