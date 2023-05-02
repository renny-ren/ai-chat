json.conversation do
  json.extract! @conversation, :id, :title, :type
  if @conversation.model.present?
    json.model_permalink @conversation.model.permalink
  end
end
