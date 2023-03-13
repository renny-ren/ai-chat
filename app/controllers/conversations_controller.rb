class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversations, only: :index

  def index
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_conversations
    @conversations = current_user.conversations.order(created_at: :desc)
  end
end
