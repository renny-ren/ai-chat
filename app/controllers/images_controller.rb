class ImagesController < ApplicationController
  before_action :authenticate_user!

  def generations
    current_user.messages.create!(
      conversation_id: conversation.id,
      content: image_params[:prompt],
    )
    if can?
      resp = Image::GenerateService.new(current_user, image_params.merge(size: "256x256")).call
      @image_url = resp.dig("data", 0, "url")
      conversation.messages.create!(
        user_id: GPT_USER_ID,
        content: "![#{image_params[:prompt][0..20]}](#{@image_url})",
      )
      current_user.update_used_count(request.remote_ip)
    end
  rescue => e
    render_json_response :error, message: e.message
  end

  private

  def can?
    data = YAML.load_file(Rails.root.join("config", "membership_plans.yml"))
    used_message_count < data.dig(current_user.membership, "message_limit_per_day")
  end

  def authenticate_user!
    warden.authenticate!
  end

  def image_params
    params.permit(:prompt)
  end

  def conversation
    @conversation ||= current_user.conversations.find_or_create_by(id: params[:conversation_id]) do |conversation|
      conversation.title = params[:prompt][0..30]
    end
  end
end
