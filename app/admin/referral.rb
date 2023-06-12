ActiveAdmin.register Referral do
  permit_params :referrer_id, :invitee_id, :status

  index do
    selectable_column
    id_column
    column :referrer_id do |item|
      link_to item.referrer_id, admin_user_path(item.referrer_id)
    end
    column :invitee_id do |item|
      link_to item.invitee_id, admin_user_path(item.invitee_id)
    end
    column :status
    column :created_at
    column :updated_at
  end

  filter :id
  filter :referrer_id
  filter :invitee_id
  filter :status
  filter :created_at
  filter :updated_at

  form do |f|
    f.inputs do
      f.input :referrer_id
      f.input :invitee_id
      f.input :status
    end
    f.actions
  end
end
