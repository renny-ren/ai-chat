class SessionsController < Devise::SessionsController
  def create
    user = User.find_by(username: params[:username])
    if user && user.valid_password?(params[:password])
      sign_in user
      render status: :ok, json: { avatar_url: user.avatar_url }
    else
      render status: :unauthorized, json: { message: "用户名或密码不正确" }
    end
  end
end
