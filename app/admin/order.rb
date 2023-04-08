ActiveAdmin.register Order do
  index do
    selectable_column
    id_column
    column :user_id
    column :amount
    actions
  end

  filter :user_id
  filter :amount
end
