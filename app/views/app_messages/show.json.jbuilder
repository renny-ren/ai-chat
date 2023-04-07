json.message do
  json.extract! @message, :title, :body, :msg_type, :status, :status_name, :created_at, :updated_at, :is_important
end
