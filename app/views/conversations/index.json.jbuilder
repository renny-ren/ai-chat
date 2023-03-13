json.conversations do
  json.array! @conversations.map do |conversation|
    json.(conversation, :id, :title, :created_at)
  end
end
