module Notifications
  class NotificationsController < Notifications::ApplicationController
    include PaginationParams

    before_action :authenticate_user!

    def index
      @notifications = current_user.notifications.includes(:target).order(created_at: :desc).page(page).per(4)
    end

    def read
      if params[:ids].present?
        Notification.read!(current_user, params[:ids])
      else
        current_user.notifications.unread.touch_all(:read_at)
      end
      render_json_response :ok
    end

    def clean
      notifications.delete_all
      redirect_to notifications_path
    end

    def unread_count
      render json: { unread_count: Notification.unread_count(current_user) }
    end

    private

    def authenticate_user!
      warden.authenticate!
    end

    def notifications
      Notification.where(user_id: current_user.id)
    end
  end
end
