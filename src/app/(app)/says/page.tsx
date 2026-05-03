import { getInitialSays } from './api'
import { SaysPageClient } from './SaysPageClient'

export const revalidate = 21600

export default async function Page() {
  let initialPage: Awaited<ReturnType<typeof getInitialSays>> | undefined
  try {
    initialPage = await getInitialSays()
  } catch {}

  return <SaysPageClient initialPage={initialPage} />
}
