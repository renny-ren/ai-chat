ActiveAdmin.register Message do
  permit_params :user_id, :conversation_id
  belongs_to :conversation, optional: true

  index do
    selectable_column
    id_column
    column :user_id
    column :conversation_id
    column :content
    actions
  end

  filter :user_id
  filter :conversation_id

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :conversation_id
    end
    f.actions
  end
end
