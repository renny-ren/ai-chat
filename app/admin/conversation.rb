ActiveAdmin.register Conversation do
  belongs_to :user, optional: true
  permit_params :title

  index do
    selectable_column
    id_column
    column :user_id
    column :title
    column :type
    column :model_id
    column :created_at
    actions
  end

  filter :id
  filter :user_id
  filter :title
  filter :type
  filter :model_id

  form do |f|
    f.inputs do
      f.input :title
    end
    f.actions
  end

  sidebar "Has many messages", only: [:show, :edit] do
    ul do
      li link_to "messages", admin_conversation_messages_path(resource)
    end
  end
end
