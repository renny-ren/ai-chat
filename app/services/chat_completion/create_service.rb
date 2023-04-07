module ChatCompletion
  class CreateService
    attr_reader :user_message, :params, :message_id
    attr_accessor :result

    def initialize(user_message, params)
      @user_message = user_message
      @params = params
      @result = ""
      @message_id = SecureRandom.uuid
    end

    # {"error"=>{"message"=>"This model's maximum context length is 4097 tokens. However, you requested 4569 tokens (4069 in the messages, 500 in the completion). Please reduce the length of the messages or completion.", "type"=>"invalid_request_error", "param"=>"messages", "code"=>"context_length_exceeded"}}
    def call
      Retry.run(count: 2, after_retry: method(:notify_failure)) do
        @resp = client.create_chat_completion(params) do |chunk, overall_received_bytes, env|
          data = chunk[/data: (.*)\n\n$/, 1]

          if data.present?
            data == "[DONE]" ? handle_message_done : broadcast_message(data)
          else
            handle_exception(chunk)
          end
        end
        raise @resp.reason_phrase if @resp.status != 200
      end
    end

    def handle_message_done
      notify_done
      Message.transaction do
        message = Message.create!(
          content: result,
          user_id: GPT_USER_ID,
          mentions: [user_message.user_nickname],
        )
        user.update_history(role: "user", content: user_message.content.sub("@#{User.gpt_user[:nickname]} ", ""))
        user.update_history(role: "assistant", content: result)
      end
    end

    def broadcast_message(data)
      response = JSON.parse(data)
      update_result(response)
      ActionCable.server.broadcast("MessagesChannel", {
        id: message_id,
        role: "assistant",
        content: result,
        user_id: GPT_USER_ID,
        user_nickname: User.gpt_user[:nickname],
        user_avatar_url: User.gpt_user[:avatar_url],
        mentions: [user_message.user_nickname],
        created_at: Time.now.in_time_zone("Asia/Shanghai").strftime("%H:%M:%S"),
      })
    end

    def handle_exception(chunk)
      raise OpenAi::ChatCompletionError if !valid_json?(chunk)

      error_code = JSON.parse(chunk).dig("error", "code")
      if error_code == "context_length_exceeded"
        user.cut_ai_conversation_history
        params[:messages] = user.ai_conversation_history
      end
    end

    # dummy call
    # def call
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mo",
    #     user_id: GPT_USER_ID,
    #     user_nickname: User.gpt_user[:nickname],
    #     user_avatar_url: User.gpt_user[:avatar_url],
    #     mentions: ["test"],
    #   })
    #   sleep 10
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mock",
    #     user_id: GPT_USER_ID,
    #     user_nickname: User.gpt_user[:nickname],
    #     user_avatar_url: User.gpt_user[:avatar_url],
    #     mentions: ["test"],
    #   })
    #   sleep 1
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mock con",
    #     user_id: GPT_USER_ID,
    #     user_nickname: User.gpt_user[:nickname],
    #     user_avatar_url: User.gpt_user[:avatar_url],
    #     mentions: ["test"],
    #   })
    #   sleep 1
    #   5.times do
    #     ActionCable.server.broadcast("MessagesChannel", {
    #       id: message_id,
    #       role: "assistant",
    #       content: "mock content",
    #       user_id: GPT_USER_ID,
    #       user_nickname: User.gpt_user[:nickname],
    #       user_avatar_url: User.gpt_user[:avatar_url],
    #       mentions: ["test"],
    #     })
    #   end
    #   sleep 1
    #   notify_done
    # end

    private

    def client
      @client ||= OpenAI::Client.new([OPENAI_API_KEY, OPENAI_API_KEY2].sample)
    end

    def notify_done
      ActionCable.server.broadcast("MessagesChannel", {
        status: 200,
        id: message_id,
        done: true,
      })
    end

    def notify_failure
      ActionCable.server.broadcast("MessagesChannel", {
        status: @resp.status,
        done: true,
        id: message_id,
        role: "assistant",
        content: @resp.reason_phrase,
        user_id: GPT_USER_ID,
        user_nickname: User.gpt_user[:nickname],
        user_avatar_url: User.gpt_user[:avatar_url],
        mentions: [user_message.user_nickname],
      })
    end

    def update_result(response)
      if response.dig("choices", 0, "delta", "content")
        @result = @result + response.dig("choices", 0, "delta", "content")
      end
    end

    def user
      @user ||= @user_message.user
    end

    def valid_json?(json)
      JSON.parse(json)
      true
    rescue JSON::ParserError, TypeError => e
      false
    end
  end
end
