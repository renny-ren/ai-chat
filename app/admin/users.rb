ActiveAdmin.register User do
  permit_params :nickname, :email, :password, :password_confirmation

   member_action :login do
    sign_in resource
    redirect_to root_path
  end

  index do
    selectable_column
    id_column
    column :username
    column :nickname
    column :email
    column :membership
    column :current_sign_in_at
    column :current_sign_in_ip
    column :sign_in_count
    column :created_at
    column :user_agent
    actions defaults: true do |user|
      link_to t('登录'), login_admin_user_path(user)
    end
  end

  filter :id
  filter :username
  filter :nickname
  filter :email
  filter :membership
  filter :current_sign_in_at
  filter :current_sign_in_ip
  filter :created_at

  form do |f|
    f.inputs do
      f.input :nickname
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end

  sidebar "Relations", only: [:show, :edit] do
    ul do
      li link_to "conversations", admin_user_conversations_path(resource)
    end
    ul do
      li link_to "messages", admin_user_messages_path(resource)
    end
  end
end
