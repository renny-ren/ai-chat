class UsersController < ApplicationController
  before_action :authenticate_user!

  def update
    current_user.update!(user_params)
    render_json_response :ok, data: current_user.frontend_attributes
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def authenticate_user!
    warden.authenticate!
  end

  def user_params
    params.permit(:nickname, :email)
  end
end
