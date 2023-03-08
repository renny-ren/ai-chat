export interface ChatMessage {
  content: string
  user_id: number
  user_nickname: string
  user_avatar_url: string
  mentioned_users_nickname: any
  role: string
}
