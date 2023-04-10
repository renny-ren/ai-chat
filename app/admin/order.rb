ActiveAdmin.register Order do
  index do
    selectable_column
    id_column
    column :user_id
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
