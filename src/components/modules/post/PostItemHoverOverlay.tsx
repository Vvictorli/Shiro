'use client'

export const PostItemHoverOverlay = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
      <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_56%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_56%)]" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/30" />
    </div>
  )
}
