class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: :show

  def update
    check_password! if params[:original_password].present?
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

  def check_password!
    raise '原密码错误' unless current_user.valid_password?(params[:original_password])
    raise '新密码长度不对劲' unless user_params[:password].size.in?(6..128)
    raise '两次输入的新密码不一致' if user_params[:password] != user_params[:password_confirmation]
  end

  def authenticate_user!
    warden.authenticate!
  end

  def user_params
    params.permit(:nickname, :avatar, :password, :password_confirmation, config: {}).tap do |param|
      param[:email] = params[:email] if params[:email].present?
      param[:config] = current_user.config.merge(params[:config].permit!) if params[:config].present?
    end
  end

  def set_user
    @user = current_user
  end
end
