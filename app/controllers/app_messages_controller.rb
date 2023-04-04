class AppMessagesController < ApplicationController
  include PaginationParams

  skip_forgery_protection only: [:push]

  before_action :authenticate_user!
  before_action :set_message, only: [:show, :push, :update]

  def index
    @messages = AppMessage.includes(:creator, :updater).order(created_at: :desc).page(page).per(per)
  end

  def show
  end

  def create
    message = AppMessage.new(message_params.merge(creator_id: current_user.id))
    if message.valid?
      message.save!
      render_json_response :ok
    else
      render_json_response :error, message: message.errors
    end
  rescue => e
    render_json_response :error, message: e.message
  end

  def update
    @message.update!(message_params)
    render_json_response :ok
  rescue => e
    render_json_response :error, message: e.message
  end

  def push
    AppMessagePushService.new(@message).call
    render_json_response :ok
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def authenticate_user!
    raise "Unauthorized" unless current_user.admin?
  end

  def set_message
    @message ||= AppMessage.find(params[:id])
  end

  def message_params
    params.permit(:title, :body, :msg_type, :user_ids, :is_important)
  end
end
