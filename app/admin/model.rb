ActiveAdmin.register Model do
  belongs_to :user, optional: true
  permit_params :title

  index do
    selectable_column
    id_column
    column :user_id
    column :title
    column :description
    column :introduction
    column :permalink
    column :system_instruction
    column :voice
    column :input_placeholder
    column :is_public
    column :openai_params
    column :created_at
    actions
  end

  filter :id
  filter :user_id
  filter :permalink
  filter :title

  form do |f|
    f.inputs do
      f.input :title
    end
    f.actions
  end

  sidebar "Has many conversations", only: [:show, :edit] do
    ul do
      li link_to "conversations", admin_model_conversations_path(resource)
    end
  end
end
