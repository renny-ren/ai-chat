ActiveAdmin.register Notification do
  belongs_to :app_message, optional: true
  # navigation_menu :app_message

  index do
    selectable_column
    id_column
    column :user_id
    column :target_id
    column '是否已读' do |item|
      span item.read_at.present?
    end
    column :read_at
    actions
  end

  filter :user_id
  filter :read_at

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :read_at
    end
    f.actions
  end
end
