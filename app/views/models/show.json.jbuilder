json.model do
  json.extract! @model, :id, :user_id, :title, :description, :permalink, :system_instruction, :voice, :is_public, :input_placeholder,
                :user_nickname, :avatar_url, :user_avatar_url, :likes_count, :stars_count, :like_by_user_ids, :star_by_user_ids, :openai_params
  json.introduction @model.introduction || ""
end
