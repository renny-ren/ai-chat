json.messages do
  json.array! @messages.map do |message|
    json.(message, :id, :content, :user_id, :user_nickname, :user_avatar_url, :mentioned_users_nickname, :role)
  end
end

with_pagination_meta json, @messages
