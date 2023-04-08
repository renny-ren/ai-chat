ActiveAdmin.register OpenaiAccount do
  index do
    selectable_column
    id_column
    column :user_id
    column :email
    column :credit
    column :used_amount
    column :total_available
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
    end
    f.actions
  end
end
