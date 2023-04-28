class Model < ApplicationRecord
  belongs_to :user
  has_many :conversations

  delegate :nickname, to: :user, prefix: true
  delegate :avatar_url, to: :user, prefix: true

  has_one_attached :avatar, dependent: :purge

  validates :title, presence: true, uniqueness: true, length: 1..20
  validates :permalink, presence: true, uniqueness: true, length: 1..50, exclusion: {
                          in: ["app_messages", "pricing", "settings", "faqs", "disclaimer", "admin", "images", "girlfriend", "fortune", "developer_assistant", "mj_prompt", "models"],
                          message: "不能为%{value}",
                        }, format: { with: /\A[a-zA-Z0-9_-]+\z/, message: "只能为字母、数字、下划线或中横线" }
  validates :description, presence: true, length: { maximum: 60 }
  validates :system_instruction, presence: true, length: { maximum: 600 }
  validates :introduction, length: { maximum: 600 }

  scope :visible, -> { where(is_public: true) }

  def avatar_url
    Rails.cache.fetch("model_#{id}_avatar_url", expires_in: 2.hours) do
      avatar.url
    end
  end
end
