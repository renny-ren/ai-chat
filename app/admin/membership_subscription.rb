ActiveAdmin.register MembershipSubscription do
  index do
    selectable_column
    id_column
    column :user_id do |item|
      link_to item.user_id, admin_user_path(item.user_id)
    end
    column :membership_plan_id
    column :start_at
    column :end_at
    column :status
    actions
  end

  filter :user_id
  filter :membership_plan_id
  filter :start_at
  filter :end_at
  filter :status
end
