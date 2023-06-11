ActiveAdmin.register Conversation do
  belongs_to :user, optional: true
  permit_params :title

  index do
    selectable_column
    id_column
    column :user_id do |item|
      link_to item.user_id, admin_user_path(item.user_id)
    end
    column :title
    column :type
    column :model_id do |item|
      if item.model_id
        link_to item.model_id, admin_models_path
      end
    end
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
