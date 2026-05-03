export const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'movie', label: '电影' },
  { value: 'animation_movie', label: '动画电影' },
  { value: 'animation', label: '动画' },
  { value: 'k_drama', label: '韩剧' },
  { value: 'j_drama', label: '日剧' },
  { value: 'hk_drama', label: '港剧' },
  { value: 'cn_drama', label: '国产剧' },
  { value: 'us_drama', label: '美剧' },
  { value: 'budaxi', label: '布袋戏' },
]

export const TYPE_LABELS = Object.fromEntries(
  TYPE_FILTER_OPTIONS.filter((item) => item.value !== 'all').map((item) => [
    item.value,
    item.label,
  ]),
)

export const SORT_OPTIONS = [
  { value: 'douban', label: '豆瓣评分' },
  { value: 'personal', label: '我的评分' },
]

export const ORDER_OPTIONS = [
  { value: 'desc', label: '高到低' },
  { value: 'asc', label: '低到高' },
]

const VALID_TYPE_VALUES = new Set(TYPE_FILTER_OPTIONS.map((item) => item.value))
const VALID_SORT_VALUES = new Set(SORT_OPTIONS.map((item) => item.value))
const VALID_ORDER_VALUES = new Set(ORDER_OPTIONS.map((item) => item.value))

export function parseMoviesQuery(searchParams = {}) {
  const getValue = (key) => {
    const raw = searchParams[key]
    return Array.isArray(raw) ? raw[0] : raw
  }

  const type = getValue('type')
  const genre = getValue('genre')
  const sort = getValue('sort')
  const order = getValue('order')

  return {
    type: VALID_TYPE_VALUES.has(type) ? type : 'all',
    genre: genre ? String(genre) : 'all',
    sort: VALID_SORT_VALUES.has(sort) ? sort : null,
    order: VALID_ORDER_VALUES.has(order) ? order : 'desc',
  }
}

export function filterMovieWallItems(items, filters) {
  return items.filter((item) => {
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false
    }

    if (filters.genre !== 'all' && !(item.genres || []).includes(filters.genre)) {
      return false
    }

    return true
  })
}

export function sortMovieWallItems(items, filters) {
  if (!filters.sort) {
    return items
  }

  const key = filters.sort === 'douban' ? 'doubanRating' : 'personalRating'
  const direction = filters.order === 'asc' ? 1 : -1

  return [...items].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]
    const aMissing = typeof aValue !== 'number'
    const bMissing = typeof bValue !== 'number'

    if (aMissing && bMissing) return 0
    if (aMissing) return 1
    if (bMissing) return -1
    if (aValue === bValue) return 0

    return aValue > bValue ? direction : -direction
  })
}

export function collectGenres(items, type = 'all') {
  const visibleItems =
    type === 'all' ? items : items.filter((item) => item.type === type)

  const counts = new Map()
  for (const item of visibleItems) {
    for (const genre of item.genres || []) {
      counts.set(genre, (counts.get(genre) || 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0], 'zh-CN')
    })
    .map(([genre]) => genre)
}

export function applyMoviesView(items, filters) {
  const filtered = filterMovieWallItems(items, filters)
  return filters.sort ? sortMovieWallItems(filtered, filters) : filtered
}
