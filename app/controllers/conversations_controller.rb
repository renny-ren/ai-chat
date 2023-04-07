class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversations, only: :index
  before_action :set_conversation, only: [:show, :update, :destroy]

  def index
  end

  def show
  end

  def update
    @conversation.update!(title: params[:title])
  end

  def destroy
    @conversation.destroy!
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_conversation
    @conversation = current_user.conversations.find(params[:id])
  end

  def set_conversations
    @conversations = current_user.conversations.order(created_at: :desc)
  end
end
