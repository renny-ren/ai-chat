json.models do
  json.array! @models.map do |model|
    json.(model, :title, :description, :introduction, :permalink, :system_instruction, :user_nickname, :likes_count, :stars_count, :like_by_user_ids, :star_by_user_ids)
    json.created_at_in_words time_ago_in_words(model.created_at)
  end
end

with_pagination_meta json, @models
