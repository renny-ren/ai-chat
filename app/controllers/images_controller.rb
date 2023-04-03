class ImagesController < ApplicationController
  before_action :authenticate_user!

  def generations
    if can?
      resp = Image::GenerateService.new(current_user, image_params.merge(size: "256x256")).call
      @images = resp.dig("data")
      current_user.update_used_count(request.remote_ip)
    end
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def can?
    data = YAML.load_file(Rails.root.join("config", "membership_plans.yml"))
    current_user.used_message_count(request.remote_ip) < data.dig(current_user.membership, "message_limit_per_day")
  end

  def authenticate_user!
    warden.authenticate!
  end

  def image_params
    params.permit(:prompt, :n)
  end
end
