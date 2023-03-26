class MessagesChannel < ApplicationCable::Channel
  @@subscribed_users = [{ id: GPT_USER_ID, nickname: User.gpt_user_nickname }]

  def subscribed
    stream_from "MessagesChannel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    disappear_user
    stop_all_streams
  end

  def self.subscribed_users
    @@subscribed_users
  end

  def receive(data)
    if data["type"] == "appearance"
      appear_user
    else
      Message.transaction do
        @message = Message.create!(
          mentions: data["mentions"],
          content: data["content"],
          user_id: current_user.id,
        )
        ActionCable.server.broadcast("MessagesChannel", @message.as_item_json)
      end
      if data["is_to_ai"]
        @message.update_ai_conversation_history
        GenerateAiResponseJob.perform_now(@message.id)
      end
    end
  end

  def appear_user
    @@subscribed_users << {
      id: current_user.id,
      nickname: "#{current_user.nickname}#{current_user.is_a?(Visitor) ? @@subscribed_users.size : ""}",
      avatar_url: current_user.avatar_url,
    }
    ActionCable.server.broadcast("MessagesChannel", { type: "appearance", subscribers: @@subscribed_users.uniq })
  end

  def disappear_user
    @@subscribed_users.delete_if { |user| user[:id] == current_user.id }
    ActionCable.server.broadcast("MessagesChannel", { type: "appearance", subscribers: @@subscribed_users.uniq })
  end
end
