class CompletionsController < ApplicationController
  include ActionController::Live

  before_action :authenticate_user!

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
    ChatCompletion::LiveStreamService.new(sse, current_user, params).call
    update_used_count
  ensure
    sse.close
  end

  private

  def update_used_count
    current_count = Rails.cache.read(current_user.used_count_cache_key) || 0
    Rails.cache.write(current_user.used_count_cache_key, current_count + 1, expires_at: Time.now.end_of_day)
  end

  def authenticate_user!
    warden.authenticate!
  end

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end
end
