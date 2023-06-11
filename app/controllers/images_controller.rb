require "open-uri"

class ImagesController < ApplicationController
  before_action :authenticate_user!

  def generations
    if can?
      res = Image::GenerateService.new(current_user, image_params).call
      raise "#{res.reason_phrase}: #{res.body}" if res.status != 200

      @images = JSON.parse(res.body).dig("data")
      attach_images
      current_user.update_image_count(current_user.image_count - image_params[:n])
    end
    audit! :generate_image, nil, payload: { params: image_params, images: @images }
  rescue => e
    App::Error.track(e)
    render_json_response :error, message: "图片生成失败，请稍后再试"
  end

  def user_avatar
    name = URI.encode_www_form_component(params[:name])
    size = params[:size] || 80
    url = URI.parse("https://ui-avatars.com/api/?name=#{name}&size=#{size}")
    response = Net::HTTP.get_response(url)
    send_data response.body, type: response.content_type, disposition: "inline"
  rescue StandardError => e
    puts "Error fetching image: #{e.message}"
    head :internal_server_error
  end

  private

  def can?
    current_user.image_count >= image_params[:n]
  end

  def authenticate_user!
    warden.authenticate!
  end

  def image_params
    params.permit(:prompt, :n, :size)
  end

  def attach_images
    @images.each do |image|
      Tempfile.open([Time.now.to_i.to_s, ".png"]) do |tempfile|
        tempfile.binmode
        IO.copy_stream(URI.open(image.dig("url")), tempfile)
        current_user.images.attach(io: tempfile, filename: image_params[:prompt])
      end
    end
  end

  # def attach_images
  #   @images.each do |image|
  #     Tempfile.open([Time.now.to_i.to_s, ".png"]) do |tempfile|
  #       tempfile.binmode
  #       URI.open(image.dig("url"), "rb") do |f|
  #         tempfile.write(f.read)
  #       end
  #       current_user.images.attach(io: tempfile, filename: image_params[:prompt])
  #     end
  #   end
  # end
end
