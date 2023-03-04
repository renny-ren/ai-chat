class UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    current_user.update!(user_params)
    render_json_response :ok, data: current_user.frontend_attributes
  rescue => e
    render_json_response :error, message: e.message
  end

  def clear_conversations
    Rails.cache.delete(current_user.conversation_cache_key)
    render_json_response :ok
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def user_params
    params.permit(:nickname, :avatar).tap do |param|
      param[:email] = params[:email] if params[:email].present?
    end
  end
end