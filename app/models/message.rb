class Message < ApplicationRecord
  belongs_to :user
  belongs_to :conversation, optional: true
  has_many :replies, class_name: "::Message", foreign_key: :parent_id, dependent: :destroy
  belongs_to :parent, class_name: "::Message", foreign_key: :parent_id, optional: true

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true

  # scope :to_ai, -> { where("mentioned_user_ids @> ?", GPT_USER_ID) }
  scope :to_ai, -> { where("? = ANY(mentioned_user_ids)", GPT_USER_ID) }
  scope :chatroom, -> { where("conversation_id is NULL") }
  scope :for_conversation, ->(conversation_id) { where(conversation_id: conversation_id) }

  def update_ai_conversation_history
    update_history(role: "user", content: self.content.sub("@#{robot_user.nickname} ", ""))
  end

  def role
    user_id == GPT_USER_ID ? "assistant" : "user"
  end

  def as_item_json
    as_json(only: %i[content user_id mentions], methods: %i[user_nickname user_avatar_url role], include: { user: { only: [:nickname, :id] } })
  end

  def ai_conversation_history
    Rails.cache.fetch(self.user.conversation_cache_key, expires_in: 1.day) do
      initial_messages
    end
  end

  def update_history(role:, content:)
    updated_history = ai_conversation_history << { role: role, content: content }
    if updated_history.size > 20
      updated_history.delete_at(1)
      updated_history.delete_at(2)
    end
    Rails.cache.write(self.user.conversation_cache_key, updated_history, expires_in: 1.day)
  end

  private

  def initial_messages
    [
      { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Current date: #{Date.today.to_s}" },
    ]
  end

  def robot_user
    @robot_user ||= User.find(GPT_USER_ID)
  end
end
