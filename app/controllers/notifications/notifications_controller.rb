module Notifications
  class NotificationsController < Notifications::ApplicationController
    include PaginationParams

    before_action :authenticate_user!

    def index
      @notifications = current_user.notifications.includes(:target).order(created_at: :desc).page(page).per(per)
    end

    def read
      Notification.read!(current_user, params[:ids])
      render json: { ok: 1 }
    end

    def clean
      notifications.delete_all
      redirect_to notifications_path
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
