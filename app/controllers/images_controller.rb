class ImagesController < ApplicationController
  before_action :authenticate_user!

  def generations
    if can?
      res = Image::GenerateService.new(current_user, image_params.merge(size: "256x256")).call
      raise "#{res.reason_phrase}: #{res.body}" if res.status != 200

      @images = JSON.parse(res.body).dig("data")
      current_user.update_image_count(current_user.image_count - image_params[:n])
    end
  rescue => e
    App::Error.track(e)
    render_json_response :error, message: '图片生成失败，请稍后再试'
  end

  private

  def can?
    current_user.image_count >= image_params[:n]
  end

  def authenticate_user!
    warden.authenticate!
  end

  def image_params
    params.permit(:prompt, :n)
  end
end
