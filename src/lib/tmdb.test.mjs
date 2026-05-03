import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildTmdbRequestOptions,
  createMovieWallSections,
  createPosterAssetUrl,
  hasTmdbCredentials,
} from './tmdb.mjs'

test('buildTmdbRequestOptions uses api key for query and access token for auth header', () => {
  const result = buildTmdbRequestOptions({
    pathSegments: ['movie', 'popular'],
    searchParams: { language: 'zh-CN', page: '2' },
    env: {
      TMDB_API_KEY: 'public-key',
      TMDB_ACCESS_TOKEN: 'read-token',
    },
  })

  assert.equal(
    result.url,
    'https://api.themoviedb.org/3/movie/popular?language=zh-CN&page=2&api_key=public-key',
  )
  assert.equal(result.headers.get('Authorization'), 'Bearer read-token')
})

test('buildTmdbRequestOptions still works with only an access token', () => {
  const result = buildTmdbRequestOptions({
    pathSegments: ['movie', 'top_rated'],
    searchParams: { language: 'zh-CN' },
    env: {
      TMDB_ACCESS_TOKEN: 'read-token',
    },
  })

  assert.equal(
    result.url,
    'https://api.themoviedb.org/3/movie/top_rated?language=zh-CN',
  )
  assert.equal(result.headers.get('Authorization'), 'Bearer read-token')
})

test('hasTmdbCredentials accepts either api key or access token', () => {
  assert.equal(hasTmdbCredentials({ TMDB_API_KEY: 'public-key' }), true)
  assert.equal(hasTmdbCredentials({ TMDB_ACCESS_TOKEN: 'read-token' }), true)
  assert.equal(hasTmdbCredentials({}), false)
})

test('createMovieWallSections keeps watched and wishlist sections in display order', () => {
  const sections = createMovieWallSections({
    watched: [
      { id: 'movie/157336', note: '先放一部当样例' },
      { id: 'tv/1396' },
    ],
    wishlist: [{ id: 'movie/603692' }],
  })

  assert.deepEqual(
    sections.map((section) => section.key),
    ['watched', 'wishlist'],
  )
  assert.deepEqual(
    sections[0].items.map((item) => item.id),
    ['movie/157336', 'tv/1396'],
  )
  assert.equal(sections[1].title, '想看')
})

test('createMovieWallSections omits empty wishlist sections', () => {
  const sections = createMovieWallSections({
    watched: [{ id: 'movie/10744976' }],
    wishlist: [],
  })

  assert.deepEqual(
    sections.map((section) => section.key),
    ['watched'],
  )
})

test('createPosterAssetUrl proxies douban posters through the local route', () => {
  const result = createPosterAssetUrl({
    poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1224079971.jpg',
    href: 'https://movie.douban.com/subject/1299967/',
  })

  assert.equal(
    result,
    '/api/douban-image?src=https%3A%2F%2Fimg2.doubanio.com%2Fview%2Fphoto%2Fs_ratio_poster%2Fpublic%2Fp1224079971.jpg&referer=https%3A%2F%2Fmovie.douban.com%2Fsubject%2F1299967%2F',
  )
})
