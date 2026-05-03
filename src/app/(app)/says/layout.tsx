import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { NormalContainer } from '~/components/layout/container/Normal'

export const metadata: Metadata = {
  title: '一言',
}
export default async function Layout(props: PropsWithChildren) {
  return (
    <NormalContainer className="max-w-[52rem]">
      {props.children}
    </NormalContainer>
  )
}
