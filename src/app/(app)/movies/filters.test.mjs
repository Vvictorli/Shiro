import assert from 'node:assert/strict'
import test from 'node:test'

import {
  applyMoviesView,
  collectGenres,
  parseMoviesQuery,
} from './filters.mjs'

const sampleItems = [
  {
    title: 'A',
    type: 'movie',
    genres: ['惊悚', '悬疑'],
    doubanRating: 8.5,
    personalRating: 3,
  },
  {
    title: 'B',
    type: 'j_drama',
    genres: ['爱情'],
    doubanRating: 7.2,
    personalRating: 5,
  },
  {
    title: 'C',
    type: 'movie',
    genres: ['惊悚'],
    doubanRating: null,
    personalRating: 2,
  },
]

test('parseMoviesQuery normalizes supported values', () => {
  const query = parseMoviesQuery({
    type: 'movie',
    genre: '惊悚',
    sort: 'douban',
    order: 'asc',
  })

  assert.deepEqual(query, {
    type: 'movie',
    genre: '惊悚',
    sort: 'douban',
    order: 'asc',
  })
})

test('parseMoviesQuery falls back for unsupported values', () => {
  const query = parseMoviesQuery({
    type: 'unknown',
    genre: undefined,
    sort: 'watchedAt',
    order: 'sideways',
  })

  assert.deepEqual(query, {
    type: 'all',
    genre: 'all',
    sort: null,
    order: 'desc',
  })
})

test('applyMoviesView filters by type and genre', () => {
  const result = applyMoviesView(sampleItems, {
    type: 'movie',
    genre: '惊悚',
    sort: null,
    order: 'desc',
  })

  assert.deepEqual(
    result.map((item) => item.title),
    ['A', 'C'],
  )
})

test('applyMoviesView sorts by douban score and keeps missing values last', () => {
  const result = applyMoviesView(sampleItems, {
    type: 'all',
    genre: 'all',
    sort: 'douban',
    order: 'desc',
  })

  assert.deepEqual(
    result.map((item) => item.title),
    ['A', 'B', 'C'],
  )
})

test('applyMoviesView sorts by personal score ascending', () => {
  const result = applyMoviesView(sampleItems, {
    type: 'all',
    genre: 'all',
    sort: 'personal',
    order: 'asc',
  })

  assert.deepEqual(
    result.map((item) => item.title),
    ['C', 'A', 'B'],
  )
})

test('collectGenres scopes genres to the current type filter', () => {
  const result = collectGenres(sampleItems, 'movie')

  assert.deepEqual(result, ['惊悚', '悬疑'])
})
