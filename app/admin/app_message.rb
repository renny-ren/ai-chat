ActiveAdmin.register AppMessage do
  permit_params :title, :body, :is_important, :msg_type

  index do
    selectable_column
    id_column
    column :title
    column :body
    column :msg_type
    column :status
    column :is_important
    column :created_at
    actions
  end

  filter :is_important
  filter :title
  filter :status

  form do |f|
    f.inputs do
      f.input :title
      f.input :body
      f.input :is_important
      f.input :msg_type
    end
    f.actions
  end

  sidebar "Has many notifications", only: [:show, :edit] do
    ul do
      li link_to "Notifications", admin_app_message_notifications_path(resource)
    end
  end
end
