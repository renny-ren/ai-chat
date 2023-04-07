with_pagination_meta json, @notifications

json.notifications do
  json.array! @notifications do |notification|
    json.extract! notification, :id, :read_at
    json.extract! notification.target, :title, :body, :msg_type_name, :msg_type_color, :is_important
    json.created_at_in_words time_ago_in_words(notification.created_at)
  end
end
