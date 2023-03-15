module ChatCompletion
  class LiveStreamService
    MODEL = "gpt-3.5-turbo".freeze
    MESSAGE_LIMIT_PER_DAY = 5.freeze

    attr_reader :sse, :current_user, :params

    def initialize(sse, current_user, params)
      @sse = sse
      @current_user = current_user
      @params = params
    end

    def call
      if current_user.used_message_count >= MESSAGE_LIMIT_PER_DAY
        sse.write({ error: true, message: "limit excceeded" })
        sse.close
        return
      end

      # dummy_call
      current_user.messages.create!(
        conversation_id: conversation.id,
        content: params[:prompt],
        role: Message.roles["user"],
      )

      result = ""
      conn = Faraday.new(
        url: "https://api.openai.com",
        headers: headers,
      )
      conn.post("/v1/chat/completions") do |req|
        req.body = request_body.to_json
        req.options.on_data = Proc.new do |chunk, overall_received_bytes, env|
          # puts "---chunk: #{chunk}"
          # puts "===data: #{chunk[/data: (.*)\n\n$/, 1]}"
          data = chunk[/data: (.*)\n\n$/, 1]

          if data == "[DONE]"
            sse.write({ done: true, conversation_id: conversation.id, conversation_title: conversation.title })
            sse.close
            conversation.messages.create!(
              role: Message.roles["assistant"],
              content: result,
              user_id: GPT_USER_ID,
            )
          else
            response = JSON.parse(data)
            if response.dig("choices", 0, "delta", "content")
              result = result + response.dig("choices", 0, "delta", "content")
            end
            sse.write(id: response.dig("id"), role: "assistant", content: result)
          end
        end
      end
    end

    private

    def dummy_call
      sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How")
      sleep 1
      sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can")
      sleep 1
      sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I ")
      sleep 1
      sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help")
      sleep 1
      sse.write(id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help you !")
      sse.write(done: true, conversation_id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", conversation_title: "This is a test title")
      sse.close
    end

    def request_body
      {
        model: MODEL,
        messages: build_messages,
        max_tokens: 500,
        temperature: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      }
    end

    def build_messages
      [initial_messages << conversation.messages.order(:created_at).last(20).map { |i| { role: i.role, content: i.content } }].flatten
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

    def headers
      {
        "Content-Type" => "application/json",
        "Authorization" => "Bearer #{OPENAI_API_KEY}",
      }
    end
  end
end
