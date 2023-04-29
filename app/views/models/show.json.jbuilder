json.model do
  json.extract! @model, :id, :title, :description, :introduction, :permalink, :system_instruction,
                :user_nickname, :avatar_url, :voice, :user_avatar_url, :likes_count, :stars_count, :like_by_user_ids, :star_by_user_ids
end
