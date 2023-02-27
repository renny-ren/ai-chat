class Message < ApplicationRecord
  GPT_USER_ID = 13.freeze

  belongs_to :user

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true

  after_commit :generate_response, on: :create, if: :mentioned_ai?

  def generate_response
    client = OpenAI::Client.new(OPENAI_API_KEY)
    res = client.create_completion(
      model: "text-davinci-003",
      max_tokens: 500,
      prompt: self.content,
    )
    response = JSON.parse(res.body)

    Message.transaction do
      mentioned_users = User.where(id: self.user_id)
      message = Message.create(
        content: response.dig("choices", 0, "text").strip,
        user_id: robot_user.id,
        mentioned_user_ids: mentioned_users.ids,
      )
      ActionCable.server.broadcast("MessagesChannel", {
        content: message.content,
        user_id: message.user_id,
        user_nickname: message.user_nickname,
        user_avatar_url: message.user_avatar_url,
        mentioned_users_nickname: mentioned_users.map(&:nickname),
      })
    end
  end

  def mentioned_users_nickname
    id_nickname_array = Rails.cache.fetch("id_nickname_array", expires_in: 30.seconds) do
      User.all.pluck(:id, :nickname)
    end
    id_nickname_array.select { |item| mentioned_user_ids.include?(item[0]) }.map { |item| item[1] }
    # User.where(id: self.mentioned_user_ids).map(&:nickname)
  end

  def as_item_json
    as_json(only: %i[content user_id], methods: %i[user_nickname user_avatar_url mentioned_users_nickname], include: { user: { only: [:nickname, :id] } })
  end

  private

  def robot_user
    User.find(GPT_USER_ID)
  end

  def mentioned_ai?
    self.mentioned_user_ids.include?(robot_user.id)
  end
end
