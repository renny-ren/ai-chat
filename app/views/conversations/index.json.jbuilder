json.conversations do
  json.array! @conversations.map do |conversation|
    json.(conversation, :id, :title, :type)
  end
end
