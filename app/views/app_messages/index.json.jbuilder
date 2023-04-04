with_pagination_meta json, @messages

json.messages do
  json.array! @messages do |message|
    json.extract! message, :id, :title, :status, :status_name, :created_at, :updated_at, :msg_type_name, :is_important
    json.creator_name message.creator.name
    json.updater_name message.updater&.name
  end
end
