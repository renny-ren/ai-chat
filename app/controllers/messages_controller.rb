class MessagesController < ApplicationController
  include PaginationParams

  before_action :set_messages, only: :index

  def index
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_messages
    if params[:source] == "chatroom"
      @messages = Message.chatroom.includes(:user).order(created_at: :desc).page(page).per(per)
    else
      authenticate_user!
      conversation = Conversation.find(params[:conversation_id])
      if conversation.user != current_user
        render status: 401, json: { message: "Unauthorized" }
      else
        @messages = conversation.messages.where("user_id = ? OR user_id = ?", current_user.id, GPT_USER_ID)
        @messages = @messages.order(:created_at).page(page).per(999)
      end
    end
  end
end
