class Model < ApplicationRecord
  belongs_to :user
  has_many :conversations

  delegate :nickname, to: :user, prefix: true

  has_one_attached :avatar, dependent: :purge

  validates :permalink, presence: true, uniqueness: true, length: 1..16
  validates_presence_of :title, :description, :system_instruction

  def avatar_url
    Rails.cache.fetch("model_#{id}_avatar_url", expires_in: 2.hours) do
      avatar.url
    end
  end
end
