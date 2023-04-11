json.user do
  json.extract! @user, :username, :nickname
  json.used_message_count @used_message_count
  json.image_count @image_count
end
