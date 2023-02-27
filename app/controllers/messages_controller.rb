class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_messages, only: :index

  def index
    render status: :ok, json: { messages: @messages.map(&:as_item_json) }
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def set_messages
    @messages = Message.includes(:user).last(20)
  end
end
