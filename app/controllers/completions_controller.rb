class CompletionsController < ApplicationController
  include ActionController::Live

  before_action :authenticate_user!

  # Deprecated
  def create
    client = OpenAI::Client.new(OPENAI_API_KEY)
    res = client.create_completion(completion_params.merge(
      model: "text-davinci-003",
      max_tokens: 500,
    ))
    response = JSON.parse(res.body)
    if res.status == 200
      render json: { status: :ok, message: response.dig("choices", 0, "text").strip }
    else
      render json: { status: :error, messsage: response.dig("error", "message") }
    end
  end

  def live_stream
    response.headers["Content-Type"] = "text/event-stream"
    response.headers["Last-Modified"] = Time.now.httpdate
    sse = SSE.new(response.stream, retry: 300)
    if can_chat?
      ChatCompletion::LiveStreamService.new(sse, current_user, params).call
      update_used_count
    else
      sse.write(status: 400, message: "limit exceeded")
    end
  ensure
    sse.close
  end

  private

  def can_chat?
    return false if current_user.openai_account.nil?

    data = YAML.load_file(Rails.root.join("config", "membership_plans.yml"))
    used_message_count < data.dig(current_user.membership, "message_limit_per_day")
  end

  def used_message_count
    @used_message_count ||= [
      Rails.cache.read(current_user.used_count_cache_key).to_i,
      Rails.cache.read("used_count:ip_#{request.remote_ip}").to_i,
    ].max
  end

  def update_used_count
    updated_count = used_message_count + 1
    Rails.cache.write(current_user.used_count_cache_key, updated_count, expires_at: Time.now.end_of_day)
    Rails.cache.write("used_count:ip_#{request.remote_ip}", updated_count, expires_at: Time.now.end_of_day)
  end

  def authenticate_user!
    warden.authenticate!
  end

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end
end
