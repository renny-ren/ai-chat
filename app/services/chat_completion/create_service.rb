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

    def call
      Retry.run(count: 2, after_retry: method(:notify_failure)) do
        @resp = client.create_chat_completion(params) do |chunk, overall_received_bytes, env|
          data = chunk[/data: (.*)\n\n$/, 1]

          if data.present?
            if data == "[DONE]"
              notify_done
              Message.transaction do
                message = Message.create!(
                  content: result,
                  user_id: GPT_USER_ID,
                  mentions: [user_message.user_nickname],
                )
                user_message.update_history(role: "assistant", content: result)
              end
            else
              response = JSON.parse(data)
              update_result(response)
              ActionCable.server.broadcast("MessagesChannel", {
                id: message_id,
                role: "assistant",
                content: result,
                user_id: robot_user.id,
                user_nickname: robot_user.nickname,
                user_avatar_url: robot_user.avatar_url,
                mentions: [user_message.user_nickname],
              })
            end
          end
        end
        raise @resp.reason_phrase if @resp.status != 200
      end
    end

    # dummy call
    # def call
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mo",
    #     user_id: robot_user.id,
    #     user_nickname: robot_user.nickname,
    #     user_avatar_url: robot_user.avatar_url,
    #     mentions: ["test"],
    #   })
    #   sleep 1
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mock",
    #     user_id: robot_user.id,
    #     user_nickname: robot_user.nickname,
    #     user_avatar_url: robot_user.avatar_url,
    #     mentions: ["test"],
    #   })
    #   sleep 1
    #   ActionCable.server.broadcast("MessagesChannel", {
    #     role: "assistant",
    #     id: message_id,
    #     content: "mock con",
    #     user_id: robot_user.id,
    #     user_nickname: robot_user.nickname,
    #     user_avatar_url: robot_user.avatar_url,
    #     mentions: ["test"],
    #   })
    #   sleep 1
    #   5.times do
    #     ActionCable.server.broadcast("MessagesChannel", {
    #       id: message_id,
    #       role: "assistant",
    #       content: "mock content",
    #       user_id: robot_user.id,
    #       user_nickname: robot_user.nickname,
    #       user_avatar_url: robot_user.avatar_url,
    #       mentions: ["test"],
    #     })
    #   end
    #   sleep 1
    #   signal_done
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
        user_id: robot_user.id,
        user_nickname: robot_user.nickname,
        user_avatar_url: robot_user.avatar_url,
        mentions: [user_message.user_nickname],
      })
    end

    def update_result(response)
      if response.dig("choices", 0, "delta", "content")
        @result = @result + response.dig("choices", 0, "delta", "content")
      end
    end

    def robot_user
      @robot_user ||= User.find(GPT_USER_ID)
    end
  end
end
