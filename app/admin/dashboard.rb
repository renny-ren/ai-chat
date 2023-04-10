# frozen_string_literal: true
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    div class: "blank_slate_container", id: "dashboard_default_message" do
      span class: "blank_slate" do
        span I18n.t("active_admin.dashboard_welcome.welcome")
        small I18n.t("active_admin.dashboard_welcome.call_to_action")
      end
    end

    columns do
      column do
        panel "Recent Users" do
          ul do
            User.order(id: :desc).last(10).map do |user|
              li link_to(user.nickname, admin_user_path(user))
            end
          end
        end
      end

      column do
        panel "Recent Messages" do
          ul do
            Message.order(id: :desc).last(5).map do |msg|
              li link_to(msg.content, admin_message_path(msg))
            end
          end
        end
      end

      column do
        panel "Info" do
          para "Welcome to ActiveAdmin."
        end
      end
    end
  end
end
