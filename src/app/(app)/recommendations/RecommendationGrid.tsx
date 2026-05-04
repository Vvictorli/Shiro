import type { RecommendationItem } from './types'
import { recommendationTypeLabels } from './types'

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
          title={item.title}
          className="bg-white/82 flex min-h-full flex-col rounded-[22px] border border-zinc-200/80 p-2.5 shadow-[0_18px_56px_-54px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300/90 hover:shadow-[0_24px_64px_-52px_rgba(15,23,42,0.34)] dark:border-zinc-800/90 dark:bg-zinc-950/55 dark:hover:border-zinc-700/90"
        >
          {item.cover ? (
            <div className="group/cover relative mb-3 flex h-[156px] items-center justify-center overflow-hidden rounded-[16px] border border-zinc-200/60 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-900 md:h-[176px]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition duration-300 ease-out group-hover/cover:scale-[1.02] group-hover/cover:opacity-0 group-focus-visible/cover:opacity-0"
                style={{ backgroundImage: `url(${item.cover})` }}
              />
              <div className="bg-white/96 dark:bg-zinc-950/96 absolute inset-0 flex items-center justify-center px-8 py-7 text-center opacity-0 transition duration-300 ease-out group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100">
                <p className="line-clamp-4 overflow-hidden text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.description || '没有写太多说明，但它值得被留在这里。'}
                </p>
              </div>
            </div>
          ) : null}

          <div
            className={
              item.tags && item.tags.length > 0
                ? 'flex flex-1 flex-col justify-start'
                : 'flex flex-1 flex-col justify-center'
            }
          >
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              <span>{recommendationTypeLabels[item.type]}</span>
              {item.isFeatured ? (
                <span className="text-amber-500">精选</span>
              ) : null}
            </div>

            <h2 className="truncate text-[1.08rem] font-semibold leading-tight tracking-[-0.01em] text-zinc-950 transition-colors group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200 md:text-[1.15rem]">
              {item.title}
            </h2>

            {item.tags && item.tags.length > 0 ? (
              <div className="mt-2 flex min-w-0 flex-wrap gap-1.5 overflow-hidden">
                {item.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="max-w-full truncate rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </a>
      ))}
    </section>
  )
}
