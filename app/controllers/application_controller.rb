class ApplicationController < ActionController::Base
  include Gonable
  # before_action :configure_permitted_parameters, if: :devise_controller?

  def render_json_response(type, options = {})
    unless [:ok, :redirect, :error].include?(type)
      raise "Invalid json response type: #{type}"
    end

    default_json_structure = {
      status: type,
    }.merge(options)

    render_options = { json: default_json_structure }
    render_options[:status] = 400 if type == :error

    render(render_options)
  end

  def authenticate_admin_user!
    raise "Unauthorized" unless current_user && current_user.admin?
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username, :password, :password_confirmation])
  end
end
