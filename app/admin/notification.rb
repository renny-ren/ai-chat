ActiveAdmin.register Notification do
  belongs_to :app_message, optional: true
  # navigation_menu :app_message

  index do
    selectable_column
    id_column
    column :user_id do |item|
      link_to item.user_id, admin_user_path(item.user_id)
    end
    column :target
    column '是否已读' do |item|
      span item.read_at.present?
    end
    column :read_at
    actions
  end

  filter :user_id
  filter :target_id
  filter :read_at

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :read_at
    end
    f.actions
  end
end
