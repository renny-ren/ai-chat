json.models do
  json.array! @models.map do |model|
    json.(model, :title, :description, :introduction, :permalink, :system_instruction, :user_nickname)
    json.created_at_in_words model.created_at.in_time_zone("Asia/Shanghai").strftime("%H:%M:%S")
  end
end

with_pagination_meta json, @models
