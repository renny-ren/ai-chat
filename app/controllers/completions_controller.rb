class CompletionsController < ApplicationController
  include ActionController::Live

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
    # sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How")
    # sleep 1
    # sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How van")
    # sleep 1
    # sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I ")
    # sleep 1
    # sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I htl")
    # sleep 1
    # sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help you !")
    # sse.write({ done: true })
    message = current_user.messages.create!(
      conversation_id: conversation.id,
      content: params[:prompt],
      role: Message.roles["user"],
    )

    params = {
      model: "gpt-3.5-turbo",
      messages: build_messages,
      max_tokens: 500,
      temperature: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    }

    conn = Faraday.new(
      url: "https://api.openai.com",
      params: params,
      headers: headers,
    )

    result = ""
    conn.post("/v1/chat/completions") do |req|
      req.body = params.to_json
      req.options.on_data = Proc.new do |chunk, overall_received_bytes, env|
        # puts "---chunk: #{chunk}"
        puts "===data: #{chunk[/data: (.*)\n\n$/, 1]}"
        data = chunk[/data: (.*)\n\n$/, 1]

        if data == "[DONE]"
          sse.write({ done: true, conversation_id: conversation.id, conversation_title: conversation.title })
          sse.close
          response_message = conversation.messages.create!(
            role: Message.roles["assistant"],
            content: result,
            user_id: GPT_USER_ID,
          )
          response_message.save!
        else
          response = JSON.parse(data)
          if response.dig("choices", 0, "delta", "content")
            result = result + response.dig("choices", 0, "delta", "content")
          end
          sse.write(id: response.dig("id"), role: "assistant", content: result)
        end
      end
    end
  ensure
    sse.close
  end

  private

  def completion_params
    params.require(:completion).permit(:prompt, :temperature, :top_p, :frequency_penalty, :presence_penalty, :stop)
  end

  def build_messages
    [initial_messages << conversation.messages.order(:created_at).last(20).map { |i| { role: i.role, content: i.content } }].flatten
  end

  def headers
    {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{OPENAI_API_KEY}",
    }
  end

  def initial_messages
    [
      { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
    ]
  end

  def conversation
    @conversation ||= current_user.conversations.find_or_create_by(id: params[:conversation_id]) do |conversation|
      conversation.title = params[:prompt][0..30]
    end
  end
end
