export interface Post {
  _id: string
  title: string
  content: string
  category: string
  imageUrl?: string
  author: {
    _id: string
    username: string
  }
  createdAt: string
  updatedAt?: string
}

export interface PostsResponse {
  posts: Post[]
  page: number
  pages: number
  total: number
}
