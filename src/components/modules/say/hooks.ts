import type { SayModel } from '@mx-space/api-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createElement, useCallback } from 'react'

import { useModalStack } from '~/components/ui/modal'
import { apiClient } from '~/lib/request'

import { SayModalForm } from './SayModalForm'

export const sayQueryKey = ['says']

type SayPage = {
  data: SayModel[]
  pagination: {
    total: number
    size: number
    currentPage?: number
    current_page?: number
    totalPage?: number
    total_page?: number
    hasNextPage?: boolean
    has_next_page?: boolean
    hasPrevPage?: boolean
    has_prev_page?: boolean
  }
}

export const useSayListQuery = (initialPage?: SayPage) =>
  useInfiniteQuery({
    queryKey: sayQueryKey,
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.say.getAllPaginated(pageParam)
      return data
    },
    initialPageParam: 1,
    ...(initialPage
      ? {
          initialData: {
            pages: [initialPage],
            pageParams: [1],
          },
          staleTime: 60 * 1000,
        }
      : {}),
    getNextPageParam: (lastPage) =>
      (lastPage.pagination.hasNextPage ?? lastPage.pagination.has_next_page)
        ? (lastPage.pagination.currentPage ??
            lastPage.pagination.current_page ??
            1) + 1
        : undefined,
  })

export const useSayModal = () => {
  const { present } = useModalStack()

  return useCallback(
    (editingData?: SayModel) => {
      present({
        title: editingData ? '编辑一言' : '发布一言',
        content: () => createElement(SayModalForm, { editingData }),
        modalClassName: 'w-[500px]',
      })
    },
    [present],
  )
}
