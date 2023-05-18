class SessionsController < Devise::SessionsController
  def create
    user = User.find_by(username: params[:username])
    if user && user.valid_password?(params[:password])
      user.update(user_agent: request.user_agent)
      sign_in user
      render status: :ok, json: { user_meta: user.frontend_attributes }
    else
      render status: :unauthorized, json: { message: "用户名或密码不正确" }
    end
  end

  def destroy
    sign_out current_user
    respond_to do |format|
      format.html do
        redirect_to root_path
      end
      format.json
    end
  end
end
