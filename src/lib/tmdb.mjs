const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export function createPosterAssetUrl({ poster, href }) {
  if (!poster) {
    return null
  }

  try {
    const posterUrl = new URL(poster)
    if (!posterUrl.hostname.endsWith('doubanio.com')) {
      return poster
    }

    const query = new URLSearchParams({
      src: poster,
      referer: href || 'https://movie.douban.com/',
    })

    return `/api/douban-image?${query.toString()}`
  } catch {
    return poster
  }
}

export function hasTmdbCredentials(env) {
  return Boolean(env?.TMDB_API_KEY || env?.TMDB_ACCESS_TOKEN)
}

export function buildTmdbRequestOptions({
  pathSegments,
  searchParams = {},
  env,
}) {
  const query = new URLSearchParams(searchParams)

  if (env?.TMDB_API_KEY) {
    query.set('api_key', env.TMDB_API_KEY)
  }

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )

  if (env?.TMDB_ACCESS_TOKEN) {
    headers.set('Authorization', `Bearer ${env.TMDB_ACCESS_TOKEN}`)
  }

  const search = query.toString()
  const url = `${TMDB_BASE_URL}/${pathSegments.join('/')}${search ? `?${search}` : ''}`

  return { headers, url }
}

export function createMovieWallSections(collection) {
  const sections = [
    {
      key: 'watched',
      title: '已看过',
      description: '那些已经留在脑海里的故事。',
      items: collection?.watched ?? [],
    },
    {
      key: 'wishlist',
      title: '想看',
      description: '还在排队，等一个合适的夜晚。',
      items: collection?.wishlist ?? [],
    },
  ]

  return sections.filter((section) => section.items.length > 0)
}
