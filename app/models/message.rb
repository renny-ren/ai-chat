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

  def role
    user_id == GPT_USER_ID ? "assistant" : "user"
  end

  def to_builder
    Jbuilder.new do |message|
      message.(self, :id, :content, :user_id, :user_nickname, :user_avatar_url, :mentions, :role)
      message.created_at self.created_at.in_time_zone("Asia/Shanghai").strftime("%H:%M:%S")
    end
  end

  def as_item_json
    as_json(only: %i[content user_id mentions], methods: %i[user_nickname user_avatar_url role], include: { user: { only: [:nickname, :id] } })
  end
end
