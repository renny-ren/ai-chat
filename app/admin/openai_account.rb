ActiveAdmin.register OpenaiAccount do
  index do
    selectable_column
    id_column
    column :user_id
    column :email
    column :credit
    column :used_amount
    column :total_available
    column :created_at
    actions
  end

  filter :user_id
  filter :email
  filter :credit
  filter :used_amount
  filter :total_available

  form do |f|
    f.inputs do
      f.input :user_id
      f.input :secret_key
      f.input :credit
      f.input :used_amount
      f.input :total_available
    end
    f.actions
  end
end
