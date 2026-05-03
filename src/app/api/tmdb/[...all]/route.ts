// reverse proxy to themoviedb api
//

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { NextServerResponse } from '~/lib/edge-function.server'
import { buildTmdbRequestOptions, hasTmdbCredentials } from '~/lib/tmdb.mjs'

export const runtime = 'edge'
export const revalidate = 86400 // 24 hours
export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)
  const query = req.nextUrl.searchParams

  query.delete('all')

  const res = new NextServerResponse()
  const allowedTypes = ['tv', 'movie']
  const allowedPathLength = 2
  if (
    pathname.length > allowedPathLength ||
    !allowedTypes.includes(pathname[0])
  ) {
    return res.status(400).send('This request is not allowed')
  }

  const searchString = query.toString()

  if (!hasTmdbCredentials(process.env)) {
    return res.status(500).send('TMDB credentials are not set')
  }

  const { headers, url } = buildTmdbRequestOptions({
    pathSegments: pathname,
    searchParams: Object.fromEntries(query.entries()),
    env: process.env,
  })

  const response = await fetch(url, {
    headers,
  })
  const data = await response.json()
  return NextResponse.json(data)
}
