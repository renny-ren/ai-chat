class SessionsController < Devise::SessionsController
  def create
    user = User.find_by(username: params[:username])
    if user && user.valid_password?(params[:password])
      sign_in user
      render status: :ok, json: { user_meta: user.frontend_attributes }
    else
      render status: :unauthorized, json: { message: "用户名或密码不正确" }
    end
  end

  def destroy
    sign_out current_user
    # render_json_response :ok
  end
end
