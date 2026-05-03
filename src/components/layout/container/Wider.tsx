import { clsxm } from '~/lib/helper'

export const WiderContainer: Component = (props) => {
  const { children, className } = props

  return (
    <div
      className={clsxm(
        'mx-auto mt-8 max-w-5xl px-2 lg:mt-12 lg:px-0 2xl:max-w-6xl',
        '[&_header.prose]:mb-[80px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
