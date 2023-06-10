ActiveAdmin.register Order do
  index do
    selectable_column
    id_column
    column :user_id do |item|
      link_to item.user_id, admin_user_path(item.user_id)
    end
    column :amount
    column :status
    column :owner
    column :created_at
    actions
  end

  filter :user_id
  filter :amount
  filter :status
  filter :created_at
end
