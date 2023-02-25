class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "MessagesChannel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    message = Message.create(content: data["content"], user_id: User.first.id)
    # message = Message.last
    ActionCable.server.broadcast("MessagesChannel", message.as_json(only: %i[content], methods: %i[user_nickname]))
  end
end
