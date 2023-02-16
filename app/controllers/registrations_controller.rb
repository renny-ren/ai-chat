class RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params)
    resource.save!
    sign_in(resource_name, resource)
    render status: 200, json: { message: "success" }
  rescue => e
    render status: 400, json: { message: resource.errors.full_messages }
  end

  private

  def sign_up_params
    params.permit(:email, :username, :nickname, :password)
  end
end
