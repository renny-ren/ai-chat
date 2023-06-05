class RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params.merge(user_agent: request.user_agent))
    resource.save!
    sign_in(resource_name, resource)
    render status: 200, json: { user_meta: resource.frontend_attributes, is_referral: resource.referrer_id? }
  rescue => e
    render status: 400, json: { message: resource.errors.full_messages }
  end

  private

  def sign_up_params
    params.permit(:email, :username, :nickname, :password, :password_confirmation).tap do |param|
      param[:referrer_id] = referrer_id if params[:invite_code].present?
    end
  end

  # 当用户 ID 小于 100000 时，前端传来的 invite_code 等于用户 ID + 606060
  def referrer_id
    invite_code = params[:invite_code].to_i
    invite_code > 606060 ? invite_code - 606060 : invite_code
  end
end
