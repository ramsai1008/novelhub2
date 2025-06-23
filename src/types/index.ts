export type Novel = {
  id: string
  title: string
  description: string
  author?: string
  cover?: string
  tags?: string[]
  featured?: boolean
  createdAt?: number
}

export type Chapter = {
  id: string
  novelId: string
  title: string
  content: string
  createdAt?: number
}

export type Bookmark = {
  novelId: string
  chapterId: string
  createdAt: number
}

export type User = {
  uid: string
  email: string
  name?: string
  photoURL?: string
}

export type FirestoreNovel = Omit<Novel, 'id'>;
export type FirestoreChapter = Omit<Chapter, 'id'>;
