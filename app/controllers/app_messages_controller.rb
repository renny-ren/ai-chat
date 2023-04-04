class AppMessagesController < ApplicationController
  include PaginationParams

  skip_forgery_protection only: [:push]

  before_action :authenticate_user!
  before_action :set_message, only: [:push, :edit, :update]

  def index
    @messages = AppMessage.includes(:creator, :updater).order(created_at: :desc).page(page).per(per)
  end

  def new
    @message = AppMessage.new
  end

  def create
    message = AppMessage.new(message_params)
    if message.valid?
      message.save
      redirect_to internal_messages_path, notice: "消息创建成功"
    else
      flash[:alert] = "创建失败：#{message.errors.full_messages}"
      redirect_to new_internal_message_path
    end
  end

  def edit
  end

  def update
    @message.update(message_params)
    redirect_to internal_messages_path, notice: "更新成功"
  end

  def push
    audit! :push_message
    AppMessage::PushService.new(@message).call
    redirect_to internal_messages_path, notice: "消息推送成功"
  end

  private

  def authenticate_user!
    raise "Unauthorized" unless current_user.admin?
  end

  def set_message
    @message ||= AppMessage.find(params[:id])
  end

  def message_params
    params.require(:internal_message).permit(:title, :body, :msg_type, :user_ids, :creator_id, :updater_id, :is_important).tap do |param|
      param[:user_ids] = params[:internal_message][:user_ids].split.map(&:to_i)
    end
  end
end
