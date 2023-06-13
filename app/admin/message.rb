ActiveAdmin.register Message do
  permit_params :user_id, :conversation_id
  belongs_to :conversation, optional: true

  index do
    selectable_column
    id_column
    column :user_id do |item|
      link_to item.user_id, admin_user_path(item.user_id)
    end
    column :conversation_id do |item|
      if item.conversation_id
        link_to item.conversation_id, admin_conversation_path(item.conversation_id)
      end
    end
    column :content
    column :created_at
    actions
  end

  filter :user_id
  filter :conversation_id
  filter :created_at

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :conversation_id
      f.input :content
    end
    f.actions
  end
end
