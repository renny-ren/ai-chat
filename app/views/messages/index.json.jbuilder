json.messages do
  json.array! @messages.map do |message|
    json.(message, :id, :content, :user_id, :user_nickname, :user_avatar_url, :mentions, :role)
    json.created_at message.created_at.in_time_zone("Asia/Shanghai").strftime("%H:%M:%S")
  end
end
json.model_avatar_url @conversation.model&.avatar_url

with_pagination_meta json, @messages
