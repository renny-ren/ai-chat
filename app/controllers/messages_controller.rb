class MessagesController < ApplicationController
  include PaginationParams
  # before_action :authenticate_user!
  before_action :set_messages, only: :index

  def index
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_messages
    @messages = Message.includes(:user)
    @messages = @messages.where(conversation_id: params[:conversation_id]) if params[:conversation_id].present?
    @messages = @messages.order(created_at: :desc).page(page).per(per)
  end
end
