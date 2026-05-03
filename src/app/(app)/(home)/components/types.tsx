import type {
  RecentComment,
  RecentLike,
  RecentNote,
  RecentPost,
  RecentRecent,
} from '@mx-space/api-client'

type RecentSay = {
  id: string
  text: string
  source?: string
  author?: string
  created: string
}

export type ReactActivityType =
  | ({
      bizType: 'comment'
    } & RecentComment)
  | ({
      bizType: 'note'
    } & RecentNote)
  | ({
      bizType: 'post'
    } & RecentPost)
  | ({
      bizType: 'recent'
    } & RecentRecent)
  | ({
      bizType: 'say'
    } & RecentSay)
  | ({
      bizType: 'like'
    } & RecentLike)
