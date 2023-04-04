module Gonable
  extend ActiveSupport::Concern

  included do
    before_action :set_gon_data
  end

  def set_gon_data
    set_user_meta
    set_gpt_user
    set_golbal_config
  end

  def set_user_meta
    return unless request.format.html?

    if user_signed_in?
      gon.watch.user_meta = current_user.frontend_attributes
    end
  end

  def set_gpt_user
    gon.gpt_user = User.gpt_user
  end

  def set_golbal_config
    gon.global_config = {
      env: Rails.env,
      robot_name: User.gpt_user[:nickname],
    }
  end
end
