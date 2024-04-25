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
        @resp = client.create_chat_completion(params) do |data|
          update_result(data)
          broadcast_message(data)
        end
        handle_message_done
        raise "#{@resp.reason_phrase}: #{@resp.body}" if @resp.status != 200
      end
    rescue => e
      App::Error.track(e)
      # handle_exception(chunk)
    end

    def handle_message_done
      notify_done
      Message.transaction do
        message = Message.create!(
          content: result,
          user_id: GPT_USER_ID,
          mentions: [user_message.user_nickname],
        )
        update_conversation(role: "user", content: user_message.content.sub("@#{User.gpt_user[:nickname]} ", ""))
        update_conversation(role: "assistant", content: result)
      end
    end

    def broadcast_message(data)
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
        cut_conversation_messages while limit_exceeded?
        params[:messages] = conversation_messages
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

    def limit_exceeded?
      conversation_messages.size > 3 && tokens_of(conversation_messages).length > 3000
    end

    def tokens_of(messages)
      enc = Tiktoken.encoding_for_model("gpt-3.5-turbo")
      enc.encode(messages.to_s)
    end

    def conversation_messages
      user.ai_conversation_history
    end

    def cut_conversation_messages
      updated_messages = conversation_messages
      updated_messages.slice!(1, 2) # Removes 2 elements starting from index 1 (the second and third elements), because the first message is system instruction
      Rails.cache.write(user.conversation_cache_key, updated_messages, expires_in: 1.day)
    end

    def update_conversation(role:, content:)
      updated_messages = conversation_messages << { role: role, content: content }
      if updated_messages.size > 16
        updated_messages.slice!(1, 2)
      end
      Rails.cache.write(user.conversation_cache_key, updated_messages, expires_in: 1.day)
    end
  end
end
