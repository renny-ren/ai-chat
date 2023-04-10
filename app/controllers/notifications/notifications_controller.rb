module Notifications
  class NotificationsController < Notifications::ApplicationController
    include PaginationParams

    before_action :authenticate_user!

    def index
      if params[:q] == "important"
        @notifications = notifications.important.where(created_at: 5.days.ago..Time.now)
      end
      @notifications = notifications.includes(:target).order(created_at: :desc).page(page).per(4)
    end

    def read
      if params[:ids].present?
        Notification.read!(current_user, params[:ids])
      else
        notifications.unread.touch_all(:read_at)
      end
      render_json_response :ok
    end

    def clean
      notifications.delete_all
    end

    def unread_count
      render json: { unread_count: Notification.unread_count(current_user) }
    end

    private

    def authenticate_user!
      warden.authenticate!
    end

    def notifications
      current_user.notifications
    end
  end
end
