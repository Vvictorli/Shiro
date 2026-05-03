import { NextResponse } from 'next/server'

export const revalidate = 86400

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const src = searchParams.get('src')
  const referer = searchParams.get('referer') || 'https://movie.douban.com/'

  if (!src) {
    return NextResponse.json({ error: 'Missing src' }, { status: 400 })
  }

  let posterUrl: URL
  let refererUrl: URL

  try {
    posterUrl = new URL(src)
    refererUrl = new URL(referer)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  if (!posterUrl.hostname.endsWith('doubanio.com')) {
    return NextResponse.json({ error: 'Unsupported host' }, { status: 400 })
  }

  if (!refererUrl.hostname.endsWith('douban.com')) {
    return NextResponse.json({ error: 'Unsupported referer' }, { status: 400 })
  }

  const response = await fetch(posterUrl, {
    headers: {
      Referer: refererUrl.toString(),
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      Accept:
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
    next: { revalidate },
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: `Unable to fetch image: ${response.status}` },
      { status: response.status },
    )
  }

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': `public, max-age=${revalidate}, s-maxage=${revalidate}`,
    },
  })
}
