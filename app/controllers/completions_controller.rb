class CompletionsController < ApplicationController
  def create
    res = Faraday.post("https://api.openai.com/v1/completions", completion_params.merge(model: 'text-davinci-003').to_json, headers)
    response = JSON.parse(res.body)
    if res.status == 200
      render json: { status: :ok, message: response.dig('choices', 0, 'text').strip }
    else
      render json: { status: :error, messsage: response.dig('error', 'message') }
    end
  end

  private

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :max_tokens, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end

  def headers
    {
      'Content-Type' => 'application/json',
      'Authorization' => "Bearer #{OPENAI_API_KEY}"
    }
  end
end
