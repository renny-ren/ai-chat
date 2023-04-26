json.model do
  json.extract! @model, :id, :title, :description, :introduction, :permalink, :system_instruction, :user_nickname, :avatar_url, :voice
end
