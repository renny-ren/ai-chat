class MessagesChannel < ApplicationCable::Channel
  @@subscribed_users = [{ id: GPT_USER_ID, nickname: User.find(GPT_USER_ID)&.nickname }]

  def subscribed
    # appear_user if current_user.present?
    stream_from "MessagesChannel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    disappear_user if current_user.present?
    stop_all_streams
  end

  def self.subscribed_users
    @@subscribed_users
  end

  def receive(data)
    if data["type"] == "appearance"
      appear_user if current_user.present?
    else
      Message.transaction do
        mentioned_users = User.where(nickname: data["mentions"])
        message = Message.create!(
          content: data["content"],
          user_id: current_user.id,
          mentioned_user_ids: mentioned_users.ids,
        )
        ActionCable.server.broadcast("MessagesChannel", message.as_item_json)
      end
    end
  end

  def appear_user
    @@subscribed_users << { id: current_user.id, nickname: current_user.nickname }
    ActionCable.server.broadcast("MessagesChannel", { type: "appearance", subscribers: @@subscribed_users })
  end

  def disappear_user
    @@subscribed_users.delete_if { |user| user[:id] == current_user.id }
    ActionCable.server.broadcast("MessagesChannel", { type: "appearance", subscribers: @@subscribed_users })
  end
end
