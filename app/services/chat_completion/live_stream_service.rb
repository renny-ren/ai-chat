module ChatCompletion
  class LiveStreamService
    MODEL = "gpt-3.5-turbo".freeze

    attr_reader :sse, :current_user, :params
    attr_accessor :result

    def initialize(sse, current_user, params)
      @sse = sse
      @current_user = current_user
      @params = params
      @result = ""
    end

    # ==返回消息示例==
    # 消息请求正常，接收中：sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help")
    # 消息请求正常，接收完成：sse.write(status: 200, done: true, conversation_id: id, conversation_title: title)
    # 消息请求异常：sse.write(status: 400, content: "Too Many Requests")
    def call
      # dummy_call
      current_user.messages.create!(
        conversation_id: conversation.id,
        content: params[:prompt],
      )

      Retry.run(count: 2, after_retry: method(:notify_failure)) do
        @resp = client.create_chat_completion(request_body) do |chunk, overall_received_bytes, env|
          data = chunk[/data: (.*)\n\n$/, 1]

          if data.present?
            data == "[DONE]" ? handle_message_done : send_message(data)
          else
            handle_exception(chunk)
          end
        end
        raise @resp.reason_phrase if @resp.status != 200
      end
    end

    def notify_failure
      sse.write({ status: @resp.status, content: @resp.reason_phrase })
    end

    def handle_message_done
      sse.write({ done: true, status: 200, conversation_id: conversation.id, conversation_title: conversation.title })
      sse.close
      conversation.messages.create!(
        content: @result,
        user_id: GPT_USER_ID,
      )
    end

    def send_message(data)
      response = JSON.parse(data)
      if response.dig("choices", 0, "delta", "content")
        @result = @result + response.dig("choices", 0, "delta", "content")
      end
      sse.write(status: 200, id: response.dig("id"), role: "assistant", content: @result)
    end

    def handle_exception(chunk)
      if valid_json?(chunk)
        error_code = JSON.parse(chunk).dig("error", "code")
        error_message = JSON.parse(chunk).dig("error", "message")
        sse.write({ status: 400, content: error_code })
        raise "[user_#{current_user.id}] #{error_code}: #{error_message}"
      end
    end

    private

    def client
      @client ||= OpenAI::Client.new(current_user.openai_account&.secret_key || OPENAI_API_KEY)
    end

    def dummy_call
      sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How")
      sleep 1
      sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can")
      sleep 1
      sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I ")
      sleep 1
      sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help")
      sleep 1
      sse.write(status: 200, id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", role: "assistant", content: "How can I help you !")
      sse.write(status: 200, done: true, conversation_id: "chatcmpl-6tEcfvsNYJKPOidWfZnCIk95Q9Qra", conversation_title: "This is a test title")
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
      messages = [initial_messages << conversation.messages.order(:created_at).last(16).map { |i| { role: i.role, content: i.content } }].flatten
      until messages.to_s.size < 2000
        messages.slice!(1, 2) # Removes 2 elements starting from index 1 (the second and third elements)
      end
      messages
    end

    def initial_messages
      YAML.load_file(Rails.root.join("config", "prompts.yml")).dig(params[:type]) || [
        { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
      ]
    end

    def conversation
      @conversation ||= current_user.conversations.find_or_create_by(id: params[:conversation_id]) do |conversation|
        conversation.title = params[:conversation_title] || params[:prompt][0..30]
      end
    end

    def valid_json?(json)
      JSON.parse(json)
      true
    rescue JSON::ParserError, TypeError => e
      false
    end
  end
end
