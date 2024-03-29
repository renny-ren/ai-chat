class MessagesController < ApplicationController
  include PaginationParams

  before_action :set_messages, only: :index

  def index
  end

  def check_words
    is_sensitive = CheckSensitiveWordsService.new(params[:text]).call
    if is_sensitive
      audit! :send_sensitive_message, nil, payload: { user: current_user, text: params[:text] }
      render_json_response :error, error_code: 1001, message: "Containing sensitive words"
    else
      render_json_response :ok
    end
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
      @conversation = Conversation.find(params[:conversation_id])
      if @conversation.user != current_user
        render status: 401, json: { message: "Unauthorized" }
      else
        @messages = @conversation.messages.where("user_id = ? OR user_id = ?", current_user.id, GPT_USER_ID)
        @messages = @messages.includes(:user).order(created_at: :desc).page(page).per(per)
      end
    end
  end
end
