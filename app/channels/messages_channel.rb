class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "MessagesChannel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    Message.transaction do
      mentioned_users = User.where(nickname: data["mentions"])
      message = Message.create(
        content: data["content"],
        user_id: current_user.id,
        mentioned_user_ids: mentioned_users.ids,
      )
      # message = Message.last(2).first
      ActionCable.server.broadcast("MessagesChannel", message.as_json(only: %i[content user_id], methods: %i[user_nickname user_avatar_url mentioned_users_nickname]))
    end
  end
end
