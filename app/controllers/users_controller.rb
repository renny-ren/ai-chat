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

  def show
    @used_message_count = [
      Rails.cache.read(current_user.used_count_cache_key).to_i,
      Rails.cache.read("used_count:ip_#{request.remote_ip}").to_i,
    ].max
    @image_count = current_user.image_count
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def user_params
    params.permit(:nickname, :avatar, config: {}).tap do |param|
      param[:email] = params[:email] if params[:email].present?
      param[:config] = current_user.config.merge(params[:config].permit!) if params[:config].present?
    end
  end
end
