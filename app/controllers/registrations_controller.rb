class RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params.merge(user_agent: request.user_agent))
    resource.save!
    sign_in(resource_name, resource)
    render status: 200, json: { user_meta: resource.frontend_attributes }
  rescue => e
    render status: 400, json: { message: resource.errors.full_messages }
  end

  private

  def sign_up_params
    params.permit(:email, :username, :nickname, :password, :password_confirmation)
  end
end
