class ImagesController < ApplicationController
  before_action :authenticate_user!

  def generations
    if can?
      res = Image::GenerateService.new(current_user, image_params.merge(size: "256x256")).call
      raise "#{res.reason_phrase}: #{res.body}" if res.status != 200

      @images = JSON.parse(res.body).dig("data")
      current_user.update_used_count(request.remote_ip)
    end
  rescue => e
    App::Error.track(e)
    render_json_response :error, message: '图片生成失败，请稍后再试'
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
