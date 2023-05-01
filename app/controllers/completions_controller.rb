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
      ChatCompletion::LiveStreamService.new(sse, current_user, live_stream_params).call
      current_user.update_used_count(request.remote_ip)
    else
      sse.write(done: true, status: 400, content: "limit exceeded")
    end
  ensure
    sse.close
  end

  private

  def can_chat?
    data = YAML.load_file(Rails.root.join("config", "membership_plans.yml"))
    current_user.used_message_count(request.remote_ip) < data.dig(current_user.membership, "message_limit_per_day")
  end

  def authenticate_user!
    warden.authenticate!
  end

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end

  def live_stream_params
    params.permit(:prompt, :conversation_id, :conversation_title, :conversation_type, :model_id)
  end
end
