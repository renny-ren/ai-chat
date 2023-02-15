class CompletionsController < ApplicationController
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

  private

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end
end
