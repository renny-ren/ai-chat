export interface ChatMessage {
  content: string
  user_id: number
  user_nickname: string
  user_avatar_url: string
  role: string
  mentions: any
}
